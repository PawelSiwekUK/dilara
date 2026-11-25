"use client";

import { useActionState } from "react";

import { authenticate } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(authenticate, undefined);

  return (
    <form action={action} className="space-y-5">
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="username" required maxLength={254}
          className="mt-2 block w-full rounded-md border border-stone-300 bg-white px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required maxLength={128}
          className="mt-2 block w-full rounded-md border border-stone-300 bg-white px-3 py-2" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="rememberMe" type="checkbox" />
        Remember me for 7 days
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={pending}
        className="w-full rounded-md bg-stone-900 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
