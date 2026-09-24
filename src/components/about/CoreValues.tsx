import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import { Target, ShieldCheck, Eye, Zap, Users, Lock } from 'lucide-react'

const VALUES = [
  {
    title: 'Pragmatic Engineering',
    icon: Target,
    description:
      'We prioritize solutions that solve real business bottlenecks. No unproven technological fads or unnecessary complexity.',
  },
  {
    title: 'Structural Quality',
    icon: ShieldCheck,
    description:
      'Clean TypeScript, robust API contracts, and strict error handling ensure that every system runs smoothly in production.',
  },
  {
    title: 'Complete Transparency',
    icon: Eye,
    description:
      'Clear scopes, realistic timelines, and direct developer communication. You always know what is being built and why.',
  },
  {
    title: 'Performance & Speed',
    icon: Zap,
    description:
      'Every millisecond matters. We optimize database queries, payload sizes, and cache policies to achieve sub-second execution.',
  },
  {
    title: 'Direct Collaboration',
    icon: Users,
    description:
      'You collaborate directly with the senior engineers designing your system, ensuring zero loss of context from idea to launch.',
  },
  {
    title: 'Security & Escrow Protection',
    icon: Lock,
    description:
      'Safe contracting and milestone verification through Fiverr, with enterprise-grade data privacy and access control standards.',
  },
]

export default function CoreValues() {
  return (
    <section className="py-20 sm:py-28 border-b border-slate-900 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Guiding Principles"
          title="Core Values"
          highlight="that define our engineering standards."
          description="Every architecture decision and line of code is held to these six operational principles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((val, idx) => {
            const Icon = val.icon
            return (
              <div
                key={val.title}
                className="pro-card pro-card-hover p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2">
                    {val.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
