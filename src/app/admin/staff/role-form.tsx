"use client";

import { useActionState } from "react";

import { changeOwnerRole, demoteAdmin, inviteAdmin, promoteCustomer } from "./actions";

export function InviteForm() {
  const [result, action, pending] = useActionState(inviteAdmin, undefined);
  const link = result?.token && typeof window !== "undefined"
    ? `${window.location.origin}/admin/register#token=${result.token}`
    : undefined;
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="block text-sm">
        New administrator email
        <input type="email" name="email" required maxLength={254}
          className="mt-2 block w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <button disabled={pending} className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-50">
        {pending ? "Creating..." : "Create invitation"}
      </button>
      {result && <p role={result.ok ? "status" : "alert"} className="text-sm">{result.message}</p>}
      {link && <label className="block text-sm">Invitation link
        <input readOnly value={link} onFocus={(event) => event.currentTarget.select()}
          className="mt-2 block w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>}
    </form>
  );
}

export function PromoteForm() {
  const [result, action, pending] = useActionState(promoteCustomer, undefined);
  return (
    <form action={action} className="mt-4 space-y-3"
      onSubmit={(event) => {
        if (!window.confirm("Grant this customer administrator access?")) event.preventDefault();
      }}>
      <label className="block text-sm">
        Customer email
        <input type="email" name="email" required maxLength={254}
          className="mt-2 block w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <button disabled={pending} className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-50">
        {pending ? "Updating..." : "Make administrator"}
      </button>
      {result && <p role={result.ok ? "status" : "alert"} className="text-sm">{result.message}</p>}
    </form>
  );
}

export function DemoteForm({ id, email }: { id: string; email: string }) {
  const [result, action, pending] = useActionState(demoteAdmin, undefined);
  return (
    <form action={action} className="space-y-2"
      onSubmit={(event) => {
        if (!window.confirm(`Remove administrator access for ${email}?`)) event.preventDefault();
      }}>
      <input type="hidden" name="id" value={id} />
      <button disabled={pending} className="text-sm text-red-700 underline disabled:opacity-50">
        {pending ? "Updating..." : "Remove admin access"}
      </button>
      {result && <p role={result.ok ? "status" : "alert"} className="text-sm">{result.message}</p>}
    </form>
  );
}

export function OwnerForm({ id, email, isOwner }: { id: string; email: string; isOwner: boolean }) {
  const [result, action, pending] = useActionState(changeOwnerRole, undefined);
  const label = isOwner ? "Remove owner role" : "Make owner";
  return (
    <form action={action} className="space-y-2"
      onSubmit={(event) => {
        if (!window.confirm(`${label} for ${email}?`)) event.preventDefault();
      }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="kind" value={isOwner ? "remove-owner" : "make-owner"} />
      <button disabled={pending} className="text-sm underline disabled:opacity-50">{pending ? "Updating..." : label}</button>
      {result && <p role={result.ok ? "status" : "alert"} className="text-sm">{result.message}</p>}
    </form>
  );
}
