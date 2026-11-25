import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f6f3] px-4 py-16 text-brand-charcoal">
      <div className="mx-auto max-w-sm rounded-lg border border-stone-200 bg-white p-8">
        {children}
        <Link href="/" className="mt-6 inline-block text-sm underline">Back to store</Link>
      </div>
    </main>
  );
}
