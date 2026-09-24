import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { FIVERR_URL } from '@/types/contact'

export default function HomeCTA() {
  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800 mb-6">
          <span>PROJECT CONSULTATION</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight mb-4">
          Ready to automate your operations or build your next digital product?
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          Get in touch to discuss your architecture, or initiate an order directly with milestone protection on Fiverr.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <a
            href={FIVERR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-sm font-medium transition-colors shadow-sm"
          >
            <span>Order on Fiverr (Escrow Protected)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-sm font-medium border border-slate-800 transition-colors"
          >
            Send a Project Inquiry
          </Link>
        </div>

        {/* Verified Direct Emails */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500 font-sans">Direct Inquiries:</span>
          <a
            href="mailto:davidalisonwebpro@gmail.com"
            className="hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>davidalisonwebpro@gmail.com</span>
          </a>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <a
            href="mailto:baronwebpro@gmail.com"
            className="hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>baronwebpro@gmail.com</span>
          </a>
        </div>
      </div>
    </section>
  )
}
