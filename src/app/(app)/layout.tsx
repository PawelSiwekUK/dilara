import type { ReactNode } from 'react'

import { Header } from '@/components/Header'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
})

const googleSans = localFont({
  src: [
    {
      path: '../../fonts/Google_Sans/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: '../../fonts/Google_Sans/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf',
      weight: '400 700',
      style: 'italic',
    },
  ],
  variable: '--font-google-sans',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${googleSans.variable} ${GeistMono.variable} ${jakarta.variable} ${cormorant.variable} ${greatVibes.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
