'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

import { productTypes, products } from './data'
import type { StorefrontProduct } from './data'
import { ProductCard } from './ProductCard'

export function CollectionGrid() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [activeType, setActiveType] = useState<StorefrontProduct['type'] | null>(null)
  const visible = activeType ? products.filter((product) => product.type === activeType) : products

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
        <nav aria-label="Product types" className="mb-10 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-5">
          {productTypes.map(({ name, image }) => {
            const active = activeType === name
            return (
              <button
                key={name}
                aria-pressed={active}
                onClick={() => setActiveType(active ? null : name)}
                className="group text-center"
              >
                <span
                  className={`relative block aspect-square overflow-hidden bg-brand-surface transition-shadow duration-300 hover:shadow-[0_10px_26px_#1a1a1a0d] ${active ? 'ring-1 ring-brand-charcoal' : ''}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    quality={90}
                    sizes="(max-width: 640px) 45vw, 22vw"
                    className="object-contain p-[12%] mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none"
                  />
                </span>
                <span
                  className={`mt-2.5 block text-[11px] font-medium uppercase tracking-brand ${active ? 'text-brand-charcoal' : 'text-brand-muted'}`}
                >
                  {name}
                </span>
              </button>
            )
          })}
        </nav>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {visible.map((product) => (
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
