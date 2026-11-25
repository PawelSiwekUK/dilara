'use client'

import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { StorefrontProduct } from './data'
import { ProductPrice } from './ProductPrice'

type ProductCardProps = {
  product: StorefrontProduct
  wishlisted: boolean
  onToggleWishlist: () => void
  onAddToBag: () => void
  className?: string
}

export function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
  onAddToBag,
  className = '',
}: ProductCardProps) {
  return (
    <article className={`group flex flex-col ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-brand-surface transition-[background-color,box-shadow] duration-300 hover:bg-[#f1f1f1] hover:shadow-[0_10px_26px_#1a1a1a0d]">
        <Link
          href={`/products/${product.id}`}
          aria-label={`View ${product.title}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="relative block size-3/4">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 35vw, (max-width: 1024px) 24vw, 240px"
              quality={90}
              className="object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none"
            />
          </span>
        </Link>
        {product.badge && (
          <span className="pointer-events-none absolute top-2.5 right-2.5 border border-brand-border/60 bg-brand-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider sm:text-[10px]">
            {product.badge}
          </span>
        )}
        <button
          aria-label={`Save ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          onClick={onToggleWishlist}
          className="absolute top-1 left-1 flex size-9 items-center justify-center text-brand-muted hover:text-brand-charcoal"
        >
          <Heart size={14} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between pt-2.5">
        <div>
          <h3 className="line-clamp-2 text-[12px] leading-snug font-medium sm:text-[13px]">
            <Link href={`/products/${product.id}`} className="hover:underline">
              {product.title}
            </Link>
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="inline-block size-3 shrink-0 rounded-full border border-brand-charcoal/30"
              style={{ backgroundColor: product.swatch }}
            />
            <span className="truncate text-[11px] text-brand-muted">{product.metal}</span>
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <ProductPrice product={product} />
          <button
            aria-label={`Add ${product.title} to bag`}
            onClick={onAddToBag}
            className="shrink-0 border-b border-brand-charcoal/50 py-1 text-[10px] font-medium uppercase tracking-wider hover:border-brand-charcoal"
          >
            + Bag
          </button>
        </div>
      </div>
    </article>
  )
}
