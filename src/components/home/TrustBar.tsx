import React from 'react'
import { ShieldCheck, CheckCircle2, Globe2, Clock } from 'lucide-react'

const CREDENTIALS = [
  {
    icon: Globe2,
    title: 'Cross-Border Delivery',
    description: 'Active technical delivery across USA, UK, Spain, and Asia.',
  },
  {
    icon: ShieldCheck,
    title: 'Escrow & Buyer Protection',
    description: '100% milestone-protected contracting via verified Fiverr profile.',
  },
  {
    icon: CheckCircle2,
    title: 'Production-Grade Standards',
    description: 'Clean, documented TypeScript and Python architectures built to last.',
  },
  {
    icon: Clock,
    title: 'Fast Iteration Cycles',
    description: 'Direct communication with the lead architect for rapid turnaround.',
  },
]

export default function TrustBar() {
  return (
    <section className="py-12 border-y border-slate-900 bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREDENTIALS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
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
