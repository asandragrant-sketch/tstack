import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { Mail, Globe2, Clock, ArrowUpRight } from 'lucide-react'
import {
  CONTACT_EMAILS,
  SERVICE_REGIONS,
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL
} from '@/types/contact'

export const metadata: Metadata = {
  title: 'Contact TSTACK | Project Inquiries & Consultations',
  description:
    'Discuss your AI automation, custom agents, or web application project with the TSTACK engineering team. Direct access to senior architects.',
  alternates: {
    canonical: 'https://tstackweb.com/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen text-slate-300">
      {/* Contact Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800">
              <span>CONTACT &amp; INQUIRIES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Let&apos;s discuss your project.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              Tell us about your automation requirements, business processes, or digital platform goals. Our technical leads review every brief thoroughly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Form Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Communication Channels & Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Direct Inquiries &amp; Channels
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  You can submit a project brief using this form, email our engineering leads directly, or initiate an order safely with escrow protection on Fiverr.
                </p>
              </div>

              {/* Direct Fiverr Orders & Verified Gigs Card */}
              <div className="pro-card p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1dbf73]" />
                    <span className="text-xs font-semibold text-white">Verified Fiverr Orders</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                    100% Escrow
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Initiate your project with milestone protection and verified delivery standards on Fiverr:
                </p>

                <div className="space-y-2 pt-1">
                  <a
                    href={FIVERR_GIG_AUTOMATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400">
                        AI Automation &amp; Workflows Gig
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Pipelines, CRM sync &amp; automated workflows
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </a>

                  <a
                    href={FIVERR_GIG_AGENTS_WEB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400">
                        AI Agents &amp; Web Solutions Gig
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Autonomous agents &amp; Next.js platforms
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </a>

                  <a
                    href={FIVERR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 flex items-center justify-between transition-colors text-xs text-slate-400 hover:text-slate-200"
                  >
                    <span>Main Fiverr Pro Profile (All Services)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* Verified Email List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  Official Communication Channels:
                </span>
                {CONTACT_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="pro-card p-3 flex items-center justify-between text-xs hover:border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      <span className="font-mono text-slate-300 group-hover:text-white">
                        {email}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300">
                      Send →
                    </span>
                  </a>
                ))}
              </div>

              {/* Service Regions & Response SLA */}
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span>Service Territories:</span>
                </div>
                <p className="text-slate-400 font-mono text-[11px]">
                  {SERVICE_REGIONS}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Acknowledged within 24 business hours</span>
                </div>
              </div>
            </div>

            {/* Right Column: Functional Contact Form */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="p-8 text-center text-slate-500 font-mono text-xs">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
