"use client";

import { useActionState, useEffect, useRef } from "react";

import type { AccountResult } from "@/src/lib/auth/customer-accounts";

type Props = {
  action: (state: AccountResult | undefined, formData: FormData) => Promise<AccountResult | undefined>;
  kind: "login" | "email" | "password";
  button: string;
};

const inputClass = "mt-2 block w-full rounded-md border border-stone-300 bg-white px-3 py-2";

export function AccountForm({ action, kind, button }: Props) {
  const [result, formAction, pending] = useActionState(action, undefined);
  const tokenInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (kind !== "password") return;
    if (tokenInput.current) {
      tokenInput.current.defaultValue = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    }
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }, [kind]);

  return (
    <form action={formAction} className="space-y-5">
      {kind !== "password" && (
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="email" required maxLength={254} className={inputClass} />
        </label>
      )}
      {kind !== "email" && (
        <>
          <label className="block text-sm font-medium">
            Password
            <input name="password" type="password" required maxLength={128}
              minLength={kind === "password" ? 14 : undefined}
              autoComplete={kind === "password" ? "new-password" : "current-password"} className={inputClass} />
          </label>
          {kind === "password" && (
            <label className="block text-sm font-medium">
              Confirm password
              <input name="confirmation" type="password" autoComplete="new-password" required
                minLength={14} maxLength={128} className={inputClass} />
            </label>
          )}
        </>
      )}
      {kind === "password" && <input ref={tokenInput} type="hidden" name="token" />}
      {kind === "login" && (
        <label className="flex items-center gap-2 text-sm">
          <input name="rememberMe" type="checkbox" />
          Remember me for 7 days
        </label>
      )}
      {result && <p role={result.ok ? "status" : "alert"} className="text-sm">{result.message}</p>}
      {!result?.ok && (
        <button type="submit" disabled={pending}
          className="w-full rounded-md bg-stone-900 px-4 py-2 text-white disabled:opacity-50">
          {pending ? "Please wait..." : button}
        </button>
      )}
    </form>
  );
}
