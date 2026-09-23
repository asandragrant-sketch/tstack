import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Layers, ExternalLink } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'

const CONCEPTS = [
  {
    title: 'Aura Enterprise Platform',
    category: 'Corporate Website',
    description: 'High-end international corporate portal designed for an infrastructure technology enterprise with interactive data rooms and investor hubs.',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Architecture'],
    deliverable: 'Multi-Region Corporate Website',
    gradient: 'from-blue-600/30 to-indigo-900/40',
    stat: 'Sub-400ms Load Time',
  },
  {
    title: 'Vanguard Lux Commerce',
    category: 'E-commerce',
    description: 'Bespoke headless e-commerce store engineered for ultra-fast checkout, real-time inventory synchronization, and multi-currency billing.',
    stack: ['React', 'Headless Storefront', 'Stripe API', 'Edge Middleware'],
    deliverable: 'Global E-Commerce Architecture',
    gradient: 'from-cyan-600/30 to-blue-900/40',
    stat: 'Optimized Mobile Funnel',
  },
  {
    title: 'PulseMetrics Cloud',
    category: 'SaaS Dashboard',
    description: 'Real-time telemetry and operational metrics platform with dark-mode analytics, high-density data tables, and live WebSocket charts.',
    stack: ['Next.js App Router', 'TypeScript', 'Tailwind', 'Realtime WebSockets'],
    deliverable: 'Interactive SaaS Dashboard',
    gradient: 'from-emerald-600/30 to-slate-900/60',
    stat: '99.9% Uptime Telemetry',
  },
  {
    title: 'Nexus Capital Advisory',
    category: 'Business Website',
    description: 'Prestigious digital representation for a boutique cross-border advisory firm with client onboarding flows and confidential inquiry routing.',
    stack: ['Next.js', 'React', 'TypeScript', 'Accessible ARIA'],
    deliverable: 'Premium Advisory Web Asset',
    gradient: 'from-indigo-600/30 to-purple-900/40',
    stat: 'WCAG AAA Accessibility',
  },
  {
    title: 'Chronos Distributed Hub',
    category: 'Web Application',
    description: 'Complex enterprise web application providing multi-tenant workflow orchestration, permission matrices, and audit logging.',
    stack: ['React 18', 'TypeScript', 'REST & GraphQL', 'PostgreSQL Schema'],
    deliverable: 'Enterprise Web Application',
    gradient: 'from-purple-600/30 to-blue-900/40',
    stat: 'Enterprise RBAC Suite',
  },
  {
    title: 'Vertex Studio Showcase',
    category: 'Portfolio Website',
    description: 'Avant-garde creative agency portfolio with cinematic transitions, smooth scroll parallax, and dynamic project case studies.',
    stack: ['Next.js', 'Custom Keyframes', 'Tailwind CSS', 'Micro-interactions'],
    deliverable: 'High-Impact Portfolio Experience',
    gradient: 'from-blue-700/30 to-cyan-900/40',
    stat: '100/100 Lighthouse Score',
  },
]

export default function SelectedConcepts() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Featured Concepts"
          title="SELECTED ARCHITECTURAL"
          highlight="CONCEPTS"
          description="A curated demonstration of our design sophistication, frontend engineering rigor, and structural digital capabilities across key commercial categories."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONCEPTS.map((concept, idx) => (
            <div
              key={concept.title}
              className="group relative rounded-2xl glass-panel border border-slate-800/90 hover:border-cyan-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Concept Visual Header Mockup */}
              <div
                className={`h-48 w-full bg-gradient-to-br ${concept.gradient} p-6 flex flex-col justify-between relative overflow-hidden border-b border-slate-800/80`}
              >
                {/* Visual Grid Lines */}
                <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-black/50 border border-white/10 text-cyan-300 backdrop-blur-sm">
                    {concept.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-white/80 group-hover:text-cyan-300 group-hover:scale-110 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="z-10">
                  <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                    {concept.stat}
                  </div>
                  <h3 className="text-xl font-black text-white font-display tracking-tight group-hover:text-blue-200 transition-colors">
                    {concept.title}
                  </h3>
                </div>
              </div>

              {/* Body Description & Tech Badges */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {concept.description}
                </p>

                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                    Technology &amp; Architecture
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {concept.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    CONCEPT 0{idx + 1}
                  </span>
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-blue-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Commission Similar Build</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
