import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Boxes, CircleHelp, ClipboardList, LayoutDashboard, LockKeyhole, Package, Plus, Settings, ShoppingBag, Users } from 'lucide-react';

import { products } from '@/src/app/home/data';
import { signOut } from '@/src/auth';
import { getCurrentAdmin } from '@/src/lib/auth/admin';

export const metadata: Metadata = {
	title: "Admin preview | Dilara's Finesse",
	robots: { index: false, follow: false },
};

const navigation = [
	{ href: '#overview', label: 'Overview', icon: LayoutDashboard },
	{ href: '#products', label: 'Products', icon: Package },
	{ href: '#orders', label: 'Orders', icon: ShoppingBag },
	{ href: '#inventory', label: 'Inventory', icon: Boxes },
	{ href: '#customers', label: 'Customers', icon: Users },
	{ href: '/admin/staff', label: 'Administrators', icon: Users },
	{ href: '#settings', label: 'Settings', icon: Settings },
];

const summary = [
	{ label: 'Products', value: String(products.length), note: 'Example products', icon: Package },
	{ label: 'Orders', value: '—', note: 'Not connected', icon: ShoppingBag },
	{ label: 'Revenue', value: '—', note: 'Not connected', icon: ClipboardList },
	{ label: 'Customers', value: '—', note: 'Not connected', icon: Users },
];

const disabledButton =
	'inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md border border-stone-200 bg-stone-100 px-4 py-2.5 text-xs font-medium text-stone-400';

export default async function AdminPage() {
	if (!(await getCurrentAdmin())) redirect('/admin/login');

	return (
		<div className='min-h-screen bg-[#f7f6f3] font-storefront text-brand-charcoal'>
			<a href='#admin-main' className='sr-only fixed top-3 left-3 z-50 bg-white p-3 focus:not-sr-only'>
				Skip to admin content
			</a>
			<div className='lg:flex'>
				<aside className='border-b border-stone-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0'>
					<div className='flex items-center justify-between px-6 py-6 lg:block lg:px-7 lg:py-8'>
						<Link href='/' className='inline-flex flex-col' aria-label="Dilara's Finesse storefront">
							<span className='font-script text-3xl leading-none'>Dilara&apos;s Finesse</span>
							<span className='mt-2 text-[10px] font-semibold tracking-[0.2em] text-stone-500 uppercase'>Store administration</span>
						</Link>
						<Link href='/' className='text-xs text-stone-500 hover:text-black lg:hidden'>
							View store
						</Link>
					</div>
					<nav aria-label='Admin sections' className='flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-4'>
						{navigation.map(({ href, label, icon: Icon }) => (
							<Link
								key={href}
								href={href}
								className='flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950'>
								<Icon size={17} aria-hidden='true' />
								{label}
							</Link>
						))}
					</nav>
					<div className='mt-auto hidden border-t border-stone-100 p-6 lg:block'>
						<Link href='/' className='flex items-center gap-2 text-xs text-stone-500 hover:text-black'>
							<ArrowUpRight size={15} aria-hidden='true' /> View storefront
						</Link>
					</div>
				</aside>

				<main id='admin-main' className='min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10'>
					<div className='mx-auto max-w-6xl'>
						<header id='overview' className='flex flex-wrap items-start justify-between gap-5'>
							<div>
								<p className='text-[11px] font-semibold tracking-[0.2em] text-stone-500 uppercase'>Your workspace</p>
								<h1 className='mt-2 font-editorial text-4xl font-semibold sm:text-5xl'>Store overview</h1>
								<p className='mt-2 text-sm text-stone-500'>A first look at managing your online boutique.</p>
							</div>
							<div className='flex items-center gap-3'>
								<span className='rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600'>Preview only</span>
								<form
									action={async () => {
										'use server';
										await signOut({ redirectTo: '/' });
									}}>
									<button type='submit' className='text-xs text-stone-500 underline hover:text-black'>
										Sign out
									</button>
								</form>
							</div>
						</header>

						<div className='mt-7 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950'>
							<LockKeyhole size={18} className='mt-0.5 shrink-0' aria-hidden='true' />
							<p>
								<strong>Preview.</strong> Administrator role management is available, but the products below are examples; orders, customer management and stock
								changes are unavailable. Do not enter real customer or business data.
							</p>
						</div>

						<section aria-label='Store summary' className='mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
							{summary.map(({ label, value, note, icon: Icon }) => (
								<div key={label} className='rounded-lg border border-stone-200 bg-white p-5'>
									<div className='flex items-center justify-between text-stone-500'>
										<span className='text-xs font-medium'>{label}</span>
										<Icon size={17} aria-hidden='true' />
									</div>
									<p className='mt-4 text-2xl font-semibold'>{value}</p>
									<p className='mt-1 text-xs text-stone-500'>{note}</p>
								</div>
							))}
						</section>

						<section id='products' className='mt-8 scroll-mt-6 rounded-lg border border-stone-200 bg-white'>
							<div className='flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 px-5 py-5 sm:px-6'>
								<div>
									<h2 className='text-lg font-semibold'>Products</h2>
									<p className='mt-1 text-xs text-stone-500'>Example catalogue from the storefront preview.</p>
								</div>
								<button type='button' disabled className={disabledButton}>
									<Plus size={15} aria-hidden='true' /> Add product
								</button>
							</div>
							<div className='overflow-x-auto'>
								<table className='w-full min-w-[560px] text-left text-sm'>
									<thead className='bg-stone-50 text-[11px] font-semibold tracking-wider text-stone-500 uppercase'>
										<tr>
											<th scope='col' className='px-6 py-3'>
												Product
											</th>
											<th scope='col' className='px-6 py-3'>
												Price
											</th>
											<th scope='col' className='px-6 py-3'>
												Stock
											</th>
											<th scope='col' className='px-6 py-3'>
												Status
											</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-stone-100'>
										{products.map((product) => (
											<tr key={product.id}>
												<td className='px-6 py-3'>
													<div className='flex items-center gap-3'>
														<div className='relative size-11 shrink-0 overflow-hidden rounded'>
															<Image src={product.image} alt='' fill sizes='44px' className='object-cover' />
														</div>
														<div>
															<p className='font-medium'>{product.title}</p>
															<p className='mt-1 text-xs text-stone-500'>{product.metal}</p>
														</div>
													</div>
												</td>
												<td className='px-6 py-3'>£{product.price.toFixed(2)}</td>
												<td className='px-6 py-3 text-stone-500'>Not connected</td>
												<td className='px-6 py-3'>
													<span className='rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600'>Example</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>

						<div className='mt-6 grid gap-6 xl:grid-cols-2'>
							<section id='orders' className='scroll-mt-6 rounded-lg border border-stone-200 bg-white p-6'>
								<div className='flex items-center justify-between gap-4'>
									<div>
										<h2 className='text-lg font-semibold'>Orders</h2>
										<p className='mt-1 text-xs text-stone-500'>A place to review and fulfil orders.</p>
									</div>
									<ShoppingBag size={20} className='text-stone-400' aria-hidden='true' />
								</div>
								<div className='mt-5 rounded-md bg-stone-50 px-4 py-6 text-center'>
									<p className='text-sm font-medium'>Orders are not connected</p>
									<p className='mt-1 text-xs text-stone-500'>No live order data is available in this preview.</p>
								</div>
							</section>
							<section id='inventory' className='scroll-mt-6 rounded-lg border border-stone-200 bg-white p-6'>
								<div className='flex items-center justify-between gap-4'>
									<div>
										<h2 className='text-lg font-semibold'>Inventory</h2>
										<p className='mt-1 text-xs text-stone-500'>Track stock and product availability.</p>
									</div>
									<Boxes size={20} className='text-stone-400' aria-hidden='true' />
								</div>
								<div className='mt-5 rounded-md bg-stone-50 px-4 py-6 text-center'>
									<p className='text-sm font-medium'>Stock tracking is not connected</p>
									<p className='mt-1 text-xs text-stone-500'>Stock levels will appear after the backend is built.</p>
								</div>
							</section>
							<section id='customers' className='scroll-mt-6 rounded-lg border border-stone-200 bg-white p-6'>
								<div className='flex items-center justify-between gap-4'>
									<div>
										<h2 className='text-lg font-semibold'>Customers</h2>
										<p className='mt-1 text-xs text-stone-500'>Customer management will be available later.</p>
									</div>
									<Users size={20} className='text-stone-400' aria-hidden='true' />
								</div>
								<div className='mt-5 rounded-md bg-stone-50 px-4 py-6 text-center'>
									<p className='text-sm font-medium'>Customer data is not connected</p>
									<p className='mt-1 text-xs text-stone-500'>Do not use this preview for real data.</p>
								</div>
							</section>
							<section id='settings' className='scroll-mt-6 rounded-lg border border-stone-200 bg-white p-6'>
								<div className='flex items-center justify-between gap-4'>
									<div>
										<h2 className='text-lg font-semibold'>Store setup</h2>
										<p className='mt-1 text-xs text-stone-500'>Connections needed before the shop can go live.</p>
									</div>
									<CircleHelp size={20} className='text-stone-400' aria-hidden='true' />
								</div>
								<ul className='mt-5 divide-y divide-stone-100 text-sm'>
									{['Secure admin sign-in', 'MongoDB and product data', 'Payments and orders'].map((item) => (
										<li key={item} className='flex items-center justify-between gap-3 py-3'>
											<span>{item}</span>
											<span className='shrink-0 text-xs text-stone-500'>Not connected</span>
										</li>
									))}
								</ul>
							</section>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
