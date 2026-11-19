import NextAuth from "next-auth";
import { encode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import { verifyCredentials } from "@/src/lib/auth/credentials";
import { applySessionPolicy, rememberedSessionSeconds, sessionTimeRemaining } from "@/src/lib/auth/session-policy";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, rememberMe: {} },
      authorize: (credentials) => verifyCredentials(credentials, "admin"),
    }),
    Credentials({
      id: "customer",
      credentials: { email: {}, password: {}, rememberMe: {} },
      authorize: (credentials) => verifyCredentials(credentials, "customer"),
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: rememberedSessionSeconds },
  jwt: {
    encode: (params) => encode({ ...params, maxAge: sessionTimeRemaining(params.token) }),
  },
  callbacks: {
    jwt({ token, user }) {
      return applySessionPolicy(token, user);
    },
    session({ session, token }) {
      if (session.user && token.sub && typeof token.sessionVersion === "number") {
        session.user.id = token.sub;
        session.user.sessionVersion = token.sessionVersion;
      }
      if (typeof token.sessionExpiresAt === "number") {
        return { ...session, expires: new Date(token.sessionExpiresAt * 1000).toISOString() };
      }
      return session;
    },
  },
});
