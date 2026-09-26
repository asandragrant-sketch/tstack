import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ServicesCatalog from '@/components/services/ServicesCatalog'
import {
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL,
  CONTACT_EMAILS
} from '@/types/contact'

export const metadata: Metadata = {
  title: 'Services & Capabilities | TSTACK AI & Digital Solutions',
  description:
    'Comprehensive engineering capabilities: AI workflow automation, autonomous AI agents, full-stack Next.js web applications, and enterprise digital solutions.',
  alternates: {
    canonical: 'https://tstackweb.com/services',
  },
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen text-slate-300">
      {/* Services Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800">
              <span>CAPABILITIES &amp; SERVICES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Engineering services built for operational scale.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              From autonomous AI pipelines to custom web platforms, we build and deploy dependable systems tailored to your specific business requirements.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium transition-colors shadow-sm"
              >
                <span>Order via Fiverr (Escrow Protected)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
              >
                Request Custom Scope
              </Link>
            </div>

            {/* Quick Gigs strip */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
              <span className="text-slate-500 font-mono">Specific Gigs:</span>
              <a
                href={FIVERR_GIG_AUTOMATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>AI Automation Gig</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              </a>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <a
                href={FIVERR_GIG_AGENTS_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>AI Agents &amp; Web Gig</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Catalog */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <Suspense fallback={<div className="p-12 text-center text-slate-500 font-mono text-xs">Loading services...</div>}>
          <ServicesCatalog />
        </Suspense>
      </section>

      {/* End Consultation Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/70 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Have a custom requirement or existing stack?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            We adapt to your team’s existing tools, APIs, and business rules. Review your scope directly with our engineering leads.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium transition-colors"
            >
              Order on Fiverr (Escrow Protected) ↗
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
            >
              Send an Inquiry
            </Link>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <span className="text-slate-500 font-mono">Specific Gigs:</span>
            <a
              href={FIVERR_GIG_AUTOMATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>AI Automation Gig</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a
              href={FIVERR_GIG_AGENTS_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>AI Agents &amp; Web Gig</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500 font-sans">Direct Contacts:</span>
            {CONTACT_EMAILS.map((email, idx) => (
              <React.Fragment key={email}>
                {idx > 0 && <span className="text-slate-700 hidden sm:inline">•</span>}
                <a href={`mailto:${email}`} className="hover:text-slate-200 transition-colors">
                  {email}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
