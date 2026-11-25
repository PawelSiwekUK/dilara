import assert from "node:assert/strict";
import test from "node:test";
import { decode, encode } from "next-auth/jwt";

import { applySessionPolicy, sessionTimeRemaining } from "../src/lib/auth/session-policy";

test("enforces eight-hour and seven-day absolute session lifetimes", async (t) => {
  const now = Math.floor(Date.now() / 1000);
  const clock = t.mock.method(Date, "now", () => now * 1000);
  const short = applySessionPolicy({}, { sessionVersion: 0, rememberMe: false });
  const remembered = applySessionPolicy({}, { sessionVersion: 0, rememberMe: true });
  assert.ok(short && remembered);
  assert.equal(sessionTimeRemaining(short), 8 * 60 * 60);
  assert.equal(sessionTimeRemaining(remembered), 7 * 24 * 60 * 60);

  const secret = "local-test-secret-that-is-not-used-for-real-accounts";
  const encoded = await encode({ token: short, secret, salt: "test", maxAge: sessionTimeRemaining(short) });
  assert.equal((await decode({ token: encoded, secret, salt: "test" }))?.exp, short.sessionExpiresAt);

  clock.mock.mockImplementation(() => (now + 7 * 60 * 60) * 1000);
  assert.equal(sessionTimeRemaining(applySessionPolicy(short) ?? undefined), 60 * 60);
  clock.mock.mockImplementation(() => (now + 8 * 60 * 60) * 1000);
  assert.equal(applySessionPolicy(short), null);
  assert.ok(applySessionPolicy(remembered));
  clock.mock.mockImplementation(() => (now + 7 * 24 * 60 * 60) * 1000);
  assert.equal(applySessionPolicy(remembered), null);
});

test("keeps existing sessions within their previous expiry", (t) => {
  const now = Math.floor(Date.now() / 1000);
  t.mock.method(Date, "now", () => now * 1000);
  assert.equal(applySessionPolicy({ exp: now + 600 })?.sessionExpiresAt, now + 600);
  assert.equal(applySessionPolicy({ exp: now + 100000 })?.sessionExpiresAt, now + 8 * 60 * 60);
  assert.equal(applySessionPolicy({}), null);
  assert.throws(() => sessionTimeRemaining({ sessionExpiresAt: NaN }));
});
