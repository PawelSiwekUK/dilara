import nextEnv from "@next/env";
import { input, password } from "@inquirer/prompts";
import * as argon2 from "argon2";
import { MongoClient, ObjectId } from "mongodb";

import { setupUsersCollection } from "../src/lib/mongoDb/users-schema.mjs";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
  throw new Error("MONGODB_URI and MONGODB_DB must be configured");
}

const email = (await input({
  message: "Admin email",
  validate: (value) => /^[^\s@]+@[^\s@]+$/.test(value.trim()) && value.trim().length <= 254 || "Enter a valid email address",
})).trim().toLowerCase();
const secret = await password({
  message: "Admin password (at least 14 characters)",
  mask: "*",
  validate: (value) => value.length >= 14 && value.length <= 128 || "Use 14 to 128 characters",
});
const confirmation = await password({ message: "Confirm password", mask: "*" });
if (secret !== confirmation) throw new Error("Passwords do not match");

const passwordHash = await argon2.hash(secret);
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  await setupUsersCollection(db);
  const id = new ObjectId();
  const now = new Date();
  await client.withSession((session) => session.withTransaction(async () => {
    await db.collection("users").insertOne(
      { _id: id, email, role: "admin", createdAt: now, updatedAt: now },
      { session },
    );
    await db.collection("auth_credentials").insertOne({ _id: id, passwordHash }, { session });
  }));
  console.log("Admin created.");
} finally {
  await client.close();
}
