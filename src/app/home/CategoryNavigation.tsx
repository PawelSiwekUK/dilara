'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

import { categories } from './data';

export function CategoryNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeCategory = pathname === '/collections' ? searchParams.get('category') : null;

	return (
		<nav aria-label='Product types' className={mobile ? 'mt-6 flex flex-col gap-1' : 'mb-2 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-5'}>
			{categories.map(({ label, image }) => {
				const href = `/collections?${new URLSearchParams({ category: label }).toString()}`;
				return (
					<Link
						key={label}
						href={href}
						aria-current={activeCategory === label ? 'page' : undefined}
						onClick={(event) => {
							if (pathname === '/collections' && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
								event.preventDefault();
								if (activeCategory !== label) {
									const url = new URL(window.location.href);
									url.searchParams.set('category', label);
									window.history.pushState(null, '', url);
								}
							}
							onNavigate?.();
						}}
						className={`px-3 py-2 text-[18px] capital tracking-brand transition-[color,box-shadow] hover:text-brand-charcoal hover:shadow-[0_6px_5px_-5px_rgba(26,26,26,0.3)] ${mobile ? 'flex items-center gap-3 text-left' : 'text-center'} ${activeCategory === label ? 'text-brand-charcoal shadow-[0_6px_5px_-5px_rgba(26,26,26,0.3)]' : 'text-brand-muted'}`}>
						{mobile && <Image src={image} alt='' width={48} height={48} className='size-12 shrink-0 object-cover rounded-lg' />}
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
