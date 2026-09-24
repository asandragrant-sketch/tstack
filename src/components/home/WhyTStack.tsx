import React from 'react'
import { Target, ShieldCheck, Users, Lock } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'

const REASONS = [
  {
    icon: Target,
    title: 'Business-First Engineering',
    description:
      'We do not build tech for tech’s sake. Every automation pipeline and software module is scoped around clear operational ROI—reducing manual hours, preventing costly errors, or increasing conversion.',
  },
  {
    icon: ShieldCheck,
    title: 'Production-Grade Reliability',
    description:
      'We write clean, strictly typed, and thoroughly tested code. Our automated systems feature proactive error-handling, webhook validation, and automated retries so you never lose critical customer data.',
  },
  {
    icon: Users,
    title: 'Direct Technical Access',
    description:
      'You communicate directly with senior technical architects (David Alison & Daniel Jacob). No junior hand-offs, no account-manager layers, and no miscommunicated project requirements.',
  },
  {
    icon: Lock,
    title: 'Safe Milestone & Escrow Delivery',
    description:
      'Every project can be contracted safely through our verified Fiverr profile. Your budget remains protected in escrow until you have reviewed, tested, and approved each project milestone.',
  },
]

export default function WhyTStack() {
  return (
    <section className="py-20 sm:py-28 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Why TSTACK"
          title="Direct engineering."
          highlight="No agency fluff."
          description="We take a transparent, engineering-driven approach to solving business problems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {REASONS.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="pro-card p-6 sm:p-8 flex items-start gap-5"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-500 mb-1">
                    0{index + 1}. PRINCIPLE
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
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
