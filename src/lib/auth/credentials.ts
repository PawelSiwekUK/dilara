import "server-only";

import { createHash } from "node:crypto";
import * as argon2 from "argon2";
import { RateLimiterMongo, RateLimiterRes } from "rate-limiter-flexible";
import type { Types } from "mongoose";

import { connectDb } from "@/src/lib/mongoDb";
import { UserModel } from "@/src/lib/mongoDb/users";

type PasswordCredential = {
  _id: Types.ObjectId;
  passwordHash: string;
  sessionVersion?: number;
};

let limitersPromise: Promise<{ global: RateLimiterMongo; account: RateLimiterMongo }> | undefined;
let dummyHashPromise: Promise<string> | undefined;

async function getLimiters() {
  if (!limitersPromise) {
    limitersPromise = (async () => {
      const db = await connectDb();
      const options = { storeClient: db, tableName: "auth_rate_limits", disableIndexesCreation: true };
      const global = new RateLimiterMongo({ ...options, keyPrefix: "global", points: 100, duration: 900 });
      const account = new RateLimiterMongo({ ...options, keyPrefix: "account", points: 5, duration: 900 });
      await global.createIndexes();
      return { global, account };
    })().catch((error) => {
      limitersPromise = undefined;
      throw error;
    });
  }
  return limitersPromise;
}

export async function consumeAuthAttempt(action: string, email: string) {
  const limiters = await getLimiters();
  try {
    await limiters.global.consume(action);
    const key = action === "login" ? email : `${action}:${email}`;
    await limiters.account.consume(createHash("sha256").update(key).digest("hex"));
    return true;
  } catch (error) {
    if (error instanceof RateLimiterRes) return false;
    throw error;
  }
}

export async function verifyCredentials(credentials: Partial<Record<string, unknown>>, role: "admin" | "customer") {
  if (
    typeof credentials.email !== "string" ||
    typeof credentials.password !== "string" ||
    credentials.email.length > 254 ||
    credentials.password.length > 128 ||
    credentials.password.length === 0
  ) {
    return null;
  }

  const email = credentials.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) return null;

  if (!await consumeAuthAttempt("login", email)) return null;

  const db = await connectDb();
  const user = await UserModel.findOne({ email }).collation({ locale: "en", strength: 2 }).lean();
  const credential = user
    ? await db.collection<PasswordCredential>("auth_credentials").findOne({ _id: user._id })
    : null;
  dummyHashPromise ??= argon2.hash("dummy-password-for-timing");
  const valid = await argon2.verify(credential?.passwordHash ?? await dummyHashPromise, credentials.password);

  if (!valid || !user || !credential ||
      (role === "admin" ? user.role !== "admin" && user.role !== "owner" : user.role !== "customer")) return null;
  if (role === "customer" && !user.emailVerifiedAt) return null;
  return {
    id: user._id.toHexString(),
    email: user.email,
    name: user.name ?? null,
    sessionVersion: credential.sessionVersion ?? 0,
    rememberMe: credentials.rememberMe === "true",
  };
}
