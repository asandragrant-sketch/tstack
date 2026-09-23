'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Sparkles } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import MobileMenu from './MobileMenu'
import { FIVERR_URL } from '@/types/contact'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header py-3.5 shadow-2xl shadow-black/40'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <Logo variant="horizontal" iconSize={36} />
            </div>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-inner shadow-black/30"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-blue-600/30 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on Fiverr"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1dbf73]/15 border border-[#1dbf73]/30 text-[#1dbf73] hover:bg-[#1dbf73]/25 hover:text-white text-xs font-mono font-bold transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
                <span>Hire on Fiverr</span>
              </a>

              <Button
                href="/contact"
                variant="glow"
                size="sm"
                icon
                className="font-semibold tracking-wide shadow-blue-500/20"
              >
                Request a Quote
              </Button>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order on Fiverr"
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#1dbf73]/20 text-[#1dbf73] border border-[#1dbf73]/40 hover:bg-[#1dbf73]/30 transition-colors flex items-center gap-1"
              >
                <span>Fiverr</span>
              </a>
              <Link
                href="/contact"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
              >
                Quote
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
