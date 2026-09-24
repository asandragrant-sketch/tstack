import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { FIVERR_URL } from '@/types/contact'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>AI Automation • Custom Agents • Business Software</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.12] text-balance">
            We build practical AI automation, autonomous agents, and software for modern businesses.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto text-balance">
            TSTACK designs and deploys reliable automated workflows, custom AI assistants, and high-performance digital systems that eliminate repetitive operations and scale business capacity.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
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
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-sm font-medium border border-slate-800 transition-colors"
            >
              <span>View Core Services</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              Verified Pro Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              100% Milestone Escrow
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              Direct Senior Developer Access
            </span>
          </div>
        </div>

        {/* Clean, Tangible Architecture Preview Card */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
          <div className="pro-card p-6 sm:p-8 shadow-sm">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="ml-2 font-mono text-slate-400">system_architecture.config</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                Production Live
              </span>
            </div>

            {/* Architecture Flow Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Step 1 */}
              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">01. INGESTION</div>
                <div className="text-sm font-semibold text-white">Event &amp; Data Pipeline</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time webhook ingestion from web forms, customer emails, CRMs, and payment gateways.
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400">
                  Status: <span className="text-slate-200">Listening (0.04s)</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">02. INTELLIGENCE</div>
                <div className="text-sm font-semibold text-white">Custom AI Agent Execution</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Contextual analysis, structured schema validation, document retrieval, and intent classification.
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400">
                  Model: <span className="text-slate-200">Trained Domain Logic</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">03. RESOLUTION</div>
                <div className="text-sm font-semibold text-white">Automated Delivery &amp; Sync</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatic database sync, client communication dispatch, and workflow status notifications.
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400">
                  Outcome: <span className="text-emerald-400 font-medium">99.8% Reliability</span>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Strip */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
              <span>Stack: Next.js • Python / Node.js • LangChain / Custom LLMs • Supabase • PostgreSQL</span>
              <Link href="/services" className="text-blue-400 hover:text-blue-300 font-sans font-medium transition-colors">
                Explore full stack capabilities →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
