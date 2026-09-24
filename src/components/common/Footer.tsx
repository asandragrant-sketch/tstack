import React from 'react'
import Link from 'next/link'
import { Mail, ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import { FIVERR_URL, CONTACT_EMAILS } from '@/types/contact'

export default function Footer() {
  const currentYear = 2026

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & Positioning */}
          <div className="space-y-4 md:col-span-1">
            <Logo variant="horizontal" iconSize={26} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineering AI automation, intelligent agents, and bespoke digital solutions for growing companies worldwide.
            </p>
            <div className="pt-1">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Hire us on Fiverr</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Core Capabilities */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-3.5">
              Core Capabilities
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services#ai-automation" className="hover:text-slate-200 transition-colors">
                  AI Automation &amp; Workflows
                </Link>
              </li>
              <li>
                <Link href="/services#ai-agents" className="hover:text-slate-200 transition-colors">
                  AI Agents &amp; Assistants
                </Link>
              </li>
              <li>
                <Link href="/services#web-solutions" className="hover:text-slate-200 transition-colors">
                  Web &amp; Business Solutions
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1">
                  <span>View All Services</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-3.5">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-slate-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-slate-200 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-200 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-200 transition-colors">
                  Contact &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Communications */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-3.5">
              Direct Inquiries
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {CONTACT_EMAILS.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{email}</span>
                </a>
              ))}
              <p className="text-[11px] text-slate-500 font-sans pt-2">
                USA • UK • Spain • Selected Parts of Asia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} TSTACK. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Escrow &amp; Contract Protected via Fiverr</span>
            <span className="text-slate-800">|</span>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
