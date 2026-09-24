import React from 'react'
import Link from 'next/link'
import { Cpu, Bot, Layout, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { FIVERR_GIG_AUTOMATION_URL, FIVERR_GIG_AGENTS_WEB_URL } from '@/types/contact'

const FEATURED_SERVICES = [
  {
    id: 'ai-automation',
    icon: Cpu,
    title: 'AI Automation & Workflows',
    description:
      'Connect fragmented business tools and eliminate repetitive manual data entry with custom automated pipelines that operate 24/7 with zero human intervention.',
    deliverables: [
      'Webhook & API pipeline integration',
      'Automated CRM sync & lead routing',
      'Document processing & data extraction',
    ],
    href: '/services#ai-automation',
    fiverrUrl: FIVERR_GIG_AUTOMATION_URL,
    gigBadge: 'AI Automation Gig',
  },
  {
    id: 'ai-agents',
    icon: Bot,
    title: 'AI Agents & Assistants',
    description:
      'Deploy custom-trained autonomous agents tailored to your business knowledge. Handle customer support, qualify leads, and perform multi-step internal operations safely.',
    deliverables: [
      'Private RAG knowledge base retrieval',
      'Autonomous lead qualification bots',
      'Multi-channel customer inquiry agents',
    ],
    href: '/services#ai-agents',
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigBadge: 'AI Agents Gig',
  },
  {
    id: 'web-solutions',
    icon: Layout,
    title: 'Web & Business Solutions',
    description:
      'Production-grade web applications, client portals, and bespoke business platforms built with modern TypeScript and Next.js for maximum performance, security, and scalability.',
    deliverables: [
      'Custom Next.js & React web platforms',
      'Role-based client management portals',
      'Fast, accessible conversion architecture',
    ],
    href: '/services#web-solutions',
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigBadge: 'Web Solutions Gig',
  },
]

export default function FeaturedServices() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Core Services"
          title="Engineered for efficiency."
          highlight="Built for real business outcomes."
          description="We focus on the three highest-leverage areas where modern technology provides measurable operational advantages."
        />

        {/* 3 Services Cards Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURED_SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="pro-card pro-card-hover p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Fiverr Gig
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-800/80 mb-6">
                    {service.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 font-medium text-slate-300 hover:text-white transition-colors group"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={service.fiverrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#1dbf73] hover:text-emerald-300 transition-colors"
                  >
                    <span>Order Gig</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Clear View All Services Link */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white text-sm font-medium border border-slate-800 transition-colors shadow-sm"
          >
            <span>View All Services &amp; Capabilities</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </section>
  )
}
