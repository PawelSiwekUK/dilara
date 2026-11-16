import type { ReactNode } from 'react'

import { Header } from '@/components/Header'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import './globals.css'

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
      className={`${googleSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
