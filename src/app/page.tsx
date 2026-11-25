import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { Storefront } from '@/src/app/home';

export const metadata: Metadata = {
	title: "Dilara's Finesse | Sterling Silver Jewellery",
	description: "Discover Dilara's Finesse: artisanal 925 sterling silver jewellery, natural gemstones, and timeless keepsakes from an independent British jewellery house.",
};

export default function HomePage() {
	return (
		<>
			<Suspense fallback={<p>Loading storefront...</p>}>
				<Storefront />
			</Suspense>
			<Toaster />
		</>
	);
}
