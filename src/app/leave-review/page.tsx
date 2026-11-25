import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Leave a Review | Dilara's Finesse",
}

export default function LeaveReviewPage() {
  return (
    <main className="min-h-screen bg-brand-surface px-5 py-20 text-center font-storefront text-brand-charcoal sm:py-28">
      <h1 className="font-editorial text-[43px] font-normal sm:text-[61px]">Leave a review</h1>
      <p className="mx-auto mt-5 max-w-lg text-sm leading-[1.9] text-brand-muted">
        Review submissions are not available yet. Please check back soon.
      </p>
      <Link href="/" className="mt-8 inline-block border-b border-brand-charcoal pb-1 text-[11px] font-medium uppercase tracking-brand">
        Back to home
      </Link>
    </main>
  )
}
