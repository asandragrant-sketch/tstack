import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Cpu,
  Bot,
  Layout,
  Code2,
  Database,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  Workflow
} from 'lucide-react'
import { FIVERR_URL, CONTACT_EMAILS } from '@/types/contact'

export const metadata: Metadata = {
  title: 'Services & Capabilities | TSTACK AI & Digital Solutions',
  description:
    'Comprehensive engineering capabilities: AI workflow automation, autonomous AI agents, full-stack Next.js web applications, and enterprise digital solutions.',
  alternates: {
    canonical: 'https://tstackweb.com/services',
  },
}

const SERVICE_CATEGORIES = [
  {
    category: 'AI Automation & Workflows',
    id: 'ai-automation',
    icon: Cpu,
    tagline: 'Eliminate repetitive manual tasks and connect siloed business tools.',
    services: [
      {
        title: 'Event-Driven Workflow Automation',
        description:
          'Connect your CRMs, forms, accounting software, and internal databases with custom automated pipelines that trigger instant actions with zero human delay.',
        deliverables: [
          'Webhook & REST API integrations',
          'Automated data transformation & sync',
          'Failure alerting & retry resilience',
        ],
      },
      {
        title: 'CRM & Lead Routing Pipelines',
        description:
          'Automatically qualify incoming leads, normalize customer data, enrich records, and route actionable opportunities to team members in real time.',
        deliverables: [
          'HubSpot, Salesforce & Airtable sync',
          'Instant notification dispatches',
          'Automated follow-up scheduling',
        ],
      },
      {
        title: 'Document & Data Processing Pipelines',
        description:
          'Extract structured data from invoices, contracts, receipts, and emails directly into your backend databases without manual copy-paste errors.',
        deliverables: [
          'Document OCR & schema extraction',
          'Automated invoice reconciliation',
          'CSV / PDF batch processing engines',
        ],
      },
    ],
  },
  {
    category: 'AI Agents & Intelligent Assistants',
    id: 'ai-agents',
    icon: Bot,
    tagline: 'Deploy autonomous agents trained on your business rules and private data.',
    services: [
      {
        title: 'Private Knowledge Retrieval Agents (RAG)',
        description:
          'Custom AI agents trained strictly on your company documentation, SOPs, and knowledge repositories to provide accurate answers to employees or customers.',
        deliverables: [
          'Vector database indexing (Pinecone / pgvector)',
          'Strict hallucination-prevention guardrails',
          'Audit trail & query monitoring',
        ],
      },
      {
        title: 'Autonomous Customer Support Agents',
        description:
          'Tier-1 support assistants that resolve common inquiries, verify order statuses, and handle complex requests while escalating sensitive tickets gracefully.',
        deliverables: [
          'Multi-channel web & chat integration',
          'Sub-second contextual response latency',
          'Seamless human hand-off protocols',
        ],
      },
      {
        title: 'Lead Qualification & Intake Agents',
        description:
          'Interactive conversational assistants that interview prospective clients, gather project constraints, and book qualified meetings on your calendar.',
        deliverables: [
          'Custom intake logic & questionnaires',
          'Calendar & booking system sync',
          'Structured lead summary generation',
        ],
      },
    ],
  },
  {
    category: 'Web & Business Solutions',
    id: 'web-solutions',
    icon: Layout,
    tagline: 'High-speed, scalable web applications and bespoke client portals.',
    services: [
      {
        title: 'Full-Stack Web Applications',
        description:
          'Production-grade web applications engineered with Next.js 14, React, and TypeScript. Built for maximum speed, security, and long-term maintainability.',
        deliverables: [
          'Server-Side Rendering (SSR) & Edge API routes',
          'Relational database architecture (Postgres / Supabase)',
          'Clean, maintainable component libraries',
        ],
      },
      {
        title: 'Client Management Portals & Dashboards',
        description:
          'Bespoke client-facing platforms featuring role-based authentication, real-time analytics, encrypted document management, and billing dashboards.',
        deliverables: [
          'Role-based access control (RBAC)',
          'Interactive analytics & chart reporting',
          'Secure file upload & document storage',
        ],
      },
      {
        title: 'Modern Business Websites',
        description:
          'Fast, elegant business websites designed to clearly communicate your value proposition, build credibility, and convert visitors into paying clients.',
        deliverables: [
          '100/100 Core Web Vitals target',
          'Responsive design for all viewports',
          'Complete SEO & OpenGraph setup',
        ],
      },
    ],
  },
  {
    category: 'Maintenance & Performance Tuning',
    id: 'maintenance',
    icon: Zap,
    tagline: 'Keep your digital infrastructure fast, secure, and always accessible.',
    services: [
      {
        title: 'Core Web Vitals & Speed Optimization',
        description:
          'Comprehensive performance audits and code refactoring to minimize latency, reduce bundle sizes, and achieve top Google search rankings.',
        deliverables: [
          'Sub-second Largest Contentful Paint (LCP)',
          'Image compression & font optimization',
          'Cache policy & CDN configuration',
        ],
      },
      {
        title: 'Ongoing System Monitoring & Support',
        description:
          'Proactive technical support to monitor automated workflows, maintain external API dependencies, and patch vulnerabilities.',
        deliverables: [
          'Continuous uptime & webhook monitoring',
          'Dependency security updates',
          'Direct developer SLA response',
        ],
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen text-slate-300">
      {/* Services Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800">
              <span>CAPABILITIES &amp; SERVICES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Engineering services built for operational scale.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              From autonomous AI pipelines to custom web platforms, we build and deploy dependable systems tailored to your specific business requirements.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium transition-colors shadow-sm"
              >
                <span>Order via Fiverr</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
              >
                Request Custom Scope
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categorized Services Breakdown */}
      <div className="py-16 sm:py-24 space-y-20 max-w-6xl mx-auto px-4 sm:px-6">
        {SERVICE_CATEGORIES.map((cat, catIdx) => {
          const CategoryIcon = cat.icon
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-24 space-y-8">
              {/* Category Header */}
              <div className="pb-4 border-b border-slate-900 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      {cat.category}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {cat.tagline}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  0{catIdx + 1} / 04
                </span>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cat.services.map((item) => (
                  <div
                    key={item.title}
                    className="pro-card pro-card-hover p-6 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-5">
                        {item.description}
                      </p>

                      <div className="space-y-2 pt-3 border-t border-slate-800/80 mb-5">
                        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                          Included Deliverables:
                        </span>
                        {item.deliverables.map((d) => (
                          <div key={d} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-xs border-t border-slate-800/60">
                      <Link
                        href={`/contact?service=${encodeURIComponent(item.title)}`}
                        className="text-slate-300 hover:text-white font-medium transition-colors"
                      >
                        Request Quote →
                      </Link>
                      <a
                        href={FIVERR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1dbf73] hover:text-emerald-300 font-medium inline-flex items-center gap-0.5"
                      >
                        <span>Fiverr</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* End Consultation Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/70 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Have a custom requirement or existing stack?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            We adapt to your team’s existing tools, APIs, and business rules. Review your scope directly with our engineering leads.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium transition-colors"
            >
              Order on Fiverr (Escrow Protected) ↗
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
            >
              Send an Inquiry
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500 font-sans">Direct Contacts:</span>
            {CONTACT_EMAILS.map((email, idx) => (
              <React.Fragment key={email}>
                {idx > 0 && <span className="text-slate-700 hidden sm:inline">•</span>}
                <a href={`mailto:${email}`} className="hover:text-slate-200 transition-colors">
                  {email}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
