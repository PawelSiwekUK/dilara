import type { Metadata } from 'next'

import { CollectionGrid } from '@/components/Storefront/CollectionGrid'

export const metadata: Metadata = {
  title: "All Products | Dilara's Finesse",
  description: "Browse every piece in Dilara's Finesse sterling silver jewellery collection.",
}

export default function CollectionsPage() {
  return <CollectionGrid />
}
