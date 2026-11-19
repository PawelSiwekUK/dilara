import type { ComponentProps } from 'react'

import { Grid } from '@/src/components/Grid'
import { ProductGridItem } from '@/src/components/ProductGridItem'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type Product = ComponentProps<typeof ProductGridItem>['product'] & { id: string | number }

export default function ShopPage() {
  const products: Product[] = []

  return (
    <div>
      <p className="mb-4">The product catalogue is not connected yet.</p>
      {products.length > 0 && (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </Grid>
      )}
    </div>
  )
}
