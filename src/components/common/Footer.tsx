import React from 'react'
import Link from 'next/link'
import { Mail, Globe, ArrowUpRight, ShieldCheck, Zap, Code2 } from 'lucide-react'
import Logo from './Logo'
import { FIVERR_URL, CONTACT_EMAILS } from '@/types/contact'

export default function Footer() {
  const currentYear = 2026

  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 overflow-hidden text-slate-400">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Col 1 & 2: Brand overview */}
          <div className="lg:col-span-2 space-y-5">
            <Logo variant="horizontal" iconSize={36} />
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm">
              Building modern digital experiences for businesses ready to grow. Full-service web development, digital architecture, and custom technology solutions.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Service Regions: USA • UK • Spain • Asia</span>
              </div>
            </div>

            {/* Direct verified contact emails */}
            <div className="pt-2 space-y-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Direct Communications
              </div>
              <div className="space-y-1.5">
                <a
                  href={FIVERR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs sm:text-sm text-[#1dbf73] hover:text-emerald-300 transition-colors group font-mono font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
                  <span>Order on Fiverr (Escrow Protected)</span>
                </a>
                {CONTACT_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-cyan-400 transition-colors group"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400 group-hover:text-cyan-400 shrink-0" />
                    <span className="font-mono text-xs">{email}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-display">
              Company Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Home</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>About Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Our Services</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Contact Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group font-medium">
                  <span>Request a Project Quote</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-100 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Selected Services */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-display">
              Featured Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#website-design" className="hover:text-white transition-colors">
                  Website Design
                </Link>
              </li>
              <li>
                <Link href="/services#website-development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services#ecommerce-development" className="hover:text-white transition-colors">
                  E-commerce Solutions
                </Link>
              </li>
              <li>
                <Link href="/services#ui-ux-design" className="hover:text-white transition-colors">
                  UI/UX Architecture
                </Link>
              </li>
              <li>
                <Link href="/services#web-applications" className="hover:text-white transition-colors">
                  Web Applications
                </Link>
              </li>
              <li>
                <Link href="/services#seo-services" className="hover:text-white transition-colors">
                  Technical SEO & Core Vitals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Engineering Commitment */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-display">
              Standards & Quality
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Production-ready code built with Next.js, React & TypeScript standards.</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Strict Core Web Vitals optimization across all screen viewports.</span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Serving businesses across USA, UK, Spain, and Asia.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} TSTACK WEB. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>USA • UK • Spain • Asia</span>
            <span className="text-slate-700">|</span>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Inquire
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Leadership
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
