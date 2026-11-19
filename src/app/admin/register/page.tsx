import type { Metadata } from "next";
import Link from "next/link";

import { AccountForm } from "../../account/account-form";
import { registerAdmin } from "./actions";

export const metadata: Metadata = { title: "Administrator registration", robots: { index: false, follow: false } };

export default function AdminRegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f3] px-4 py-16 text-brand-charcoal">
      <div className="mx-auto max-w-sm rounded-lg border border-stone-200 bg-white p-8">
        <h1 className="mb-4 font-editorial text-3xl">Create administrator account</h1>
        <p className="mb-6 text-sm">Choose a password with at least 14 characters to accept your invitation.</p>
        <AccountForm action={registerAdmin} kind="password" button="Create account" />
        <p className="mt-5 text-sm"><Link className="underline" href="/admin/login">Admin sign in</Link></p>
      </div>
    </main>
  );
}
