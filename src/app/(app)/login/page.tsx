import type { Metadata } from 'next'

import { LoginForm } from '@/components/forms/LoginForm'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Customer login | Dilara's Finesse",
}

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Customer login</h1>
      <Suspense fallback={<p>Loading login form...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
