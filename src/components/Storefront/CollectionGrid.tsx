'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { products } from './data'
import type { StorefrontProduct } from './data'
import { ProductCard } from './ProductCard'

export function CollectionGrid() {
  const [wishlist, setWishlist] = useState<string[]>([])

  function toggleWishlist(product: StorefrontProduct) {
    const saved = wishlist.includes(product.id)
    setWishlist((current) =>
      saved ? current.filter((id) => id !== product.id) : [...current, product.id],
    )
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  return (
    <div className="min-h-screen bg-brand-white font-storefront text-brand-charcoal antialiased">
      <main className="mx-auto max-w-[1380px] px-4 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="text-[10px] font-medium uppercase tracking-brand text-brand-muted hover:text-brand-charcoal"
        >
          &larr; Home
        </Link>
        <h1 className="mt-4 mb-8 text-[20px] font-normal uppercase tracking-editorial sm:mb-10 sm:text-[24px]">
          All Products
        </h1>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlist.includes(product.id)}
              onView={() => {}}
              onToggleWishlist={() => toggleWishlist(product)}
              onAddToBag={() => toast.success(`${product.title} added to your preview bag`)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
