import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { FindOrderForm } from '@/src/components/forms/FindOrderForm'
import { mergeOpenGraph } from '@/src/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

export default async function FindOrderPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container py-16">
      <FindOrderForm initialEmail={user?.email} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Find your order using your email and order ID.',
  openGraph: mergeOpenGraph({
    title: 'Find order',
    url: '/find-order',
  }),
  title: 'Find order',
}
