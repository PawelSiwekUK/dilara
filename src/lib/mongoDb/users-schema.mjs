import { isDeepStrictEqual } from "node:util";

export const userRoles = /** @type {const} */ (["owner", "admin", "customer"]);
const previousRoles = ["admin", "customer"];

export const legacyUserValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["email", "role", "createdAt", "updatedAt"],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      email: {
        bsonType: "string",
        minLength: 3,
        maxLength: 254,
        pattern: "^[^\\s@]+@[^\\s@]+$",
      },
      name: { bsonType: "string", minLength: 1 },
      role: { enum: previousRoles },
      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  },
};

export const previousUserValidator = {
  $jsonSchema: {
    ...legacyUserValidator.$jsonSchema,
    properties: {
      ...legacyUserValidator.$jsonSchema.properties,
      emailVerifiedAt: { bsonType: "date" },
    },
  },
};

export const userValidator = {
  $jsonSchema: {
    ...previousUserValidator.$jsonSchema,
    properties: {
      ...previousUserValidator.$jsonSchema.properties,
      role: { enum: userRoles },
    },
  },
};

/** @param {import("mongodb").Db} db */
export async function setupUsersCollection(db) {
  const existing = await db.listCollections({ name: "users" }).next();

  if (existing) {
    const options = existing.options;
    if (options?.validationLevel !== "strict" || options?.validationAction !== "error") {
      throw new Error("The existing users collection has a different validator; migrate it before continuing.");
    }
    if (isDeepStrictEqual(options.validator, legacyUserValidator) ||
        isDeepStrictEqual(options.validator, previousUserValidator)) {
      await db.command({ collMod: "users", validator: userValidator, validationLevel: "strict", validationAction: "error" });
    } else if (!isDeepStrictEqual(options.validator, userValidator)) {
      throw new Error("The existing users collection has a different validator; migrate it before continuing.");
    }
  } else {
    await db.createCollection("users", {
      validator: userValidator,
      validationLevel: "strict",
      validationAction: "error",
    });
  }

  await db.collection("users").createIndex(
    { email: 1 },
    {
      name: "users_email_unique",
      unique: true,
      collation: { locale: "en", strength: 2 },
    },
  );
}
