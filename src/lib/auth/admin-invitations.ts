import "server-only";

import { createHash, randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import mongoose, { Types } from "mongoose";

import { connectDb } from "@/src/lib/mongoDb";
import { UserModel } from "@/src/lib/mongoDb/users";
import { consumeAuthAttempt } from "./credentials";

type Actor = { id: string; sessionVersion: number };
type Invitation = {
  _id: string;
  email: string;
  issuerId: Types.ObjectId;
  issuerVersion: number;
  expiresAt: Date;
};

export class InvitationError extends Error {}

async function invitationCollection() {
  const db = await connectDb();
  const invitations = db.collection<Invitation>("auth_admin_invitations");
  await invitations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return invitations;
}

async function roleLock() {
  const db = await connectDb();
  const locks = db.collection<{ _id: string; revision: number }>("auth_role_management");
  await locks.updateOne({ _id: "roles" }, { $setOnInsert: { revision: 0 } }, { upsert: true });
  return locks;
}

export async function createAdminInvitation(actor: Actor, input: string) {
  const email = input.trim().toLowerCase();
  if (!Types.ObjectId.isValid(actor.id) || !Number.isSafeInteger(actor.sessionVersion)) {
    throw new InvitationError("Please sign in as an administrator.");
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(email)) {
    throw new InvitationError("Enter a valid email address.");
  }
  const db = await connectDb();
  const invitations = await invitationCollection();
  const locks = await roleLock();
  const token = randomBytes(32).toString("hex");
  const issuerId = new Types.ObjectId(actor.id);
  await mongoose.connection.transaction(async (session) => {
    await locks.updateOne({ _id: "roles" }, { $inc: { revision: 1 } }, { session });
    const admin = await UserModel.findOne({ _id: issuerId, role: { $in: ["admin", "owner"] } }).session(session).lean();
    const credentials = await db.collection<{ _id: Types.ObjectId; sessionVersion?: number }>("auth_credentials")
      .findOne({ _id: issuerId }, { session });
    if (!admin || !credentials || (credentials.sessionVersion ?? 0) !== actor.sessionVersion) {
      throw new InvitationError("Your administrator session is no longer authorized.");
    }
    if (await UserModel.findOne({ email }).collation({ locale: "en", strength: 2 }).session(session).lean()) {
      throw new InvitationError("An account already exists for this email. Promote a verified customer instead.");
    }
    await invitations.insertOne({
      _id: createHash("sha256").update(token).digest("hex"),
      email,
      issuerId,
      issuerVersion: actor.sessionVersion,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }, { session });
  });
  return token;
}

export async function redeemAdminInvitation(formData: FormData) {
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmation = formData.get("confirmation");
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return { ok: false, message: "This invitation is invalid or has expired." };
  }
  if (typeof password !== "string" || password.length < 14 || password.length > 128 ||
      password !== confirmation) {
    return { ok: false, message: "Passwords must match and contain 14 to 128 characters." };
  }

  const id = createHash("sha256").update(token).digest("hex");
  if (!await consumeAuthAttempt("admin-invitation", id)) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }
  const invitations = await invitationCollection();
  if (!await invitations.findOne({ _id: id, expiresAt: { $gt: new Date() } })) {
    return { ok: false, message: "This invitation is invalid or has expired." };
  }
  const passwordHash = await argon2.hash(password);
  const db = await connectDb();
  const locks = await roleLock();
  try {
    await mongoose.connection.transaction(async (session) => {
      await locks.updateOne({ _id: "roles" }, { $inc: { revision: 1 } }, { session });
      const invitation = await invitations.findOneAndDelete(
        { _id: id, expiresAt: { $gt: new Date() } }, { session },
      );
      if (!invitation) throw new InvitationError("This invitation is invalid or has expired.");
      const admin = await UserModel.findOne({ _id: invitation.issuerId, role: { $in: ["admin", "owner"] } }).session(session).lean();
      const credentials = db.collection<{ _id: Types.ObjectId; passwordHash: string; sessionVersion?: number }>("auth_credentials");
      const issuerCredential = await credentials.findOne({ _id: invitation.issuerId }, { session });
      if (!admin || !issuerCredential || (issuerCredential.sessionVersion ?? 0) !== invitation.issuerVersion) {
        throw new InvitationError("This invitation is no longer valid.");
      }
      if (await UserModel.findOne({ email: invitation.email }).collation({ locale: "en", strength: 2 }).session(session).lean()) {
        throw new InvitationError("An account already exists for this email.");
      }
      const [user] = await UserModel.create([{ email: invitation.email, role: "admin" }], { session });
      await credentials.insertOne({ _id: user._id, passwordHash }, { session });
      await invitations.deleteMany({ email: invitation.email }, { session });
    });
  } catch (error) {
    if (error instanceof InvitationError) return { ok: false, message: error.message };
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      return { ok: false, message: "An account already exists for this email." };
    }
    throw error;
  }
  return { ok: true, message: "Your administrator account is ready. You can now sign in." };
}
