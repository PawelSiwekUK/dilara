import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import test from "node:test";
import * as argon2 from "argon2";
import { MongoClient, ObjectId } from "mongodb";
import mongoose from "mongoose";

import { AccountEmailError, requestAccountEmail, completeAccountToken } from "../src/lib/auth/customer-accounts";
import { createAdminInvitation, InvitationError, redeemAdminInvitation } from "../src/lib/auth/admin-invitations";
import { verifyCredentials } from "../src/lib/auth/credentials";
import { changeStaffRole, RoleChangeError } from "../src/lib/auth/staff";
import { setupUsersCollection } from "../src/lib/mongoDb/users-schema.mjs";

const uri = process.env.TEST_MONGODB_URI;

test("staff role changes remain authorized and preserve an administrator", { skip: !uri, timeout: 120000 }, async () => {
  if (!uri) return;
  const database = `dilara_staff_test_${randomBytes(8).toString("hex")}`;
  process.env.MONGODB_URI = uri;
  process.env.MONGODB_DB = database;
  process.env.RESEND_API_KEY = "local-test-key";
  process.env.EMAIL_FROM = "test@example.invalid";
  process.env.APP_URL = "https://shop.example.invalid";
  const client = new MongoClient(uri);
  const originalFetch = globalThis.fetch;
  let owned = false;
  try {
    await client.connect();
    const db = client.db(database);
    assert.equal((await db.listCollections().toArray()).length, 0);
    owned = true;
    await setupUsersCollection(db);
    const adminA = new ObjectId();
    const adminB = new ObjectId();
    const customer = new ObjectId();
    const unverified = new ObjectId();
    const now = new Date();
    await db.collection("users").insertMany([
      { _id: adminA, email: "admin-a@example.invalid", role: "admin", createdAt: now, updatedAt: now },
      { _id: adminB, email: "admin-b@example.invalid", role: "admin", createdAt: now, updatedAt: now },
      { _id: customer, email: "customer@example.invalid", role: "customer", emailVerifiedAt: now, createdAt: now, updatedAt: now },
      { _id: unverified, email: "unverified@example.invalid", role: "customer", createdAt: now, updatedAt: now },
    ]);
    await db.collection("auth_credentials").insertMany(
      [adminA, adminB, customer, unverified].map((_id) => ({ _id, passwordHash: "synthetic-hash" })),
    );
    const a = { id: adminA.toHexString(), sessionVersion: 0 };
    const b = { id: adminB.toHexString(), sessionVersion: 0 };
    await assert.rejects(changeStaffRole(a, { kind: "demote", id: a.id }), RoleChangeError);
    await assert.rejects(
      changeStaffRole({ id: customer.toHexString(), sessionVersion: 0 }, { kind: "demote", id: a.id }),
      RoleChangeError,
    );
    await assert.rejects(changeStaffRole(a, { kind: "promote", email: "unverified@example.invalid" }), RoleChangeError);
    await changeStaffRole(a, { kind: "promote", email: "CUSTOMER@example.invalid" });
    assert.equal((await db.collection("users").findOne({ _id: customer }))?.role, "admin");
    assert.equal((await db.collection("auth_credentials").findOne({ _id: customer }))?.sessionVersion, 1);
    await assert.rejects(
      changeStaffRole({ id: customer.toHexString(), sessionVersion: 0 }, { kind: "demote", id: a.id }),
      RoleChangeError,
    );
    await changeStaffRole(a, { kind: "demote", id: customer.toHexString() });
    assert.equal((await db.collection("auth_credentials").findOne({ _id: customer }))?.sessionVersion, 2);

    const concurrent = await Promise.allSettled([
      changeStaffRole(a, { kind: "demote", id: b.id }),
      changeStaffRole(b, { kind: "demote", id: a.id }),
    ]);
    assert.equal(concurrent.filter((result) => result.status === "fulfilled").length, 1);
    assert.equal(await db.collection("users").countDocuments({ role: "admin" }), 1);
    const demoted = await db.collection("users").findOne({ _id: { $in: [adminA, adminB] }, role: "customer" });
    assert.ok(demoted);

    const request = new FormData();
    request.set("email", demoted.email);
    globalThis.fetch = async () => new Response(
      JSON.stringify({
        name: "validation_error",
        message: "You can only send testing emails to your own email address (private@example.invalid).",
        statusCode: 403,
      }),
      { status: 403, headers: { "content-type": "application/json" } },
    );
    await assert.rejects(requestAccountEmail("register", request), (error: unknown) => {
      assert.ok(error instanceof AccountEmailError);
      assert.match(error.message, /validation_error, status 403, test recipient restriction/);
      assert.doesNotMatch(error.message, /private@example\.invalid/);
      return true;
    });

    let emailText = "";
    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), "https://api.resend.com/emails");
      emailText = JSON.parse(String(init?.body)).text;
      return new Response(JSON.stringify({ id: "local-test" }), { status: 200, headers: { "content-type": "application/json" } });
    };
    assert.ok((await requestAccountEmail("register", request)).ok);
    const link = emailText.match(/https:\/\/\S+/)?.[0];
    assert.ok(link);
    const token = new URLSearchParams(new URL(link).hash.slice(1)).get("token");
    assert.ok(token);
    const complete = new FormData();
    complete.set("token", token);
    complete.set("password", "synthetic-password-for-testing");
    complete.set("confirmation", "synthetic-password-for-testing");
    assert.ok((await completeAccountToken("register", complete)).ok);
    assert.ok((await db.collection("users").findOne({ _id: demoted._id }))?.emailVerifiedAt);
    assert.equal((await db.collection("auth_credentials").findOne({ _id: demoted._id }))?.sessionVersion, 2);

    const remainingAdmin = await db.collection("users").findOne({ role: "admin" });
    assert.ok(remainingAdmin);
    const bootstrap = () => spawnSync(process.execPath, ["scripts/assign-owner.mjs"], {
      cwd: process.cwd(),
      env: { ...process.env, MONGODB_URI: uri, MONGODB_DB: database, ADMIN_EMAIL: remainingAdmin.email },
      encoding: "utf8",
    });
    assert.equal(bootstrap().status, 0);
    assert.equal(bootstrap().status, 0);
    const ownerCredential = await db.collection("auth_credentials").findOne({ _id: remainingAdmin._id });
    assert.ok(ownerCredential);
    const owner = { id: remainingAdmin._id.toHexString(), sessionVersion: ownerCredential.sessionVersion };
    const ownerPassword = "owner-password-for-testing";
    await db.collection("auth_credentials").updateOne(
      { _id: remainingAdmin._id }, { $set: { passwordHash: await argon2.hash(ownerPassword) } },
    );
    assert.ok(await verifyCredentials({ email: remainingAdmin.email, password: ownerPassword }, "admin"));
    assert.equal(await verifyCredentials({ email: remainingAdmin.email, password: ownerPassword }, "customer"), null);

    await changeStaffRole(owner, { kind: "promote", email: "customer@example.invalid" });
    const adminCredential = await db.collection("auth_credentials").findOne({ _id: customer });
    assert.ok(adminCredential);
    const newAdmin = { id: customer.toHexString(), sessionVersion: adminCredential.sessionVersion };
    await assert.rejects(changeStaffRole(newAdmin, { kind: "make-owner", id: customer.toHexString() }), RoleChangeError);
    await assert.rejects(changeStaffRole(newAdmin, { kind: "remove-owner", id: owner.id }), /Only an owner/);
    await assert.rejects(changeStaffRole(newAdmin, { kind: "demote", id: owner.id }), RoleChangeError);
    await assert.rejects(createAdminInvitation({ ...owner, sessionVersion: owner.sessionVersion - 1 }, "stale@example.invalid"), InvitationError);
    await assert.rejects(createAdminInvitation(owner, "customer@example.invalid"), /already exists/);

    const invalidatedToken = await createAdminInvitation(newAdmin, "invalidated@example.invalid");
    await changeStaffRole(owner, { kind: "make-owner", id: newAdmin.id });
    const invalidated = new FormData();
    invalidated.set("token", invalidatedToken);
    invalidated.set("password", "new-admin-password-for-testing");
    invalidated.set("confirmation", "new-admin-password-for-testing");
    assert.match((await redeemAdminInvitation(invalidated)).message, /no longer valid/);
    await changeStaffRole(owner, { kind: "remove-owner", id: newAdmin.id });
    assert.equal((await db.collection("users").findOne({ _id: customer }))?.role, "admin");
    await assert.rejects(changeStaffRole(owner, { kind: "remove-owner", id: owner.id }), RoleChangeError);

    const inviteToken = await createAdminInvitation(owner, "invited@example.invalid");
    const registration = new FormData();
    registration.set("token", inviteToken);
    registration.set("password", "new-admin-password-for-testing");
    registration.set("confirmation", "new-admin-password-for-testing");
    const attempts = await Promise.all([redeemAdminInvitation(registration), redeemAdminInvitation(registration)]);
    assert.equal(attempts.filter((result) => result.ok).length, 1);
    const invited = await db.collection("users").findOne({ email: "invited@example.invalid" });
    assert.equal(invited?.role, "admin");
    assert.equal(invited?.emailVerifiedAt, undefined);
    assert.ok(await verifyCredentials({ email: "invited@example.invalid", password: "new-admin-password-for-testing" }, "admin"));
    assert.equal((await redeemAdminInvitation(registration)).ok, false);

    const expiredToken = await createAdminInvitation(owner, "expired@example.invalid");
    await db.collection("auth_admin_invitations").updateOne(
      { email: "expired@example.invalid" }, { $set: { expiresAt: new Date(0) } },
    );
    registration.set("token", expiredToken);
    assert.match((await redeemAdminInvitation(registration)).message, /invalid or has expired/);
  } finally {
    globalThis.fetch = originalFetch;
    await mongoose.disconnect();
    if (owned) await client.db(database).dropDatabase();
    await client.close();
  }
});
