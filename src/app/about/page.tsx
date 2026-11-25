import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: "About Us | Dilara's Finesse",
	description: "Discover Dilara's Finesse, where sterling silver and gold jewellery bring together thoughtful craftsmanship, personal style, and timeless design.",
};

const principles = [
	{
		number: '01',
		title: 'Made with care',
		description: 'A curated collection shaped by a passion for craftsmanship and attention to detail.',
	},
	{
		number: '02',
		title: 'Made for you',
		description: 'Jewellery for women and men, with styles for every taste, occasion, and individuality.',
	},
	{
		number: '03',
		title: 'Tradition meets today',
		description: 'A thoughtful blend of traditional influence and contemporary design.',
	},
];

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-brand-white font-storefront text-brand-charcoal antialiased'>
			<main id='main-content'>
				<section className='border-b border-brand-border/70 bg-brand-surface px-5 py-16 sm:px-8 sm:py-24'>
					<div className='mx-auto max-w-[900px] text-center'>
						<p className='mb-5 text-[10px] font-medium uppercase tracking-editorial text-brand-muted sm:text-[11px]'>The story behind the jewellery</p>
						<h1 className='font-editorial text-[43px] leading-[1.05] font-normal sm:text-[61px] md:text-[73px]'>About us</h1>
						<div className='mx-auto my-7 h-px w-12 bg-brand-charcoal/40 sm:my-9' />
						<p className='mx-auto max-w-[720px] text-[14px] leading-[1.9] text-brand-charcoal/80 sm:text-[16px] md:text-[17px]'>
							Welcome to Dilara&apos;s Finesse, your ultimate destination for exquisite sterling silver and gold jewellery for both women and men. Our passion for
							craftsmanship and attention to detail drive us to curate a stunning collection that reflects elegance and style.
						</p>
					</div>
				</section>

				<section aria-labelledby='our-approach' className='px-5 py-16 sm:px-8 sm:py-24'>
					<div className='mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16'>
						<div>
							<p className='mb-3 text-[10px] font-medium uppercase tracking-editorial text-brand-muted sm:text-[11px]'>Thoughtfully chosen</p>
							<h2 id='our-approach' className='max-w-[360px] font-editorial text-[33px] leading-tight font-normal sm:text-[43px]'>
								Jewellery that feels like you.
							</h2>
						</div>
						<div className='max-w-[650px]'>
							<p className='text-[14px] leading-[1.9] text-brand-charcoal/80 sm:text-[16px]'>
								At Dilara&apos;s Finesse, we take pride in offering a diverse range of jewellery that caters to every taste and occasion. Our team is dedicated to
								providing a personalized experience, ensuring that each piece resonates with your individuality. Discover the perfect blend of tradition and
								contemporary design at Dilara&apos;s Finesse.
							</p>
							<Link
								href='/collections'
								className='mt-7 inline-flex border-b border-brand-charcoal pb-1 text-[11px] font-medium uppercase tracking-brand transition-colors hover:text-brand-muted sm:text-[12px]'>
								Explore the collection
							</Link>
						</div>
					</div>
				</section>

				<section aria-label='What defines our collection' className='border-t border-brand-border/70 bg-brand-surface px-5 py-14 sm:px-8 sm:py-20'>
					<div className='mx-auto grid max-w-[1180px] gap-8 sm:grid-cols-3 sm:gap-6'>
						{principles.map(({ number, title, description }) => (
							<article key={number} className='border-t border-brand-border pt-5'>
								<p className='mb-6 font-editorial text-[15px] italic text-brand-muted'>{number}</p>
								<h3 className='mb-2 text-[11px] font-medium uppercase tracking-brand sm:text-[12px]'>{title}</h3>
								<p className='max-w-[320px] text-[13px] leading-[1.8] text-brand-muted sm:text-[14px]'>{description}</p>
							</article>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
