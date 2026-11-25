import type { StorefrontProduct } from './data'

export const money = (value: number) => `\u00a3${value}`

export function ProductPrice({ product }: { product: StorefrontProduct }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5 text-[12px]">
      {product.originalPrice ? (
        <>
          <span className="text-brand-muted line-through">{money(product.originalPrice)}</span>
          <span className="font-semibold text-brand-sale">{money(product.price)}</span>
          <span className="text-[11px] text-brand-muted">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% off
          </span>
        </>
      ) : (
        <span className="font-medium">{money(product.price)}</span>
      )}
    </span>
  )
}
