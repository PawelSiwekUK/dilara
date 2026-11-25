import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { products } from '@/src/app/home/data';
import { money, ProductPrice } from '@/src/app/home/ProductPrice';

type ProductPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
	return products.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
	const { id } = await params;
	const product = products.find((item) => item.id === id);
	return { title: product ? `${product.title} | Dilara's Finesse` : 'Product not found' };
}

export default function ProductPage({ params }: ProductPageProps) {
	return (
		<Suspense fallback={<p className='px-4 py-10 font-storefront text-brand-muted sm:px-8'>Loading product...</p>}>
			<ProductDetails params={params} />
		</Suspense>
	);
}

async function ProductDetails({ params }: ProductPageProps) {
	const { id } = await params;
	const product = products.find((item) => item.id === id);
	if (!product) notFound();

	const categoryHref = `/collections?${new URLSearchParams({ category: product.type }).toString()}`;

	return (
		<main className='min-h-screen bg-brand-white px-4 py-10 font-storefront text-brand-charcoal sm:px-8 sm:py-14'>
			<div className='mx-auto grid max-w-[1180px] gap-8 md:grid-cols-2 md:gap-14'>
				<div className='relative aspect-square bg-brand-surface'>
					<Image
						src={product.image}
						alt={product.title}
						fill
						sizes='(max-width: 768px) 100vw, 50vw'
						quality={90}
						className='object-contain p-[12%] mix-blend-multiply'
					/>
				</div>
				<div className='flex flex-col items-start justify-center'>
					{product.badge && (
						<p className='mb-4 text-[11px] font-medium uppercase tracking-brand text-brand-muted'>{product.badge}</p>
					)}
					<p className='mb-3 text-[11px] font-medium uppercase tracking-brand text-brand-muted'>{product.type}</p>
					<h1 className='font-editorial text-[36px] leading-tight sm:text-[46px]'>{product.title}</h1>
					<p className='mt-4 text-sm text-brand-muted'>{product.metal}</p>
					<div className='mt-6' aria-label={`Price ${money(product.price)}`}>
						<ProductPrice product={product} />
					</div>
					<p className='mt-8 text-sm leading-relaxed text-brand-muted'>
						This product is a preview. Checkout is not connected.
					</p>
					<Link href={categoryHref} className='mt-8 border-b border-brand-charcoal pb-1 text-[11px] font-medium uppercase tracking-brand hover:text-brand-muted'>
						Back to {product.type}
					</Link>
				</div>
			</div>
		</main>
	);
}
