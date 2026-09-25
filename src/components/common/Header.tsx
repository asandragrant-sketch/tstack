'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ArrowUpRight, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import {
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL
} from '@/types/contact'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [fiverrMenuOpen, setFiverrMenuOpen] = useState(false)
  const fiverrRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fiverrRef.current && !fiverrRef.current.contains(e.target as Node)) {
        setFiverrMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          isScrolled
            ? 'pro-header py-3.5 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Logo variant="horizontal" iconSize={28} />

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-8"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Fiverr Dropdown / Direct Action */}
              <div
                ref={fiverrRef}
                className="relative"
                onMouseEnter={() => setFiverrMenuOpen(true)}
                onMouseLeave={() => setFiverrMenuOpen(false)}
              >
                <div className="inline-flex items-center rounded-md text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-950/70 hover:border-emerald-500/50 transition-colors">
                  <a
                    href={FIVERR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Order on Fiverr (Main Pro Profile)"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1dbf73]" />
                    <span>Order on Fiverr</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setFiverrMenuOpen(!fiverrMenuOpen)}
                    aria-label="Toggle Fiverr gig menu"
                    className="px-1.5 py-1.5 border-l border-emerald-500/20 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>

                {/* Dropdown with Specific Gigs */}
                {fiverrMenuOpen && (
                  <div className="absolute right-0 top-full pt-1.5 w-64 z-50 animate-in fade-in duration-100">
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 shadow-xl space-y-1">
                      <div className="px-2.5 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        Select Verified Gig
                      </div>
                      <a
                        href={FIVERR_GIG_AUTOMATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-2.5 py-2 rounded-md hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                          <span>AI Automation &amp; Workflows</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Pipelines, API sync &amp; automations
                        </div>
                      </a>
                      <a
                        href={FIVERR_GIG_AGENTS_WEB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-2.5 py-2 rounded-md hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                          <span>AI Agents &amp; Web Apps</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Custom agents &amp; Next.js platforms
                        </div>
                      </a>
                      <div className="pt-1 border-t border-slate-800/80">
                        <a
                          href={FIVERR_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-[11px] text-slate-400 hover:text-slate-200 text-left"
                        >
                          View Main Fiverr Pro Profile →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="http://localhost:3001"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                title="Launch TSTACK Client WebApp (Orders, Milestones, Dashboard)"
              >
                <span>Client Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-900 bg-white hover:bg-slate-100 transition-colors"
              >
                Start a Project
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/30"
              >
                Fiverr ↗
              </a>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
