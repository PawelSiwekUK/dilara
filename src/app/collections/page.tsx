import { Suspense } from 'react';

import { CollectionGrid } from '../home/CollectionGrid';

export default function CollectionsPage() {
	return (
		<Suspense fallback={<p>Loading collection...</p>}>
			<CollectionGrid />
		</Suspense>
	);
}
