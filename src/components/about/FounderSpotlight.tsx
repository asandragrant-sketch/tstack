import React from 'react'
import Image from 'next/image'
import { Terminal, ShieldCheck, Award, Sparkles, Code2, Globe2 } from 'lucide-react'

export default function FounderSpotlight() {
  return (
    <section className="relative py-20 sm:py-28 bg-slate-950 overflow-hidden border-b border-slate-900">
      {/* Ambient Lighting */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Founder Image Column */}
          <div className="lg:col-span-5 relative">
            {/* Glowing Backdrop Frame */}
            <div className="relative rounded-3xl p-2.5 glass-panel-glow border border-blue-500/30 shadow-2xl shadow-blue-950/50">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900">
                <Image
                  src="/images/founder-daniel-jacob.jpg"
                  alt="Daniel Jacob - Founder & Lead Solutions Architect of TSTACK WEB"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                
                {/* Subtle Image Gradient Overlay for Integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl glass-panel border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-sm font-display tracking-wide">
                        Daniel Jacob
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400">
                        Founder &amp; Lead Architect
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-300">
                      <Code2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Floating Technology Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 p-4 rounded-2xl glass-panel border border-cyan-500/40 shadow-xl shadow-cyan-950/40 items-center gap-3 animate-float-slow">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">
                  Engineering Vision
                </div>
                <div className="text-xs font-bold text-white">
                  Scalable Systems • Pure Code
                </div>
              </div>
            </div>
          </div>

          {/* Founder Editorial Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-950/70 border border-blue-500/30 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>LEADERSHIP &amp; ARCHITECTURAL VISION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-[1.15]">
              MEET THE FOUNDER:{' '}
              <span className="gradient-text-cyan">DANIEL JACOB</span>
            </h2>

            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                Founded by lead software architect <strong className="text-white font-semibold">Daniel Jacob</strong>, TSTACK WEB was created with a clear technological mandate: to free modern organizations from fragile website templates and deliver clean, enterprise-engineered digital solutions built around real business objectives.
              </p>
              <p>
                With a deep background in full-stack architecture, high-concurrency systems, server optimization, and modern React ecosystems, Daniel oversees the technical direction and engineering standards across all client engagements.
              </p>
              <p className="text-slate-400 text-sm">
                &ldquo;A website is not merely an electronic brochure — it is the digital epicenter of your brand, your primary conversion engine, and a key business asset. Our philosophy at TSTACK WEB is to build digital products with the same structural integrity, speed, and elegance required by high-growth global platforms.&rdquo;
              </p>
            </div>

            {/* Core Competencies Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong className="text-white block font-medium">Architectural Integrity</strong>
                  Built for performance, security, and continuous uptime.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
                <Globe2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong className="text-white block font-medium">Cross-Border Delivery</strong>
                  Serving clients across USA, UK, Spain, and Asia.
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">Email:</span>
                <a
                  href="mailto:D.JACOBWEBPRO@GMAIL.COM"
                  className="text-slate-300 hover:text-cyan-300 transition-colors underline underline-offset-4"
                >
                  D.JACOBWEBPRO@GMAIL.COM
                </a>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-2">
                <span className="text-[#1dbf73] font-bold">Fiverr:</span>
                <a
                  href="https://www.fiverr.com/s/bkdlzbX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1dbf73] hover:text-emerald-200 font-bold transition-colors underline underline-offset-4"
                >
                  Order on Fiverr (Verified Pro)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
