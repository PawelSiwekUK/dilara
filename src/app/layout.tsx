'use client';
import type { ReactNode } from 'react';
import { Suspense, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { CategoryNavigation } from '@/src/app/home/CategoryNavigation';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';

const navigation = [
	{ href: '/about', label: 'About' },
	{ href: '/shipping&return', label: 'Shipping & Returns Policy' },
	{ href: '/contact', label: 'Contact' },
	{ href: '/thank-you', label: 'Thank You Page' },
	{ href: '/leave-review', label: 'Leave Review Page' },
];
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from 'next/font/google';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import './globals.css';
import { Heart, Menu, Search, ShoppingBag, User, Camera, Globe } from 'lucide-react';
const dialogClass = 'rounded-none border-brand-border bg-brand-white font-storefront text-brand-charcoal';
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const cormorant = Cormorant_Garamond({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	style: ['normal', 'italic'],
	variable: '--font-cormorant',
	display: 'swap',
});
const greatVibes = Great_Vibes({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-great-vibes',
	display: 'swap',
});

type StorefrontProduct = { [key: string]: any };
function Brand() {
	return (
		<Link href='/' aria-label="Dilara's Finesse home" className='col-span-2 col-start-1 row-start-1 flex flex-col items-center text-center sm:col-span-1 sm:col-start-2'>
			<span className='-mb-1 font-script text-[31px] leading-none sm:text-[37px]'>DF</span>
			<span className='whitespace-nowrap font-script text-[25px] leading-tight sm:text-[31px]'>Dilara&apos;s Finesse</span>
			<span className='mt-0.5 flex items-center gap-1.5'>
				<span className='h-px w-4 bg-brand-charcoal/50 sm:w-7' />
				<span className='whitespace-nowrap text-[10px] font-medium uppercase tracking-brand sm:text-[11px]'>Sterling Silver Jewellery</span>
				<span className='h-px w-4 bg-brand-charcoal/50 sm:w-7' />
			</span>
		</Link>
	);
}
export default function RootLayout({ children }: { children: ReactNode }) {
	const [heroIndex, setHeroIndex] = useState(0);
	const [wishlist, setWishlist] = useState<string[]>([]);
	const [bag, setBag] = useState<string[]>([]);
	const [activeProduct, setActiveProduct] = useState<StorefrontProduct | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [panel, setPanel] = useState<'bag' | 'wishlist' | 'search' | 'support' | null>(null);
	const [search, setSearch] = useState('');
	const rail = useRef<HTMLDivElement>(null);
	const menuTrigger = useRef<HTMLButtonElement>(null);
	const productTrigger = useRef<HTMLButtonElement | null>(null);
	const panelTrigger = useRef<HTMLElement | null>(null);
	const currentYear = 2026;
	function openPanel(next: NonNullable<typeof panel>, trigger: HTMLElement) {
		panelTrigger.current = trigger;
		setPanel(next);
	}
	return (
		<html lang='en' className={`${jakarta.variable} ${cormorant.variable} ${greatVibes.variable}`}>
			<body>
				<header className='sticky top-0 z-40 border-b border-brand-border/70 bg-brand-white/95 backdrop-blur-sm'>
					<div className='mx-auto max-w-[1380px] px-4 pt-3.5 pb-3 sm:px-8 md:pt-5 md:pb-4'>
						<div className='grid grid-cols-2 items-center gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-y-0'>
							<div className='col-start-1 row-start-2 flex items-center sm:row-start-1'>
								<Dialog open={menuOpen} onOpenChange={setMenuOpen}>
									<DialogTrigger asChild>
										<button ref={menuTrigger} className='-ml-2 p-2 md:hidden' aria-label='Open menu'>
											<Menu size={20} strokeWidth={1.4} />
										</button>
									</DialogTrigger>
									<DialogContent
										className={`${dialogClass} top-0 left-0 h-dvh max-h-dvh w-72 max-w-[82vw] translate-x-0 translate-y-0 content-start gap-0 overflow-y-auto border-0 p-6 sm:max-w-72`}>
										<DialogTitle className='border-b border-brand-border pb-5 font-script text-2xl font-normal'>Dilara&apos;s Finesse</DialogTitle>
										<DialogDescription className='sr-only'>Browse our boutique</DialogDescription>
										<Suspense fallback={null}>
											<CategoryNavigation mobile onNavigate={() => setMenuOpen(false)} />
										</Suspense>

										<div className='mt-8 space-y-2 border-t border-brand-border pt-5 text-[12px] text-brand-muted'>
											<p>925 Hallmarked Sterling Silver</p>
											<p>Complimentary UK Delivery</p>
										</div>
									</DialogContent>
								</Dialog>
								<button
									onClick={(event) => openPanel('search', event.currentTarget)}
									className='hidden items-center gap-2 text-[12px] uppercase tracking-brand text-brand-muted transition-colors hover:text-brand-charcoal md:inline-flex'>
									<Search size={16} strokeWidth={1.4} />
									Search
								</button>
							</div>
							<Brand />
							<div className='-mr-1 col-start-2 row-start-2 flex items-center justify-end sm:col-start-3 sm:row-start-1 sm:gap-2'>
								<Link href='/account' aria-label='Customer account' title='Customer account' className='p-1.5 sm:p-2'>
									<User size={20} strokeWidth={1.4} />
								</Link>
								<button
									aria-label={`Wishlist (${wishlist.length} items)`}
									onClick={(event) => openPanel('wishlist', event.currentTarget)}
									className='relative p-1.5 sm:p-2'>
									<Heart size={20} strokeWidth={1.4} />
									{wishlist.length > 0 && <span className='absolute top-1 right-1 size-1.5 rounded-full bg-brand-charcoal' />}
								</button>
								<button
									aria-label={`Shopping bag (${bag.length} items)`}
									onClick={(event) => openPanel('bag', event.currentTarget)}
									className='relative p-1.5 sm:p-2'>
									<ShoppingBag size={20} strokeWidth={1.4} />
									<span className='absolute top-0 right-0 text-[12px] font-semibold'>{bag.length}</span>
								</button>
							</div>
						</div>
						<div className='mt-4 hidden items-center justify-center gap-8 pt-1 text-[18px] tracking-wide md:flex lg:gap-10'>
							<Suspense fallback={null}>
								<CategoryNavigation />
							</Suspense>
						</div>
					</div>
				</header>
				<Suspense fallback={null}>
					<Breadcrumbs />
				</Suspense>
				{children}
				<footer className='pt-10 sm:pt-12'>
					<div className='mx-auto max-w-[920px] px-6 text-center'>
						<div className='mb-7 flex items-center justify-center gap-3.5'>
							{[
								{ label: 'Facebook', icon: <Globe size={16} /> },
								{ label: 'Instagram', icon: <Camera size={16} /> },
								{ label: 'TikTok', icon: <span className='text-sm font-semibold'>♪</span> },
								{ label: 'X', icon: <span className='text-sm'>X</span> },
							].map(({ label, icon }) => (
								<button
									key={label}
									aria-label={label}
									onClick={() => toast.info(`Our ${label} profile has not been linked yet.`)}
									className='flex size-9 items-center justify-center rounded-full bg-brand-charcoal text-brand-white transition-colors hover:bg-brand-muted'>
									{icon}
								</button>
							))}
						</div>
						<div className='mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-brand-muted sm:text-[12px]'>
							<nav aria-label='Mobile navigation' className='mt-6 flex flex-col md:flex-row gap-1 md:gap-4'>
								{navigation.map(({ href, label }) => (
									<a
										key={href}
										href={href}
										onClick={() => setMenuOpen(false)}
										className='block py-3 text-[calc(0.75rem+3px)] leading-[var(--text-xs--line-height)] font-medium uppercase tracking-brand hover:text-brand-muted'>
										{label}
									</a>
								))}
							</nav>
							{/* <Link href='/admin/login' className='hover:text-brand-charcoal'>
								Admin sign in
							</Link> */}
						</div>
						<p className='mx-auto mb-10 max-w-[680px] text-[10.5px] leading-[1.75] text-brand-muted sm:text-[11.5px]'>
							Dilara&apos;s Finesse (Registered in England &amp; Wales) is authorised and regulated by the Financial Conduct Authority for consumer credit broking.
							All sterling silver jewellery is independently assayed and hallmarked in the United Kingdom in accordance with the Hallmarking Act 1973.
						</p>
					</div>
					<div className='space-y-1 border-t border-brand-border/70 bg-brand-surface px-4 py-4 text-center text-[11px] text-brand-muted'>
						<p>&copy; Dilara&apos;s Finesse {currentYear}. All rights reserved.</p>
						<p className='text-[10px] text-brand-muted'>Crafted in Sterling Silver &bull; United Kingdom</p>
					</div>
				</footer>
			</body>
		</html>
	);
}
