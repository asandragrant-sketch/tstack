import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import { Compass, FileSpreadsheet, Palette, Terminal, Rocket, CheckCircle } from 'lucide-react'

const PROCESS_STEPS = [
  {
    step: '01',
    name: 'DISCOVER',
    subtitle: 'Scope, Goals & Audience Analysis',
    description: 'We immerse ourselves in your commercial goals, target user personas, competitive market position, and specific functional requirements.',
    icon: Compass,
    deliverables: ['Stakeholder Discovery Interview', 'Technical Scope Document', 'Target Audience Profile'],
  },
  {
    step: '02',
    name: 'PLAN',
    subtitle: 'Architecture & Technical Direction',
    description: 'We map information architecture, select the optimal tech stack, structure databases, and chart a milestone-driven engineering schedule.',
    icon: FileSpreadsheet,
    deliverables: ['Information Architecture Map', 'Tech Stack Specification', 'Project Milestones Timeline'],
  },
  {
    step: '03',
    name: 'DESIGN',
    subtitle: 'Bespoke UI/UX & Interactive Prototypes',
    description: 'We create the visual experience, craft design system tokens, build responsive layouts, and validate clickable prototypes before code begins.',
    icon: Palette,
    deliverables: ['Figma Design System', 'High-Fidelity Interactive Prototypes', 'Asset & Icon Library'],
  },
  {
    step: '04',
    name: 'DEVELOP',
    subtitle: 'Clean Production Code & API Hookup',
    description: 'We turn the approved designs into a responsive, accessible, high-performance digital product with clean TypeScript, Next.js, and server integrations.',
    icon: Terminal,
    deliverables: ['Clean Production Repository', 'Complete API & Backend Integrations', 'Cross-Device QA & Testing'],
  },
  {
    step: '05',
    name: 'LAUNCH & GROW',
    subtitle: 'Deployment, Monitoring & Evolution',
    description: 'We deploy to edge infrastructure, monitor telemetry, verify SEO indexation, and provide ongoing technical maintenance to scale your reach.',
    icon: Rocket,
    deliverables: ['Zero-Downtime Edge Deployment', 'SEO Verification & Schema Validation', 'Ongoing Support & Maintenance'],
  },
]

export default function ProcessTimeline() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 tech-grid-pattern border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Structured Delivery"
          title="OUR 5-PHASE"
          highlight="ENGINEERING PROCESS"
          description="A transparent, milestone-driven workflow that transforms complex requirements into polished, dependable digital products."
        />

        <div className="relative mt-20">
          {/* Central Connecting Timeline Line on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-400/50 to-indigo-600/20 -translate-y-1/2 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="relative p-6 rounded-2xl glass-panel border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2"
                >
                  {/* Step Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white tracking-wider font-display mb-1">
                      {step.name}
                    </h3>
                    <div className="text-[11px] font-mono text-cyan-400 mb-3">
                      {step.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {step.description}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="pt-3 border-t border-slate-800/70 space-y-1.5">
                    {step.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                        <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
