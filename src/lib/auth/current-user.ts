import "server-only";

import { Types } from "mongoose";

import { auth } from "@/src/auth";
import { connectDb } from "@/src/lib/mongoDb";
import { UserModel } from "@/src/lib/mongoDb/users";

export async function getCurrentUser() {
  const session = await auth();
  const id = session?.user?.id;
  const version = session?.user?.sessionVersion;
  if (!id || !Types.ObjectId.isValid(id) || typeof version !== "number") return null;

  const db = await connectDb();
  const objectId = new Types.ObjectId(id);
  const user = await UserModel.findById(objectId).lean();
  const credential = await db.collection<{ _id: Types.ObjectId; sessionVersion?: number }>("auth_credentials")
    .findOne({ _id: objectId }, { projection: { sessionVersion: 1 } });
  if (!user || !credential || (credential.sessionVersion ?? 0) !== version) return null;
  if (user.role === "customer" && !user.emailVerifiedAt) return null;
  return user;
}
