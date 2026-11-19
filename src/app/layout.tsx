import { Suspense, type ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from 'next/font/google';

import { Footer } from '@/src/components/Footer';
import { Header } from '@/src/components/Header';
import { SiteShell } from '@/src/components/layout/SiteShell';

import './globals.css';

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

export default async function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en' className={`${jakarta.variable} ${cormorant.variable} ${greatVibes.variable}`} suppressHydrationWarning>
			<head>
				<link href='/favicon.ico' rel='icon' sizes='32x32' />
				<link href='/favicon.svg' rel='icon' type='image/svg+xml' />
			</head>
			<body>
				<ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem>
					<Suspense fallback={children}>
						<SiteShell header={<Header />} footer={<Footer />}>{children}</SiteShell>
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}
