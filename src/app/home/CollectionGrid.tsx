'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { products } from './data';
import type { StorefrontProduct } from './data';
import { ProductCard } from './ProductCard';

export function CollectionGrid() {
	const [wishlist, setWishlist] = useState<string[]>([]);
	const activeType = useSearchParams().get('category');
	const visible = activeType ? products.filter((product) => product.type === activeType) : products;

	function toggleWishlist(product: StorefrontProduct) {
		const saved = wishlist.includes(product.id);
		setWishlist((current) => (saved ? current.filter((id) => id !== product.id) : [...current, product.id]));
		toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
	}

	return (
		<div className='min-h-screen bg-brand-white font-storefront text-brand-charcoal antialiased'>
			<main className='mx-auto max-w-[1380px] px-4 py-4 sm:px-8 sm:py-8'>
				<h1 className='mb-4 sm:mb-8 text-[21px] font-normal uppercase tracking-editorial sm:text-[25px]'>{activeType || 'All Products'}</h1>
				{visible.length === 0 && <p className='text-sm text-brand-muted'>No products found in this category.</p>}
				<div className='grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4'>
					{visible.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							wishlisted={wishlist.includes(product.id)}
							onToggleWishlist={() => toggleWishlist(product)}
							onAddToBag={() => toast.success(`${product.title} added to your preview bag`)}
						/>
					))}
				</div>
			</main>
		</div>
	);
}
