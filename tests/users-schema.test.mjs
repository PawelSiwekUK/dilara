import assert from "node:assert/strict";
import test from "node:test";

import { legacyUserValidator, previousUserValidator, setupUsersCollection, userValidator } from "../src/lib/mongoDb/users-schema.mjs";

function fakeDatabase(existing) {
  const calls = [];
  return {
    calls,
    listCollections: () => ({ next: async () => existing }),
    createCollection: async (name, options) => {
      calls.push({ name, options });
    },
    command: async (command) => {
      calls.push(command);
    },
    collection: () => ({
      createIndex: async (keys, options) => {
        calls.push({ keys, options });
      },
    }),
  };
}

test("creates a validated collection and a case-insensitive unique email index", async () => {
  const db = fakeDatabase(null);
  await setupUsersCollection(db);

  assert.deepEqual(db.calls, [
    {
      name: "users",
      options: {
        validator: userValidator,
        validationLevel: "strict",
        validationAction: "error",
      },
    },
    {
      keys: { email: 1 },
      options: {
        name: "users_email_unique",
        unique: true,
        collation: { locale: "en", strength: 2 },
      },
    },
  ]);
});

test("migrates both known previous users validators", async () => {
  for (const validator of [legacyUserValidator, previousUserValidator]) {
  const db = fakeDatabase({
    options: { validator, validationLevel: "strict", validationAction: "error" },
  });
  await setupUsersCollection(db);
  assert.deepEqual(db.calls[0], {
    collMod: "users",
    validator: userValidator,
    validationLevel: "strict",
    validationAction: "error",
  });
  }
});

test("does not replace a different existing users validator", async () => {
  const db = fakeDatabase({ options: { validator: {} } });

  await assert.rejects(setupUsersCollection(db), /different validator/);
  assert.equal(db.calls.length, 0);
});
