import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import {
  Cpu,
  Smartphone,
  Zap,
  TrendingUp,
  HeartHandshake,
  LifeBuoy,
  CheckCircle2
} from 'lucide-react'

const PILLARS = [
  {
    title: 'Modern Technology',
    icon: Cpu,
    description:
      'We leverage contemporary, production-proven tools and development practices — including Next.js, React, and TypeScript — avoiding deprecated libraries and obsolete frameworks.',
    points: ['Strict typing and clean architecture', 'Zero-legacy build pipelines', 'Continuous automated linting & tests'],
  },
  {
    title: 'Responsive Design',
    icon: Smartphone,
    description:
      'Every interface is meticulously engineered to adapt gracefully across mobile, tablet, laptop, and ultra-wide viewports without visual compromise or horizontal shifts.',
    points: ['Custom mobile-first layouts', 'Touch-optimized interactions', 'Adaptive typography scales'],
  },
  {
    title: 'Performance',
    icon: Zap,
    description:
      'We treat speed as a foundational design feature. Fast-loading pages protect brand reputation, enhance SEO visibility, and drastically reduce user bounce rates.',
    points: ['Server-side rendering & static generation', 'Aggressive media optimization', 'Sub-second critical render paths'],
  },
  {
    title: 'Scalability',
    icon: TrendingUp,
    description:
      'Our solutions are structured for long-term growth. As your organization expands its product line or traffic, our modular codebase adapts without requiring rewrites.',
    points: ['Component-driven architecture', 'Modular database modeling', 'Stateless cloud edge readiness'],
  },
  {
    title: 'User Experience',
    icon: HeartHandshake,
    description:
      'We prioritize clarity, usability, and intuitive interaction hierarchy, ensuring that every user journey from landing to conversion is natural and frictionless.',
    points: ['Logical information architecture', 'High-contrast readable typography', 'Accessible semantic patterns'],
  },
  {
    title: 'Long-Term Support',
    icon: LifeBuoy,
    description:
      'Launch is just the initial milestone. TSTACK WEB provides ongoing technical stewardship, proactive maintenance, dependency upgrades, and evolutionary improvements.',
    points: ['Direct developer communication', 'Proactive security patching', 'Reliable turnaround commitments'],
  },
]

export default function WhyTStack() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-slate-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Engineering Foundations"
          title="WHY PARTNER WITH"
          highlight="TSTACK WEB"
          description="We uphold rigorous engineering benchmarks and transparent delivery standards designed to give our clients a lasting digital advantage."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="p-8 rounded-2xl glass-panel border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-blue-900/50 transition-all">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 space-y-2">
                  {pillar.points.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
