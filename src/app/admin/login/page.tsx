import Link from "next/link";

import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f3] px-4 py-16 text-brand-charcoal">
      <div className="mx-auto max-w-sm rounded-lg border border-stone-200 bg-white p-8">
        <h1 className="mb-6 font-editorial text-3xl">Admin sign in</h1>
        <LoginForm />
        <Link href="/" className="mt-6 inline-block text-sm underline">Back to store</Link>
      </div>
    </main>
  );
}
