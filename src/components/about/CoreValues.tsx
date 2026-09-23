import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import {
  Sparkles,
  Award,
  Eye,
  Zap,
  Users2,
  Hourglass
} from 'lucide-react'

const VALUES = [
  {
    title: 'Innovation',
    icon: Sparkles,
    badge: 'Pioneering',
    description:
      'We constantly explore and adopt cutting-edge frontend patterns, serverless runtimes, and progressive web capabilities that keep our clients ahead of the competition.',
  },
  {
    title: 'Quality',
    icon: Award,
    badge: 'Craftsmanship',
    description:
      'From pixel-perfect responsiveness down to the cleanest TypeScript type definitions, we hold ourselves to uncompromising standards of aesthetic and structural quality.',
  },
  {
    title: 'Transparency',
    icon: Eye,
    badge: 'Honesty',
    description:
      'Clear scopes, predictable milestones, transparent communication, and honest technical guidance. No jargon obfuscation, hidden fees, or false claims.',
  },
  {
    title: 'Performance',
    icon: Zap,
    badge: 'Sub-Second',
    description:
      'Speed is treated as a fundamental design imperative. We optimize bundle size, database roundtrips, and cache invalidation to achieve near-instantaneous load times.',
  },
  {
    title: 'Collaboration',
    icon: Users2,
    badge: 'Partnership',
    description:
      'We work as an extension of your internal team. Regular check-ins, asynchronous updates, and collaborative decision-making guarantee alignment at every stage.',
  },
  {
    title: 'Long-Term Thinking',
    icon: Hourglass,
    badge: 'Longevity',
    description:
      'We architect software and websites designed to scale gracefully over years, not months. We prioritize maintainability and modularity over temporary shortcuts.',
  },
]

export default function CoreValues() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 tech-dot-pattern border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Guiding Principles"
          title="THE CORE VALUES THAT"
          highlight="DEFINE OUR WORK"
          description="Every line of code and interface decision at TSTACK WEB is guided by six enduring commercial and engineering commitments."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUES.map((val) => {
            const Icon = val.icon
            return (
              <div
                key={val.title}
                className="p-8 rounded-2xl glass-panel border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-blue-900/50 transition-all">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {val.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-blue-200 transition-colors">
                    {val.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/70 text-[10px] font-mono text-cyan-400/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Verified Standard</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
