import "server-only";

import mongoose, { Types } from "mongoose";

import { connectDb } from "@/src/lib/mongoDb";
import { UserModel } from "@/src/lib/mongoDb/users";

export class RoleChangeError extends Error {}

type Actor = { id: string; sessionVersion: number };
type Change = { kind: "promote"; email: string } | { kind: "demote" | "make-owner" | "remove-owner"; id: string };

export async function changeStaffRole(actor: Actor, change: Change) {
  if (!Types.ObjectId.isValid(actor.id) || !Number.isSafeInteger(actor.sessionVersion)) {
    throw new RoleChangeError("Please sign in as an administrator.");
  }
  if (change.kind === "promote" &&
      (change.email.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(change.email))) {
    throw new RoleChangeError("Enter a valid customer email address.");
  }
  if (change.kind !== "promote" && !Types.ObjectId.isValid(change.id)) {
    throw new RoleChangeError("The administrator could not be found.");
  }

  const db = await connectDb();
  const locks = db.collection<{ _id: string; revision: number }>("auth_role_management");
  await locks.updateOne({ _id: "roles" }, { $setOnInsert: { revision: 0 } }, { upsert: true });

  await mongoose.connection.transaction(async (session) => {
    await locks.updateOne({ _id: "roles" }, { $inc: { revision: 1 } }, { session });
    const actorId = new Types.ObjectId(actor.id);
    const currentAdmin = await UserModel.findOne({ _id: actorId, role: { $in: ["admin", "owner"] } }).session(session).lean();
    const credentials = db.collection<{ _id: Types.ObjectId; sessionVersion?: number }>("auth_credentials");
    const actorCredential = await credentials.findOne({ _id: actorId }, { session });
    if (!currentAdmin || !actorCredential || (actorCredential.sessionVersion ?? 0) !== actor.sessionVersion) {
      throw new RoleChangeError("Your administrator session is no longer authorized.");
    }

    const target = change.kind === "promote"
      ? await UserModel.findOne({ email: change.email }).collation({ locale: "en", strength: 2 }).session(session).lean()
      : await UserModel.findById(change.id).session(session).lean();
    if (!target) throw new RoleChangeError("The selected user could not be found.");
    if (target._id.equals(actorId)) throw new RoleChangeError("You cannot change your own administrator role.");
    if (change.kind === "promote" && target.role !== "customer") {
      throw new RoleChangeError("This user is already an administrator.");
    }
    if (change.kind === "promote" && !target.emailVerifiedAt) {
      throw new RoleChangeError("The customer must verify their email before becoming an administrator.");
    }
    if (change.kind === "demote" && target.role !== "admin") {
      throw new RoleChangeError("This user is no longer an administrator.");
    }
    if (change.kind === "make-owner" || change.kind === "remove-owner") {
      if (currentAdmin.role !== "owner") throw new RoleChangeError("Only an owner can change owner roles.");
      if (change.kind === "make-owner" && target.role !== "admin") {
        throw new RoleChangeError("Only an administrator can become an owner.");
      }
      if (change.kind === "remove-owner" && target.role !== "owner") {
        throw new RoleChangeError("This user is no longer an owner.");
      }
      if (change.kind === "remove-owner" && await UserModel.countDocuments({ role: "owner" }).session(session) <= 1) {
        throw new RoleChangeError("At least one owner must remain.");
      }
    }

    const credentialUpdate = await credentials.updateOne(
      { _id: target._id }, { $inc: { sessionVersion: 1 } }, { session },
    );
    if (credentialUpdate.matchedCount !== 1) {
      throw new RoleChangeError("This user has no sign-in credentials.");
    }
    await UserModel.updateOne(
      { _id: target._id },
      { $set: { role: change.kind === "demote" ? "customer" : change.kind === "make-owner" ? "owner" : "admin" } },
      { session, runValidators: true },
    );
  });
}
