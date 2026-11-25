import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
	partialPrefetching: true,
	async headers() {
		return ['/account/verify', '/account/reset'].map((source) => ({
			source,
			headers: [
				{ key: 'Referrer-Policy', value: 'no-referrer' },
				{ key: 'Cache-Control', value: 'no-store' },
			],
		}));
	},
	images: {
		qualities: [75, 90],
		remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-*' }],
	},
	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css',
			},
		},
	},
};

export default nextConfig;
