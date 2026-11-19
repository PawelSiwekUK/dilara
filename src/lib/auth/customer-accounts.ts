import "server-only";

import { createHash, randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import mongoose from "mongoose";
import { Resend } from "resend";

import { connectDb } from "@/src/lib/mongoDb";
import { UserModel } from "@/src/lib/mongoDb/users";
import { consumeAuthAttempt } from "./credentials";

type Purpose = "register" | "reset";
type AccountToken = { _id: string; email: string; purpose: Purpose; expiresAt: Date };
export type AccountResult = { ok: boolean; message: string };

class InvalidAccountToken extends Error {}
export class AccountEmailError extends Error {}

function emailConfig() {
  const { RESEND_API_KEY: apiKey, EMAIL_FROM: from, APP_URL: appUrl } = process.env;
  if (!apiKey || !from || !appUrl) {
    throw new AccountEmailError("RESEND_API_KEY, EMAIL_FROM and APP_URL must be configured");
  }
  let url: URL;
  try {
    url = new URL(appUrl);
  } catch (error) {
    if (error instanceof TypeError) throw new AccountEmailError("APP_URL is not a valid URL");
    throw error;
  }
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
      (url.protocol !== "https:" && !(local && url.protocol === "http:" && process.env.NODE_ENV !== "production"))) {
    throw new AccountEmailError("APP_URL must be an HTTPS origin (HTTP localhost is allowed in development)");
  }
  return { apiKey, from, origin: url.origin };
}

function normalizeEmail(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length > 254) return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+$/.test(email) ? email : null;
}

async function tokenCollection() {
  const db = await connectDb();
  const tokens = db.collection<AccountToken>("auth_tokens");
  await tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return tokens;
}

export async function requestAccountEmail(purpose: Purpose, formData: FormData): Promise<AccountResult> {
  const email = normalizeEmail(formData.get("email"));
  if (!email) return { ok: false, message: "Enter a valid email address." };
  const config = emailConfig();
  if (!await consumeAuthAttempt(purpose, email)) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const user = await UserModel.findOne({ email }).collation({ locale: "en", strength: 2 }).lean();
  const message = purpose === "register"
    ? "If this email can be registered, a verification link will be sent."
    : "If this email has a customer account, a reset link will be sent.";
  if ((purpose === "register" && user && (user.role !== "customer" || user.emailVerifiedAt)) ||
      (purpose === "reset" && (!user || user.role !== "customer" || !user.emailVerifiedAt))) {
    return { ok: true, message };
  }

  const token = randomBytes(32).toString("hex");
  const tokens = await tokenCollection();
  await tokens.insertOne({
    _id: createHash("sha256").update(token).digest("hex"),
    email,
    purpose,
    expiresAt: new Date(Date.now() + (purpose === "register" ? 60 : 30) * 60 * 1000),
  });
  const url = new URL(purpose === "register" ? "/account/verify" : "/account/reset", config.origin);
  url.hash = `token=${token}`;
  const subject = purpose === "register" ? "Verify your email" : "Reset your password";
  const { data, error } = await new Resend(config.apiKey).emails.send({
    from: config.from,
    to: [email],
    subject,
    text: `${subject}: ${url.toString()}\n\nIf you did not request this, you can ignore this email.`,
  });
  if (error) {
    const reason = error.message.includes("You can only send testing emails to your own email address")
      ? ", test recipient restriction"
      : error.message.includes("domain is not verified")
        ? ", sender domain not verified"
        : "";
    throw new AccountEmailError(`Unable to send account email through Resend (${error.name}, status ${error.statusCode ?? "unknown"}${reason})`);
  }
  if (!data) throw new AccountEmailError("Unable to send account email through Resend (empty response)");
  return { ok: true, message };
}

export async function completeAccountToken(purpose: Purpose, formData: FormData): Promise<AccountResult> {
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmation = formData.get("confirmation");
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return { ok: false, message: "This link is invalid or has expired." };
  }
  if (typeof password !== "string" || password.length < 14 || password.length > 128 ||
      password !== confirmation) {
    return { ok: false, message: "Passwords must match and contain 14 to 128 characters." };
  }
  const tokens = await tokenCollection();
  const id = createHash("sha256").update(token).digest("hex");
  const pending = await tokens.findOne({ _id: id, purpose, expiresAt: { $gt: new Date() } });
  if (!pending) return { ok: false, message: "This link is invalid or has expired." };
  if (!await consumeAuthAttempt(`${purpose}-complete`, pending.email)) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const passwordHash = await argon2.hash(password);
  const db = await connectDb();
  try {
    await mongoose.connection.transaction(async (session) => {
      const current = await tokens.findOneAndDelete(
        { _id: id, purpose, expiresAt: { $gt: new Date() } },
        { session },
      );
      if (!current) throw new InvalidAccountToken();
      const user = await UserModel.findOne({ email: current.email })
        .collation({ locale: "en", strength: 2 }).session(session);
      if (purpose === "register") {
        if (user) {
          if (user.role !== "customer" || user.emailVerifiedAt) throw new InvalidAccountToken();
          await UserModel.updateOne({ _id: user._id }, { $set: { emailVerifiedAt: new Date() } }, { session });
          await db.collection("auth_credentials").updateOne(
            { _id: user._id },
            { $set: { passwordHash }, $inc: { sessionVersion: 1 } },
            { session, upsert: true },
          );
        } else {
          const [created] = await UserModel.create(
            [{ email: current.email, role: "customer", emailVerifiedAt: new Date() }],
            { session },
          );
          await db.collection("auth_credentials").insertOne(
            { _id: created._id, passwordHash, sessionVersion: 0 }, { session },
          );
        }
      } else {
        if (!user || user.role !== "customer" || !user.emailVerifiedAt) throw new InvalidAccountToken();
        const result = await db.collection("auth_credentials").updateOne(
          { _id: user._id }, { $set: { passwordHash }, $inc: { sessionVersion: 1 } }, { session },
        );
        if (result.matchedCount !== 1) throw new Error("Customer password credential is missing");
      }
      await tokens.deleteMany({ email: current.email, purpose }, { session });
    });
  } catch (error) {
    if (error instanceof InvalidAccountToken ||
        (error instanceof mongoose.mongo.MongoServerError && error.code === 11000)) {
      return { ok: false, message: "This link is invalid or has expired." };
    }
    throw error;
  }

  return {
    ok: true,
    message: purpose === "register"
      ? "Your email is verified. You can now sign in."
      : "Your password was reset. You can now sign in.",
  };
}
