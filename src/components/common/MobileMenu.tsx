'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ArrowRight, Mail, Globe, Shield } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close when pathname changes
  useEffect(() => {
    onClose()
  }, [pathname])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 md:hidden flex flex-col bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 animate-heroFadeIn"
    >
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
        <Logo variant="horizontal" iconSize={32} />
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
        <nav className="space-y-2">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-lg font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Bottom Drawer Content */}
        <div className="pt-8 border-t border-slate-800/70 space-y-6">
          <Button
            href="/contact"
            onClick={onClose}
            variant="glow"
            size="lg"
            className="w-full justify-center text-center shadow-blue-500/30 font-bold"
            icon
          >
            Get Started / Request a Quote
          </Button>

          <a
            href="https://wa.me/66961014547"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Chat on WhatsApp: +66 96 101 4547</span>
          </a>

          <div className="space-y-2 text-xs text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>International Delivery Hubs:</span>
            </div>
            <p className="text-slate-400 font-mono">USA • UK • Spain • Asia</p>
            <div className="flex items-center gap-2 pt-2 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>D.JACOBWEBPRO@GMAIL.COM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
