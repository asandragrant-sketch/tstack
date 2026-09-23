import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { Mail, Globe2, Clock, ShieldCheck, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react'
import { CONTACT_EMAILS, SERVICE_REGIONS, FIVERR_URL } from '@/types/contact'

export const metadata: Metadata = {
  title: 'Contact TSTACK WEB | Start Your Digital Project',
  description:
    'Let’s build something great. Contact TSTACK WEB for custom web development, e-commerce, software engineering, and digital solutions across USA, UK, Spain, and Asia.',
  alternates: {
    canonical: 'https://tstackweb.com/contact',
  },
  openGraph: {
    title: 'Contact TSTACK WEB | Start Your Digital Project',
    description:
      'Tell us about your project, your goals, and what you want to achieve. Our leadership and engineering team will review your request and get back to you.',
    url: 'https://tstackweb.com/contact',
    siteName: 'TSTACK WEB',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      {/* Contact Hero */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-950/80 border border-blue-500/30 text-cyan-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>START A CONVERSATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.1] max-w-3xl mx-auto mb-6">
            LET&apos;S BUILD{' '}
            <span className="gradient-text-cyan">SOMETHING GREAT.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us about your project, your goals, and what you want to achieve. Our team will review your request and get back to you.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info Section */}
      <section className="relative py-20 sm:py-28 bg-slate-950 tech-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Info & Service Territories */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                  Project Inquiry &amp; Direct Communications
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We review incoming briefs thoroughly and prepare tailored architectural recommendations. You will hear directly from our development leads.
                </p>
              </div>

              {/* Direct Channels Cards */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Official Communication Channels:
                </div>

                {/* Direct Fiverr Action */}
                <a
                  href={FIVERR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#1dbf73]/10 border border-[#1dbf73]/50 hover:border-[#1dbf73] hover:bg-[#1dbf73]/20 flex items-center justify-between transition-all group shadow-lg shadow-[#1dbf73]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1dbf73]/20 border border-[#1dbf73]/40 flex items-center justify-center text-[#1dbf73] font-black text-lg group-hover:scale-110 transition-transform select-none">
                      fi.
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#1dbf73] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
                        Official Fiverr Marketplace
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        Order on Fiverr (Escrow &amp; Buyer Protected)
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#1dbf73] group-hover:translate-x-1 transition-transform">
                    View Gigs →
                  </span>
                </a>

                {CONTACT_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/50 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-500">Verified Email</div>
                        <div className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {email}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                      Send →
                    </span>
                  </a>
                ))}
              </div>

              {/* Global Regions Highlight */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <Globe2 className="w-4 h-4" />
                  <span>Service Territories</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {SERVICE_REGIONS}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Active delivery pipelines across North America, Europe, and Asia. Timezone-aligned sprint cycles and communication protocols.
                </p>
              </div>

              {/* Response Time Guarantee */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Prompt Response SLA</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All submitted requests are acknowledged within 24 business hours with an initial assessment and scheduling options for a technical discovery call.
                </p>
              </div>
            </div>

            {/* Right Column: Real Functional Form */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="p-12 text-center text-slate-500 font-mono">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
