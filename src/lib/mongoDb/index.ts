import "server-only";

import mongoose from "mongoose";

const mongoGlobal = globalThis as typeof globalThis & {
  dilaraMongoosePromise?: Promise<typeof mongoose>;
};

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!databaseName) {
    throw new Error("MONGODB_DB is not configured");
  }

  if (!mongoGlobal.dilaraMongoosePromise || mongoose.connection.readyState === 0) {
    mongoGlobal.dilaraMongoosePromise = mongoose.connect(uri, {
      dbName: databaseName,
      autoCreate: false,
      autoIndex: false,
    }).catch((error) => {
      mongoGlobal.dilaraMongoosePromise = undefined;
      throw error;
    });
  }

  const connection = await mongoGlobal.dilaraMongoosePromise;
  if (!connection.connection.db) throw new Error("MongoDB connection has no database");
  return connection.connection.db;
}