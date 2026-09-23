import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import { Sparkles, Code2, Layers, Cpu, ShieldCheck } from 'lucide-react'

export default function Introduction() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-slate-900">
      {/* Background Subtle Gradient & Mesh */}
      <div className="absolute inset-0 bg-radial-at-t from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Full-Service Digital Agency"
          title="DESIGN. DEVELOPMENT."
          highlight="TECHNOLOGY. GROWTH."
          description="TSTACK WEB is an international web development and digital solutions company. We engineer polished digital products and websites that merge artistic craft with rigorous technology."
        />

        {/* Narrative & Value Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600/25 transition-all mb-5">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Distinctive Design</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every interface is crafted bespoke from the ground up, translating your distinct brand vision into an unforgettable visual presence.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-600/25 transition-all mb-5">
              <Code2 className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Modern Engineering</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Clean, modular, and maintainable TypeScript & React codebases built on modern Next.js foundations for enterprise scalability.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600/25 transition-all mb-5">
              <Cpu className="w-6 h-6 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Speed & Performance</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Engineered for sub-second loading speeds, optimal Core Web Vitals, and responsive fluidity across all mobile, tablet, and desktop screens.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600/25 transition-all mb-5">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Long-Term Reliability</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              A dependable digital partner offering proactive technical maintenance, security governance, and long-term evolutionary support.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
