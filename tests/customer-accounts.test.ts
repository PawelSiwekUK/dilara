import assert from "node:assert/strict";
import test from "node:test";

import { AccountEmailError, completeAccountToken, requestAccountEmail } from "../src/lib/auth/customer-accounts";

test("rejects malformed or incomplete account tokens before accessing the database", async () => {
  const form = new FormData();
  form.set("token", "invalid");
  form.set("password", "a long enough test password");
  form.set("confirmation", "a long enough test password");
  assert.equal((await completeAccountToken("register", form)).ok, false);

  form.set("token", "a".repeat(64));
  form.set("password", "short");
  form.set("confirmation", "short");
  assert.equal((await completeAccountToken("reset", form)).ok, false);
});

test("fails explicitly when account email configuration is missing", async () => {
  const oldKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    const form = new FormData();
    form.set("email", "test@example.invalid");
    await assert.rejects(requestAccountEmail("register", form), AccountEmailError);
  } finally {
    if (oldKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = oldKey;
  }
});
