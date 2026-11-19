import assert from "node:assert/strict";
import test from "node:test";

import { UserModel } from "../src/lib/mongoDb/users";

test("validates owner, admin and customer user documents", async () => {
  for (const role of ["owner", "admin", "customer"]) {
    const user = new UserModel({ email: "test@example.invalid", role });
    await user.validate();
    assert.equal(user.toObject().__v, undefined);
  }
});

test("rejects invalid roles, email addresses and empty names", async () => {
  const user = new UserModel({ email: "invalid", name: "", role: "invalid" });
  await assert.rejects(user.validate(), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.match(error.message, /email/);
    assert.match(error.message, /name/);
    assert.match(error.message, /role/);
    return true;
  });
});
