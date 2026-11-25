import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: "Shipping & Returns | Dilara's Finesse",
	description: "Find delivery information and read the shipping and returns policies for Dilara's Finesse.",
};

const shippingDetails = [
	{
		title: 'Processing time',
		description: 'All orders are processed and dispatched within 1–2 business days.',
	},
	{
		title: 'Shipping costs',
		description: 'Delivery costs £4.49 for orders under £100, and is FREE for orders over £100.',
	},
	{
		title: 'Delivery times',
		description: 'We offer Standard Delivery across the United Kingdom. Delivery typically takes 3–5 business days.',
	},
	{
		title: 'Tracking',
		description: 'Once your beautiful jewellery is on its way, you will receive a confirmation email with tracking details.',
	},
];

export default function ShippingAndReturnsPage() {
	return (
		<div className='min-h-screen bg-brand-white font-storefront text-brand-charcoal antialiased'>
			<main id='main-content'>
				<section className='border-b border-brand-border/70 bg-brand-surface px-5 py-14 text-center sm:px-8 sm:py-20'>
					<p className='mb-4 text-[10px] font-medium uppercase tracking-editorial text-brand-muted sm:text-[11px]'>Customer care</p>
					<h1 className='font-editorial text-[39px] leading-tight font-normal sm:text-[55px]'>Shipping &amp; Returns</h1>
					<div className='mx-auto mt-6 h-px w-12 bg-brand-charcoal/40' />
				</section>

				<section aria-labelledby='shipping-policy' className='mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20'>
					<div className='mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between'>
						<div>
							<p className='mb-2 text-[10px] font-medium uppercase tracking-editorial text-brand-muted sm:text-[11px]'>Delivery information</p>
							<h2 id='shipping-policy' className='font-editorial text-[31px] font-normal sm:text-[39px]'>
								Shipping Policy
							</h2>
						</div>
						<p className='max-w-[360px] text-[13px] leading-[1.8] text-brand-muted sm:text-right sm:text-[14px]'>
							Everything you need to know about receiving your order.
						</p>
					</div>

					<div className='grid gap-px border border-brand-border bg-brand-border sm:grid-cols-2'>
						{shippingDetails.map(({ title, description }, index) => (
							<article key={title} className='bg-brand-white p-5 sm:p-7'>
								<p className='mb-5 font-editorial text-[15px] italic text-brand-muted'>0{index + 1}</p>
								<h3 className='mb-2 text-[11px] font-medium uppercase tracking-brand sm:text-[12px]'>{title}</h3>
								<p className='text-[13px] leading-[1.8] text-brand-muted sm:text-[14px]'>{description}</p>
							</article>
						))}
					</div>
				</section>

				<section aria-labelledby='returns-policy' className='border-t border-brand-border/70 bg-brand-surface px-5 py-14 sm:px-8 sm:py-20'>
					<div className='mx-auto max-w-[900px]'>
						<p className='mb-2 text-[10px] font-medium uppercase tracking-editorial text-brand-muted sm:text-[11px]'>Your rights and options</p>
						<h2 id='returns-policy' className='mb-7 font-editorial text-[31px] font-normal sm:mb-9 sm:text-[39px]'>
							Returns Policy
						</h2>
						<div className='space-y-5 text-[13px] leading-[1.9] text-brand-charcoal/80 sm:text-[15px]'>
							<p>
								Our return policy follows all requirements of UK consumer law, including the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013,
								giving you a clear and fair experience when shopping with us. For all online purchases, you have a 14‑day return period starting from the day you
								receive your order, during which you may cancel and return the item for a full refund, provided the jewellery is unused, unworn, and returned in its
								original packaging; please note that for hygiene reasons we cannot accept returns on earrings unless they are faulty.
							</p>
							<p>
								If your item arrives damaged, defective, or not as described, you are entitled to a repair, replacement, or refund, and we ask that you notify us
								within 30 days so we can resolve the issue promptly. Custom‑made, engraved, or personalised pieces are exempt from change‑of‑mind returns but remain
								fully protected under your statutory rights if faulty.
							</p>
							<p>
								Refunds are issued to the original payment method within 14 days of us receiving the returned item. Customers are responsible for return postage
								costs for unwanted items, but we will cover all costs for faulty or incorrect goods. This policy does not affect your statutory rights.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
