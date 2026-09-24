import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { FIVERR_URL } from '@/types/contact'

const CASE_STUDIES = [
  {
    category: 'AI Automation',
    title: 'Automated Operations & Invoicing Pipeline',
    clientType: 'Logistics & Supply Chain Client',
    description:
      'Engineered an end-to-end event-driven architecture connecting e-commerce orders, accounting systems, and warehouse dispatch without human intervention.',
    metrics: 'Reduced manual administrative overhead by ~85%',
    tags: ['Webhook Integration', 'Node.js', 'PostgreSQL', 'Automated QA'],
  },
  {
    category: 'AI Agents',
    title: 'Context-Aware Technical Support Agent',
    clientType: 'B2B Software & Professional Services',
    description:
      'Developed a custom autonomous agent trained on proprietary knowledge bases to qualify inbound prospects and resolve technical customer inquiries 24/7.',
    metrics: '68% autonomous resolution rate with <1.5s latency',
    tags: ['Custom LLM', 'Vector Retrieval', 'Python', 'CRM Sync'],
  },
  {
    category: 'Web Solutions',
    title: 'Enterprise Client Operations Portal',
    clientType: 'Global Advisory & Consultancy',
    description:
      'Architected a high-security, responsive client management portal with encrypted document vaults, milestone progress trackers, and real-time project reporting.',
    metrics: 'Sub-second Core Web Vitals across mobile and desktop',
    tags: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Role-Based Auth'],
  },
]

export default function FeaturedWork() {
  return (
    <section id="work" className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Selected Work"
          title="Practical systems."
          highlight="Engineered for real operational scale."
          description="A selection of recent automation pipelines, custom AI tools, and production web applications built for business clients."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CASE_STUDIES.map((item) => (
            <div
              key={item.title}
              className="pro-card pro-card-hover p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="text-blue-400 font-semibold">{item.category}</span>
                  <span>{item.clientType}</span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white mb-2.5 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                  {item.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono mb-5">
                  <span className="text-emerald-400 font-medium">Outcome:</span> {item.metrics}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action strip */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 mb-4">
            Need a similar custom pipeline or platform for your business?
          </p>
          <a
            href={FIVERR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Discuss your custom scope on Fiverr</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
