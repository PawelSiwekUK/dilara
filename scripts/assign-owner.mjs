import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

import { setupUsersCollection } from "../src/lib/mongoDb/users-schema.mjs";

nextEnv.loadEnvConfig(process.cwd());
const { MONGODB_URI: uri, MONGODB_DB: databaseName, ADMIN_EMAIL: configuredEmail } = process.env;
const email = configuredEmail?.trim().toLowerCase();
if (!uri || !databaseName || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(email)) {
  throw new Error("MONGODB_URI, MONGODB_DB and a valid ADMIN_EMAIL must be configured");
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(databaseName);
  await setupUsersCollection(db);
  const locks = db.collection("auth_role_management");
  await locks.updateOne({ _id: "roles" }, { $setOnInsert: { revision: 0 } }, { upsert: true });
  const result = await client.withSession((session) => session.withTransaction(async () => {
    await locks.updateOne({ _id: "roles" }, { $inc: { revision: 1 } }, { session });
    const user = await db.collection("users").findOne({ email }, { session, collation: { locale: "en", strength: 2 } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      throw new Error("ADMIN_EMAIL must match an existing administrator account.");
    }
    if (user.role === "owner") return "already-owner";
    if (await db.collection("users").findOne({ role: "owner" }, { session })) {
      throw new Error("An owner already exists; ask an owner to manage owner roles in the staff panel.");
    }
    const updated = await db.collection("auth_credentials").updateOne(
      { _id: user._id }, { $inc: { sessionVersion: 1 } }, { session },
    );
    if (updated.matchedCount !== 1) throw new Error("The administrator has no sign-in credentials.");
    await db.collection("users").updateOne(
      { _id: user._id }, { $set: { role: "owner", updatedAt: new Date() } }, { session },
    );
    return "assigned";
  }));
  console.log(result === "already-owner" ? "The configured administrator is already an owner." : "Owner assigned. Sign in again.");
} finally {
  await client.close();
}
