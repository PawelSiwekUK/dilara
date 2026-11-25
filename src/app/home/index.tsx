'use client';

import { ArrowLeft, ArrowRight, Camera, Globe, Heart, Menu, MessageSquare, RotateCcw, Search, ShoppingBag, Truck, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

import { categories, heroSlides, navigation, products, workshopImage } from './data';
import type { StorefrontProduct } from './data';

const dialogClass = 'rounded-none border-brand-border bg-brand-white font-storefront text-brand-charcoal';
const buttonClass = '';
const money = (value: number) => `\u00a3${value}`;

function ProductPrice({ product }: { product: StorefrontProduct }) {
	return (
		<span className='flex flex-wrap items-center gap-1.5 text-[12px]'>
			{product.originalPrice ? (
				<>
					<span className='text-brand-muted line-through'>{money(product.originalPrice)}</span>
					<span className='font-semibold text-brand-sale'>{money(product.price)}</span>
					<span className='text-[11px] text-brand-muted'>{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
				</>
			) : (
				<span className='font-medium'>{money(product.price)}</span>
			)}
		</span>
	);
}

export function Storefront() {
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

	const slide = heroSlides[heroIndex];
	const searchResults = products.filter((product) => `${product.title} ${product.metal}`.toLowerCase().includes(search.trim().toLowerCase()));

	function openPanel(next: NonNullable<typeof panel>, trigger: HTMLElement) {
		panelTrigger.current = trigger;
		setPanel(next);
	}

	function addToBag(product: StorefrontProduct) {
		setBag((current) => [...current, product.id]);
		toast.success(`${product.title} added to your preview bag`);
	}

	function toggleWishlist(product: StorefrontProduct) {
		const saved = wishlist.includes(product.id);
		setWishlist((current) => (saved ? current.filter((id) => id !== product.id) : [...current, product.id]));
		toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
	}

	return (
		<div className='min-h-screen bg-brand-white font-storefront text-brand-charcoal antialiased selection:bg-brand-charcoal selection:text-brand-white'>
			<main id='main-content'>
				<section aria-label='Hero showcase' className='relative overflow-hidden bg-brand-surface'>
					<div className='relative h-[300px] w-full sm:h-[440px] md:h-[540px] lg:h-[600px]'>
						<Image
							key={slide.image}
							src={slide.image}
							alt={slide.alt}
							fill
							sizes='100vw'
							quality={90}
							preload={heroIndex === 0}
							className='object-cover object-center'
						/>
						<div className='pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent' />
						<div role='group' aria-label='Hero slides' className='absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center'>
							{heroSlides.map((item, index) => (
								<button
									key={item.image}
									aria-label={`Slide ${index + 1}`}
									aria-pressed={heroIndex === index}
									onClick={() => setHeroIndex(index)}
									className='flex size-8 items-center justify-center'>
									<span className={`rounded-full transition-all ${heroIndex === index ? 'size-2 bg-white' : 'size-1.5 bg-white/55'}`} />
								</button>
							))}
						</div>
					</div>
				</section>

				<section id='heritage-section' aria-label='Brand heritage' className='scroll-mt-40 px-6 py-14 sm:px-10 sm:py-20 md:py-24'>
					<div className='mx-auto max-w-[740px] text-center'>
						<h1 className='mb-6 text-[20px] leading-[1.45] font-normal uppercase tracking-editorial sm:mb-7 sm:text-[25px] md:text-[27px]'>
							Dilara&apos;s Finesse
							<br />
							Fine Sterling Silver
						</h1>
						<p className='text-[14px] leading-[1.85] text-brand-charcoal/90 sm:text-[16px] md:text-[17px]'>
							Dilara&apos;s Finesse, an independent British jewellery house dedicated to artisanal 925 sterling silver and natural gemstones, is a distinguished
							specialist in timeless keepsakes with flagship salons in Winchester and Royal Tunbridge Wells, as well as our online boutique. Since our inception,
							Dilara&apos;s Finesse has solidified its reputation as a beloved jeweller, unwaveringly upholding the highest standards of craft.
						</p>
					</div>
				</section>

				<section id='collections-section' aria-label='Recommended creations' className='scroll-mt-40 pb-12 sm:pb-16'>
					<div className='mx-auto max-w-[1380px] px-4 sm:px-8'>
						<div className='mb-4 flex items-center justify-between sm:mb-6'>
							<h2 className='font-editorial text-[21px] font-medium italic sm:text-[25px]'>We think you may like...</h2>
							<div className='hidden items-center gap-2 sm:flex'>
								{[-1, 1].map((direction) => (
									<button
										key={direction}
										aria-label={direction === -1 ? 'Previous products' : 'Next products'}
										className='flex size-8 items-center justify-center border border-brand-border transition-colors hover:border-brand-charcoal'
										onClick={() =>
											rail.current?.scrollBy({
												left: direction * 320,
												behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
											})
										}>
										{direction === -1 ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
									</button>
								))}
							</div>
						</div>
						<div
							ref={rail}
							aria-label='Recommended products'
							tabIndex={0}
							className='flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden'>
							{products.map((product) => (
								<article key={product.id} className='group flex w-[46%] shrink-0 snap-start flex-col sm:w-[31%] lg:w-[23.8%]'>
									<div className='relative aspect-square overflow-hidden bg-brand-surface transition-[background-color,box-shadow] duration-300 hover:bg-[#f1f1f1] hover:shadow-[0_10px_26px_#1a1a1a0d]'>
										<button
											onClick={(event) => {
												productTrigger.current = event.currentTarget;
												setActiveProduct(product);
											}}
											aria-label={`View ${product.title}`}
											className='absolute inset-0 flex items-center justify-center'>
											<span className='relative block size-3/4'>
												<Image
													src={product.image}
													alt={product.title}
													fill
													sizes='(max-width: 640px) 35vw, (max-width: 1024px) 24vw, 240px'
													quality={90}
													className='object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none'
												/>
											</span>
										</button>
										{product.badge && (
											<span className='pointer-events-none absolute top-2.5 right-2.5 border border-brand-border/60 bg-brand-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider sm:text-[10px]'>
												{product.badge}
											</span>
										)}
										<button
											aria-label={`Save ${product.title} to wishlist`}
											aria-pressed={wishlist.includes(product.id)}
											onClick={() => toggleWishlist(product)}
											className='absolute top-1 left-1 flex size-9 items-center justify-center text-brand-muted hover:text-brand-charcoal'>
											<Heart size={14} strokeWidth={1.5} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
										</button>
									</div>
									<div className='flex flex-1 flex-col justify-between pt-2.5'>
										<div>
											<h3 className='line-clamp-2 text-[12px] leading-snug font-medium sm:text-[13px]'>{product.title}</h3>
											<div className='mt-1 flex items-center gap-1.5'>
												<span
													className='inline-block size-3 shrink-0 rounded-full border border-brand-charcoal/30'
													style={{ backgroundColor: product.swatch }}
												/>
												<span className='truncate text-[11px] text-brand-muted'>{product.metal}</span>
											</div>
										</div>
										<div className='mt-1.5 flex items-center justify-between gap-2'>
											<ProductPrice product={product} />
											<button
												aria-label={`Add ${product.title} to bag`}
												onClick={() => addToBag(product)}
												className='shrink-0 border-b border-brand-charcoal/50 py-1 text-[10px] font-medium uppercase tracking-wider hover:border-brand-charcoal'>
												+ Bag
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>

				<section id='category-section' aria-label='Shop by category' className='scroll-mt-40 pt-4  sm:pb-16'>
					<div className='mx-auto max-w-[1380px] sm:px-8'>
						<div className='mb-8 px-4 text-center sm:mb-10'>
							<p className='mb-1.5 text-[11px] font-medium uppercase tracking-brand text-brand-muted sm:text-[12px]'>Shop by</p>
							<h2 className='text-[21px] font-normal uppercase tracking-editorial sm:text-[25px]'>Category</h2>
						</div>
						<div className='grid grid-cols-1  sm:gap-8 md:grid-cols-2'>
							{categories.map((category) => (
								<article key={category.label} className='group overflow-hidden bg-brand-surface'>
									<div className='relative aspect-[16/10] overflow-hidden bg-[#eaeaea]'>
										<Image
											src={category.image}
											alt={`${category.label} collection`}
											fill
											quality={90}
											sizes='(max-width: 768px) 100vw, 50vw'
											className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none'
										/>
									</div>
									<div className='flex flex-col items-center px-6 pt-6 pb-5 text-center'>
										<h3 className='mb-4 text-[18px] font-normal uppercase tracking-brand sm:text-[20px]'>{category.label}</h3>
										<Link
											href={`/collections?${new URLSearchParams({ category: category.label }).toString()}`}
											className='border border-brand-charcoal px-5 py-2 text-[11px] font-medium uppercase tracking-brand transition-colors hover:bg-brand-charcoal hover:text-brand-white mb-7'>
											Shop {category.label}
										</Link>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>

				<section id='service-strip' aria-label='Customer guarantees' className='scroll-mt-40 border-y border-brand-border/70 px-4 py-10 sm:px-8 sm:py-12'>
					<div className='mx-auto grid max-w-[1140px] grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 md:grid-cols-4'>
						{[
							{
								icon: <Truck size={20} strokeWidth={1.35} />,
								title: 'Free',
								subtitle: 'UK delivery',
							},
							{
								icon: (
									<span className='text-center text-[12px] font-semibold'>
										0%
										<br />
										<span className='text-[8px]'>APR</span>
									</span>
								),
								title: 'Interest free',
								subtitle: 'Credit',
							},
							{
								icon: <ShoppingBag size={20} strokeWidth={1.35} />,
								title: 'Click &',
								subtitle: 'Collect',
							},
							{
								icon: <RotateCcw size={20} strokeWidth={1.35} />,
								title: '30 day return',
								subtitle: 'Policy',
							},
						].map(({ icon, title, subtitle }) => (
							<div key={title} className='flex items-center justify-center gap-3'>
								<span aria-hidden='true' className='flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-charcoal'>
									{icon}
								</span>
								<div className='max-w-24 text-left leading-tight uppercase'>
									<p className='text-[11px] font-semibold tracking-wide sm:text-[12px]'>{title}</p>
									<p className='text-[10px] font-medium tracking-wider sm:text-[11px]'>{subtitle}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section id='craftsmen-section' aria-label='Master craftsmen' className='relative scroll-mt-40 overflow-hidden bg-brand-charcoal text-brand-white'>
					<div className='relative flex h-[300px] items-center justify-center sm:h-[360px] md:h-[400px]'>
						<Image
							src={workshopImage}
							alt='Artisan silversmith hand-setting a sterling silver ring in our workshop'
							fill
							quality={90}
							sizes='100vw'
							className='object-cover opacity-55 contrast-125 grayscale'
						/>
						<div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/55 to-black/70' />
						<div className='relative mx-auto max-w-[660px] px-6 text-center'>
							<p className='mb-2.5 text-[10px] font-medium uppercase tracking-editorial text-white/85 sm:text-[11px]'>Master craftsmen</p>
							<h2 className='mb-4 text-[21px] font-normal uppercase tracking-brand sm:text-[27px] md:text-[31px]'>A cut above the rest</h2>
							<p className='mb-6 text-[13px] leading-[1.75] font-light text-white/90 sm:text-[14.5px]'>
								A family-run atelier that prides itself on helping and supporting you to turn those cherished moments into statement sterling silver pieces that
								will last a lifetime.
							</p>
							<a href='/about' className='border-b border-white pb-0.5 text-[12px] tracking-wider hover:text-white/80'>
								Find Out More
							</a>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
