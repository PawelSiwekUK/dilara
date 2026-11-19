import type { Metadata } from 'next'

import { RenderParams } from '@/src/components/RenderParams'

export default function Login() {
  return (
    <div className="container">
      <div className="max-w-xl mx-auto my-12">
        <RenderParams />

        <h1 className="mb-4 text-[1.8rem]">Log in</h1>
        <p>Authentication is not connected yet.</p>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}
