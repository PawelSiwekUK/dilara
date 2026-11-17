'use client'

import { Handbag, Heart, Menu, Plus, User, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useId, useRef, useState } from 'react'
const storeURL = ''

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/category/all-products', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/about-1', label: 'Shipping & Returns Policy' },
]

const moreLinks = [
  { href: '/contact', label: 'Contact' },
  { href: '/reviews-thank-you-page', label: 'Thank You Page' },
  { href: '/reviews-collection-page', label: 'Leave Review Page' },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuButton = useRef<HTMLButtonElement>(null)

  if (pathname === '/') return null

  return (
    <header
      className="border-b border-neutral-200 bg-white text-neutral-900"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="mx-auto grid max-w-screen-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-y-2 px-4 py-6 sm:px-6 lg:min-h-[248px] lg:px-8">
        <button
          ref={menuButton}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          className="col-start-1 row-start-1 flex size-11 items-center justify-center justify-self-start rounded lg:hidden"
        >
          <span aria-hidden="true" className="relative block size-6">
            <Menu
              className={`absolute inset-0 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${menuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
              size={24}
              strokeWidth={1.5}
            />
            <X
              className={` size-6 absolute inset-0 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'}`}
              size={24}
              strokeWidth={1.5}
            />
          </span>
        </button>
        <a
          aria-label="Dilara's Finesse home"
          className="col-start-2 row-start-1 rounded focus-visible:outline-2 focus-visible:outline-offset-4"
          href={`${storeURL}/`}
        >
          <Image
            src="/logo.avif"
            width={363}
            height={188}
            alt="Dilara's Finesse"
            className="h-auto w-[40vw] max-w-[270px] sm:w-[30vw]"
            preload
          />
        </a>
        <nav
          id={menuId}
          aria-label="Main navigation"
          className={`col-span-3 row-start-2 lg:block ${menuOpen ? 'block' : 'hidden'}`}
        >
          <ul className="flex flex-col items-start gap-x-6 gap-y-2 py-4 text-md font-medium lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-8 lg:py-0">
            {mainLinks.map(({ href, label }) => (
              <li key={href} className="flex w-full border-b lg:w-auto lg:border-0">
                <a
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-4 lg:min-h-[76px]"
                  href={`${storeURL}${href}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                  <Plus className="size-5 shrink-0 md:hidden" aria-hidden="true" />
                </a>
              </li>
            ))}
            <li>
              <details className="relative">
                <summary className="flex min-h-11 cursor-pointer list-none items-center rounded hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-4 lg:min-h-[76px]">
                  More
                </summary>
                <ul className="absolute left-0 z-10 mt-2 min-w-56 rounded-md border border-neutral-200 bg-white p-2 shadow-lg lg:left-auto lg:right-0">
                  {moreLinks.map(({ href, label }) => (
                    <li key={href}>
                      <a
                        className="block rounded px-3 py-2 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2"
                        href={`${storeURL}${href}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </nav>
        <div className="col-start-3 row-start-1 flex justify-self-end">
          <a aria-label="Customer login" className="p-1 sm:mx-2" href="/login">
            <User className="size-6 md:size-7" aria-hidden="true" size={32} strokeWidth={1.5} />
          </a>
          <a
            aria-label="Cart on the existing store"
            className="p-1 sm:mx-2"
            href={`${storeURL}/cart-page`}
          >
            <Heart className="size-6 md:size-7" aria-hidden="true" size={32} strokeWidth={1.5} />
          </a>
          <a
            aria-label="Cart on the existing store"
            className="p-1 sm:mx-2"
            href={`${storeURL}/cart-page`}
          >
            <Handbag className="size-6 md:size-7" aria-hidden="true" size={32} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </header>
  )
}
