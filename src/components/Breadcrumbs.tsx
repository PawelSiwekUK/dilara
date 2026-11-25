'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { products } from '@/src/app/home/data';

const labels: Record<string, string> = {
	about: 'About Us',
	account: 'Account',
	admin: 'Admin',
	collections: 'Collections',
	contact: 'Contact',
	'forgot-password': 'Forgot Password',
	'leave-review': 'Leave a Review',
	login: 'Sign In',
	register: 'Register',
	reset: 'Reset Password',
	'shipping&return': 'Shipping & Returns',
	'shipping%26return': 'Shipping & Returns',
	staff: 'Staff',
	'thank-you': 'Thank You',
	verify: 'Verify Email',
};

export function Breadcrumbs() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length === 0) return null;

	const category = pathname === '/collections' ? searchParams.get('category') : null;
	const product = segments.length === 2 && segments[0] === 'products'
		? products.find((item) => item.id === segments[1])
		: undefined;
	const crumbs = segments[0] === 'products' && segments.length === 2
		? [
				{ href: '/collections', label: 'Collections' },
				...(product ? [
					{ href: `/collections?${new URLSearchParams({ category: product.type }).toString()}`, label: product.type },
					{ href: pathname, label: product.title },
				] : [{ href: pathname, label: 'Product not found' }]),
			]
		: segments.map((segment, index) => ({
		href: `/${segments.slice(0, index + 1).join('/')}`,
		label: labels[segment.toLowerCase()] ?? segment.replace(/-/g, ' '),
	}));
	if (category) crumbs.push({ href: pathname, label: category });

	return (
		<nav aria-label='Breadcrumb' className='bg-brand-surface font-storefront text-[13px] text-brand-charcoal'>
			<ol className='mx-auto flex max-w-[1380px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 sm:px-8'>
				<li><Link href='/' className='hover:underline'>Home</Link></li>
				{crumbs.map(({ href, label }, index) => (
					<li key={`${href}-${index}`} className='flex min-w-0 items-center gap-2'>
						<span aria-hidden='true' className='text-brand-muted'>/</span>
						{index === crumbs.length - 1 ? (
							<span aria-current='page' className='break-words'>{label}</span>
						) : (
							<Link href={href} className='hover:underline'>{label}</Link>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
