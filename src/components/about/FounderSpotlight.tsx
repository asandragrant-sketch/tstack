import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { FIVERR_URL } from '@/types/contact'

export default function FounderSpotlight() {
  return (
    <section className="py-20 sm:py-28 border-b border-slate-900 bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Founder Portrait Column */}
          <div className="lg:col-span-5">
            <div className="pro-card p-3 shadow-sm max-w-md mx-auto lg:max-w-none">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-slate-900">
                <Image
                  src="/images/founder-daniel-jacob.jpg"
                  alt="Daniel Kylan Jacob - Founder & Lead Solutions Architect of TSTACK"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>

              <div className="p-4 pt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Daniel Kylan Jacob</h3>
                  <p className="text-xs text-slate-400 font-mono">Founder &amp; Lead Architect</p>
                </div>
                <a
                  href={FIVERR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#1dbf73] hover:text-emerald-300 font-medium transition-colors"
                >
                  <span>Fiverr</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Editorial Content & Team Overview Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800">
              <span>LEADERSHIP &amp; ENGINEERING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
              Practical engineering, driven by measurable business ROI.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              <p>
                Founded by software architect <strong className="text-slate-200 font-medium">Daniel Kylan Jacob</strong>, TSTACK was created with a clear mandate: to help modern companies eliminate repetitive operational bottlenecks through dependable AI automation, autonomous agents, and production-grade web systems.
              </p>
              <p>
                Rather than treating software as a superficial marketing brochure, we approach every deployment as a mission-critical business asset—engineered for resilience, fast execution, and seamless integration with existing tools.
              </p>
            </div>

            {/* Engineering Partners & Team */}
            <div className="pt-2 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Technical Solutions &amp; Delivery Partners:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* David Alison */}
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-sm font-semibold text-white">David Alison</div>
                  <div className="text-xs text-blue-400 font-mono">Technical Solutions &amp; AI Architecture</div>
                  <a
                    href="mailto:davidalisonwebpro@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono pt-1"
                  >
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>davidalisonwebpro@gmail.com</span>
                  </a>
                </div>

                {/* Baron */}
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-sm font-semibold text-white">Baron</div>
                  <div className="text-xs text-emerald-400 font-mono">Project Delivery &amp; Systems Management</div>
                  <a
                    href="mailto:baronwebpro@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono pt-1"
                  >
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>baronwebpro@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Verification Channels */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 border-t border-slate-900">
              <span className="text-slate-500 font-sans">Official Channels:</span>
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1dbf73] hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <span>Verified Fiverr Profile (Escrow Protected)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-400">USA • UK • Spain • Asia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
