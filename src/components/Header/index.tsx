import './index.css'
import { HeaderClient } from './index.client'

export function Header() {
  return (
    <>
      <HeaderClient header={{ navItems: [] }} />
      <p className="container text-sm text-muted-foreground">
        Header navigation is not connected yet.
      </p>
    </>
  )
}
