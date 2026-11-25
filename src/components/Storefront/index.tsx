'use client';

import { ArrowLeft, ArrowRight, Camera, Globe, Heart, Menu, MessageSquare, RotateCcw, Search, ShoppingBag, Truck, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';

import { categories, heroSlides, navigation, products, workshopImage } from './data';
import type { StorefrontProduct } from './data';

const dialogClass = 'rounded-none border-brand-border bg-brand-white font-storefront text-brand-charcoal';

const money = (value: number) => `\u00a3${value}`;

function Brand() {
	return (
		<Link href='/' aria-label="Dilara's Finesse home" className='flex flex-col items-center text-center'>
			<span className='-mb-1 font-script text-[28px] leading-none sm:text-[34px]'>DF</span>
			<span className='whitespace-nowrap font-script text-[22px] leading-tight sm:text-[28px]'>Dilara&apos;s Finesse</span>
			<span className='mt-0.5 flex items-center gap-1.5'>
				<span className='h-px w-4 bg-brand-charcoal/50 sm:w-7' />
				<span className='whitespace-nowrap text-[7px] font-medium uppercase tracking-brand sm:text-[8px]'>Sterling Silver Jewellery</span>
				<span className='h-px w-4 bg-brand-charcoal/50 sm:w-7' />
			</span>
		</Link>
	);
}

function ProductPrice({ product }: { product: StorefrontProduct }) {
	return (
		<span className='flex flex-wrap items-center gap-1.5 text-[11px]'>
			{product.originalPrice ? (
				<>
					<span className='text-brand-muted line-through'>{money(product.originalPrice)}</span>
					<span className='font-semibold text-brand-sale'>{money(product.price)}</span>
					<span className='text-[10px] text-brand-muted'>{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
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
			<a href='#main-content' className='sr-only z-50 bg-white p-3 focus:not-sr-only focus:fixed'>
				Skip to content
			</a>
			<p className='bg-brand-surface px-4 py-2 text-center text-xs'>Preview: products and bag selections are examples. Checkout is not connected.</p>
			<header className='sticky top-0 z-40 border-b border-brand-border/70 bg-brand-white/95 backdrop-blur-sm'>
				<div className='mx-auto max-w-[1380px] px-4 pt-3.5 pb-3 sm:px-8 md:pt-5 md:pb-4'>
					<div className='grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center'>
						<div className='flex items-center'>
							<Dialog open={menuOpen} onOpenChange={setMenuOpen}>
								<DialogTrigger asChild>
									<button ref={menuTrigger} className='-ml-2 p-2 md:hidden' aria-label='Open menu'>
										<Menu size={20} strokeWidth={1.4} />
									</button>
								</DialogTrigger>
								<DialogContent
									className={`${dialogClass} top-0 left-0 h-dvh max-h-dvh w-72 max-w-[82vw] translate-x-0 translate-y-0 content-start gap-0 border-0 p-6 sm:max-w-72`}>
									<DialogTitle className='border-b border-brand-border pb-5 font-script text-2xl font-normal'>Dilara&apos;s Finesse</DialogTitle>
									<DialogDescription className='sr-only'>Browse our boutique</DialogDescription>
									<nav aria-label='Mobile navigation' className='mt-6'>
										{[...navigation, { href: '#category-section', label: 'Shop by Category' }].map(({ href, label }) => (
											<a
												key={href}
												href={href}
												onClick={() => setMenuOpen(false)}
												className='block py-3 text-xs font-medium uppercase tracking-brand hover:text-brand-muted'>
												{label}
											</a>
										))}
									</nav>
									<div className='mt-8 space-y-2 border-t border-brand-border pt-5 text-[11px] text-brand-muted'>
										<p>925 Hallmarked Sterling Silver</p>
										<p>Complimentary UK Delivery</p>
									</div>
								</DialogContent>
							</Dialog>
							<button
								onClick={(event) => openPanel('search', event.currentTarget)}
								className='hidden items-center gap-2 text-[11px] uppercase tracking-brand text-brand-muted transition-colors hover:text-brand-charcoal md:inline-flex'>
								<Search size={16} strokeWidth={1.4} />
								Search
							</button>
						</div>
						<Brand />
						<div className='-mr-1 flex items-center justify-end sm:gap-2'>
							<Link href='/account' aria-label='Customer account' title='Customer account' className='p-1.5 sm:p-2'>
								<User size={18} strokeWidth={1.4} />
							</Link>
							<button
								aria-label={`Wishlist (${wishlist.length} items)`}
								onClick={(event) => openPanel('wishlist', event.currentTarget)}
								className='relative p-1.5 sm:p-2'>
								<Heart size={18} strokeWidth={1.4} />
								{wishlist.length > 0 && <span className='absolute top-1 right-1 size-1.5 rounded-full bg-brand-charcoal' />}
							</button>
							<button aria-label={`Shopping bag (${bag.length} items)`} onClick={(event) => openPanel('bag', event.currentTarget)} className='relative p-1.5 sm:p-2'>
								<ShoppingBag size={18} strokeWidth={1.4} />
								<span className='absolute top-0 right-0 text-[9px] font-semibold'>{bag.length}</span>
							</button>
						</div>
					</div>
					<nav aria-label='Primary navigation' className='mt-4 hidden items-center justify-center gap-8 pt-1 text-[11px] font-medium tracking-wide md:flex lg:gap-10'>
						{navigation.map(({ href, label }) => (
							<a key={href} href={href} className='transition-colors hover:text-brand-muted'>
								{label}
							</a>
						))}
					</nav>
				</div>
			</header>

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
						<h1 className='mb-6 text-[19px] leading-[1.45] font-normal uppercase tracking-editorial sm:mb-7 sm:text-[24px] md:text-[26px]'>
							Dilara&apos;s Finesse
							<br />
							Fine Sterling Silver
						</h1>
						<p className='text-[13px] leading-[1.85] text-brand-charcoal/90 sm:text-[15px] md:text-[16px]'>
							Dilara&apos;s Finesse, an independent British jewellery house dedicated to artisanal 925 sterling silver and natural gemstones, is a distinguished
							specialist in timeless keepsakes with flagship salons in Winchester and Royal Tunbridge Wells, as well as our online boutique. Since our inception,
							Dilara&apos;s Finesse has solidified its reputation as a beloved jeweller, unwaveringly upholding the highest standards of craft.
						</p>
					</div>
				</section>

				<section id='collections-section' aria-label='Recommended creations' className='scroll-mt-40 pb-12 sm:pb-16'>
					<div className='mx-auto max-w-[1380px] px-4 sm:px-8'>
						<div className='mb-4 flex items-center justify-between sm:mb-6'>
							<h2 className='font-editorial text-[20px] font-medium italic sm:text-[24px]'>We think you may like...</h2>
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
											<span className='pointer-events-none absolute top-2.5 right-2.5 border border-brand-border/60 bg-brand-white px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider sm:text-[9px]'>
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
											<h3 className='line-clamp-2 text-[11px] leading-snug font-medium sm:text-[12px]'>{product.title}</h3>
											<div className='mt-1 flex items-center gap-1.5'>
												<span
													className='inline-block size-3 shrink-0 rounded-full border border-brand-charcoal/30'
													style={{ backgroundColor: product.swatch }}
												/>
												<span className='truncate text-[10px] text-brand-muted'>{product.metal}</span>
											</div>
										</div>
										<div className='mt-1.5 flex items-center justify-between gap-2'>
											<ProductPrice product={product} />
											<button
												aria-label={`Add ${product.title} to bag`}
												onClick={() => addToBag(product)}
												className='shrink-0 border-b border-brand-charcoal/50 py-1 text-[9px] font-medium uppercase tracking-wider hover:border-brand-charcoal'>
												+ Bag
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
        <section
          id="category-section"
          aria-label="Shop by category"
          className="scroll-mt-40 pt-4 pb-12 sm:pb-16"
        >
          <div className="mx-auto max-w-[1380px] sm:px-8">
            <div className="mb-8 px-4 text-center sm:mb-10">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-brand text-brand-muted sm:text-[11px]">
                Shop by
              </p>
              <h2 className="text-[20px] font-normal uppercase tracking-editorial sm:text-[24px]">
                Category
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {categories.map((category) => (
                <article key={category.name} className="group overflow-hidden bg-brand-surface">
                  <h3 className="px-3 pt-4 pb-3 text-center text-[13px] font-normal uppercase tracking-brand sm:text-[15px]">
                    {category.name}
                  </h3>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#eaeaea]">
                    <Image
                      src={category.image}
                      alt={`${category.name} collection`}
                      fill
                      quality={90}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
                    />
                  </div>
                  <div className="flex flex-col items-center px-3 pt-4 pb-4 text-center">
                    <button
                      className={buttonClass}
                      onClick={() =>
                        toast.info(
                          `${category.name} collection is not connected to the catalogue yet.`,
                        )
                      }
                    >
                      Shop {category.name}
                    </button>
                    <div aria-hidden="true" className="mt-6 flex w-full items-center gap-2">
                      <span className="size-1.5 rounded-full bg-brand-charcoal" />
                      <span className="size-1.5 rounded-full bg-brand-charcoal/25" />
                      <span className="size-1.5 rounded-full bg-brand-charcoal/25" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

				<section id='category-section' aria-label='Shop by category' className='scroll-mt-40 pt-4 pb-12 sm:pb-16'>
					<div className='mx-auto max-w-[1380px] sm:px-8'>
						<div className='mb-8 px-4 text-center sm:mb-10'>
							<p className='mb-1.5 text-[10px] font-medium uppercase tracking-brand text-brand-muted sm:text-[11px]'>Shop by</p>
							<h2 className='text-[20px] font-normal uppercase tracking-editorial sm:text-[24px]'>Category</h2>
						</div>
						<div className='grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2'>
							{categories.map((category) => (
								<article key={category.name} className='group overflow-hidden bg-brand-surface'>
									<div className='relative aspect-[16/10] overflow-hidden bg-[#eaeaea]'>
										<Image
											src={category.image}
											alt={`${category.name} collection`}
											fill
											quality={90}
											sizes='(max-width: 768px) 100vw, 50vw'
											className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none'
										/>
									</div>
									<div className='flex flex-col items-center px-6 pt-6 pb-5 text-center'>
										<h3 className='mb-4 text-[17px] font-normal uppercase tracking-brand sm:text-[19px]'>{category.name}</h3>
										<button
											className='border border-brand-charcoal px-5 py-2 text-[10px] font-medium uppercase tracking-brand transition-colors hover:bg-brand-charcoal hover:text-brand-white'
											onClick={() => toast.info(`${category.name} collection is not connected to the catalogue yet.`)}>
											Shop {category.name}
										</button>
										<div aria-hidden='true' className='mt-6 flex w-full items-center gap-2'>
											<span className='size-1.5 rounded-full bg-brand-charcoal' />
											<span className='size-1.5 rounded-full bg-brand-charcoal/25' />
											<span className='size-1.5 rounded-full bg-brand-charcoal/25' />
										</div>
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
									<span className='text-center text-[11px] font-semibold'>
										0%
										<br />
										<span className='text-[7px]'>APR</span>
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
									<p className='text-[10px] font-semibold tracking-wide sm:text-[11px]'>{title}</p>
									<p className='text-[9px] font-medium tracking-wider sm:text-[10px]'>{subtitle}</p>
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
							<p className='mb-2.5 text-[9px] font-medium uppercase tracking-editorial text-white/85 sm:text-[10px]'>Master craftsmen</p>
							<h2 className='mb-4 text-[20px] font-normal uppercase tracking-brand sm:text-[26px] md:text-[30px]'>A cut above the rest</h2>
							<p className='mb-6 text-[12px] leading-[1.75] font-light text-white/90 sm:text-[13.5px]'>
								A family-run atelier that prides itself on helping and supporting you to turn those cherished moments into statement sterling silver pieces that
								will last a lifetime.
							</p>
							<a href='#heritage-section' className='border-b border-white pb-0.5 text-[11px] tracking-wider hover:text-white/80'>
								Find Out More
							</a>
						</div>
					</div>
				</section>
			</main>

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
					<div className='mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-brand-muted sm:text-[11px]'>
						{['Terms & Conditions', 'Privacy Policy', 'Modern Slavery Act'].map((label) => (
							<button key={label} onClick={() => toast.info(`${label} has not been published yet.`)} className='hover:text-brand-charcoal'>
								{label}
							</button>
						))}
						<Link href='/admin/login' className='hover:text-brand-charcoal'>
							Admin sign in
						</Link>
					</div>
					<p className='mx-auto mb-10 max-w-[680px] text-[9.5px] leading-[1.75] text-brand-muted sm:text-[10.5px]'>
						Dilara&apos;s Finesse Ltd (Registered in England &amp; Wales) is authorised and regulated by the Financial Conduct Authority for consumer credit broking.
						All sterling silver jewellery is independently assayed and hallmarked in the United Kingdom in accordance with the Hallmarking Act 1973. 0% APR
						representative finance is subject to status and minimum spend.
					</p>
				</div>
				<div className='space-y-1 border-t border-brand-border/70 bg-brand-surface px-4 py-4 text-center text-[10px] text-brand-muted'>
					<p>&copy; Dilara&apos;s Finesse {new Date().getFullYear()}. All rights reserved.</p>
					<p className='text-[9px] text-brand-muted'>Crafted in Sterling Silver &bull; United Kingdom</p>
				</div>
			</footer>

			<button
				aria-label='Open customer support chat'
				onClick={(event) => openPanel('support', event.currentTarget)}
				className='fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-full bg-brand-charcoal text-brand-white shadow-lg transition-transform hover:scale-105 motion-reduce:transition-none'>
				<MessageSquare size={20} />
			</button>

			<Dialog open={activeProduct !== null} onOpenChange={(open) => !open && setActiveProduct(null)}>
				<DialogContent
					className={`${dialogClass} gap-0 overflow-y-auto p-0 sm:max-w-xl sm:grid-cols-2`}
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						productTrigger.current?.focus();
					}}>
					{activeProduct && (
						<>
							<div className='relative aspect-square bg-brand-surface'>
								<Image src={activeProduct.image} alt={activeProduct.title} fill sizes='288px' quality={90} className='object-contain p-6 mix-blend-multiply' />
							</div>
							<div className='flex flex-col justify-between p-6'>
								<div>
									<p className='pr-5 text-[9px] uppercase tracking-brand text-brand-muted'>{activeProduct.badge || 'Sterling silver'}</p>
									<DialogTitle className='mt-2 text-base leading-snug font-medium'>{activeProduct.title}</DialogTitle>
									<DialogDescription className='mt-1 text-[11px] text-brand-muted'>{activeProduct.metal}</DialogDescription>
									<div className='mt-3'>
										<ProductPrice product={activeProduct} />
									</div>
									<p className='mt-4 text-[11px] leading-relaxed text-brand-muted'>
										Individually finished by hand and UK hallmarked. Arrives in Dilara&apos;s Finesse signature presentation box with complimentary insured
										delivery.
									</p>
								</div>
								<DialogClose asChild>
									<button
									className='mt-6 w-full border border-brand-charcoal px-5 py-3 text-[10px] font-medium uppercase tracking-brand transition-colors hover:bg-brand-charcoal hover:text-brand-white'
									onClick={() => addToBag(activeProduct)}>
										Add to Bag
									</button>
								</DialogClose>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={panel !== null} onOpenChange={(open) => !open && setPanel(null)}>
				<DialogContent
					className={dialogClass}
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						panelTrigger.current?.focus();
					}}>
					<DialogTitle className='pr-5 text-base font-medium'>
						{panel === 'bag' ? 'Your shopping bag' : panel === 'wishlist' ? 'Your wishlist' : panel === 'search' ? 'Search the collection' : 'Boutique Concierge'}
					</DialogTitle>
					<DialogDescription className='text-xs leading-relaxed text-brand-muted'>
						{panel === 'support'
							? 'Live messaging is not connected yet. Please visit our boutique for assistance with sizing or hallmarking.'
							: 'Explore the sample collection. Bag and wishlist selections are a preview for this visit only; checkout is not connected.'}
					</DialogDescription>
					{panel === 'search' && (
						<label className='text-xs'>
							Search jewellery
							<input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								type='search'
								placeholder='Try silver or necklace'
								className='mt-2 w-full border border-brand-border px-3 py-2'
							/>
						</label>
					)}
					{panel !== 'support' && (
						<ul className='space-y-4'>
							{(panel === 'search' ? searchResults : products.filter((product) => (panel === 'bag' ? bag : wishlist).includes(product.id))).map((product) => (
								<li key={product.id} className='flex items-center justify-between gap-3 border-b border-brand-border pb-3 text-xs'>
									<div>
										<p className='font-medium'>{product.title}</p>
										<div className='mt-1'>
											<ProductPrice product={product} />
										</div>
										{panel === 'bag' && <p className='mt-1 text-brand-muted'>Quantity: {bag.filter((id) => id === product.id).length}</p>}
									</div>
									{panel !== 'search' && (
										<button
											aria-label={`Remove ${product.title}`}
											className='text-brand-muted underline'
											onClick={() => (panel === 'bag' ? setBag((current) => current.filter((id) => id !== product.id)) : toggleWishlist(product))}>
											Remove
										</button>
									)}
								</li>
							))}
						</ul>
					)}
					{((panel === 'bag' && bag.length === 0) || (panel === 'wishlist' && wishlist.length === 0)) && (
						<p className='text-sm'>No items yet. Discover your next keepsake below.</p>
					)}
					{panel === 'search' && searchResults.length === 0 && <p className='text-sm'>No matching jewellery found.</p>}
					{panel === 'bag' && bag.length > 0 && (
						<p className='text-sm font-medium'>
							Total: {money(products.reduce((total, product) => total + product.price * bag.filter((id) => id === product.id).length, 0))}
						</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
