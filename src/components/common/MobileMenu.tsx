'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ArrowUpRight, Mail } from 'lucide-react'
import Logo from './Logo'
import { FIVERR_URL, CONTACT_EMAILS } from '@/types/contact'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

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

  useEffect(() => {
    onClose()
  }, [pathname])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 md:hidden flex flex-col bg-slate-950/98 backdrop-blur-xl"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
        <Logo variant="horizontal" iconSize={26} />
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col justify-between">
        <nav className="space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
              pathname === '/' ? 'text-white bg-slate-900' : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </Link>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions & Verified Emails */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <a
            href={FIVERR_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Order on Fiverr</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <Link
            href="/contact"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm flex items-center justify-center transition-colors"
          >
            Start a Project
          </Link>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60 space-y-2 text-xs">
            <span className="text-slate-400 font-medium block">Direct Inquiries:</span>
            <div className="space-y-1 font-mono text-[11px] text-slate-400">
              {CONTACT_EMAILS.slice(0, 2).map((email) => (
                <div key={email} className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
