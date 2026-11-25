import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";

const shortSessionSeconds = 8 * 60 * 60;
export const rememberedSessionSeconds = 7 * 24 * 60 * 60;

export function applySessionPolicy(token: JWT, user?: User | null): JWT | null {
  const now = Math.floor(Date.now() / 1000);
  if (user) {
    token.sessionVersion = user.sessionVersion;
    token.sessionExpiresAt = now + (user.rememberMe ? rememberedSessionSeconds : shortSessionSeconds);
  } else if (typeof token.sessionExpiresAt !== "number") {
    if (typeof token.exp !== "number") return null;
    token.sessionExpiresAt = Math.min(token.exp, now + shortSessionSeconds);
  }

  const expiry = token.sessionExpiresAt;
  if (typeof expiry !== "number" || !Number.isSafeInteger(expiry) || expiry <= now) return null;
  return token;
}

export function sessionTimeRemaining(token?: JWT) {
  const expiry = token?.sessionExpiresAt;
  if (typeof expiry !== "number" || !Number.isSafeInteger(expiry)) {
    throw new Error("Session expiry is missing or invalid");
  }
  const remaining = expiry - Math.floor(Date.now() / 1000);
  if (remaining <= 0) throw new Error("Session has expired");
  return remaining;
}
