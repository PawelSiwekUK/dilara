'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  header: ReactNode
  footer: ReactNode
}

export function SiteShell({ children, header, footer }: Props) {
  const isLandingPage = usePathname() === '/'

  return (
    <>
      {!isLandingPage && header}
      {children}
      {!isLandingPage && footer}
    </>
  )
}
