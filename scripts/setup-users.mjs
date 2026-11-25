import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

import { setupUsersCollection } from "../src/lib/mongoDb/users-schema.mjs";

nextEnv.loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB;

if (!uri || !databaseName) {
  throw new Error("MONGODB_URI and MONGODB_DB must be configured");
}

const client = new MongoClient(uri);
try {
  await client.connect();
  await setupUsersCollection(client.db(databaseName));
  console.log("Users collection schema and email index are ready.");
} finally {
  await client.close();
}
