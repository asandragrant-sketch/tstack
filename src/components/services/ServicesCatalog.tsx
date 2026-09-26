'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  X,
  Cpu,
  Bot,
  Layout,
  Zap,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import {
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL,
} from '@/types/contact'

interface ServiceItem {
  id: string
  categoryId: string
  categoryName: string
  title: string
  description: string
  deliverables: string[]
  tags: string[]
  fiverrUrl: string
  gigLabel: string
}

const ALL_SERVICES: ServiceItem[] = [
  // Category 1: AI Automation & Workflows
  {
    id: 'event-automation',
    categoryId: 'ai-automation',
    categoryName: 'AI Automation & Workflows',
    title: 'Event-Driven Workflow Automation',
    description:
      'Connect your CRMs, forms, accounting software, and internal databases with custom automated pipelines that trigger instant actions with zero human delay.',
    deliverables: [
      'Webhook & REST API integrations',
      'Automated data transformation & sync',
      'Failure alerting & retry resilience',
    ],
    tags: ['Webhooks', 'REST API', 'Postgres', 'Retries', 'Automation'],
    fiverrUrl: FIVERR_GIG_AUTOMATION_URL,
    gigLabel: 'Automation Gig',
  },
  {
    id: 'crm-routing',
    categoryId: 'ai-automation',
    categoryName: 'AI Automation & Workflows',
    title: 'CRM & Lead Routing Pipelines',
    description:
      'Automatically qualify incoming leads, normalize customer data, enrich records, and route actionable opportunities to team members in real time.',
    deliverables: [
      'HubSpot, Salesforce & Airtable sync',
      'Instant notification dispatches',
      'Automated follow-up scheduling',
    ],
    tags: ['CRM Sync', 'HubSpot', 'Salesforce', 'Airtable', 'Slack Alerting'],
    fiverrUrl: FIVERR_GIG_AUTOMATION_URL,
    gigLabel: 'Automation Gig',
  },
  {
    id: 'document-processing',
    categoryId: 'ai-automation',
    categoryName: 'AI Automation & Workflows',
    title: 'Document & Data Processing Pipelines',
    description:
      'Extract structured data from invoices, contracts, receipts, and emails directly into your backend databases without manual copy-paste errors.',
    deliverables: [
      'Document OCR & schema extraction',
      'Automated invoice reconciliation',
      'CSV / PDF batch processing engines',
    ],
    tags: ['OCR', 'PDF Parser', 'Data Extraction', 'Schema Validation'],
    fiverrUrl: FIVERR_GIG_AUTOMATION_URL,
    gigLabel: 'Automation Gig',
  },

  // Category 2: AI Agents & Assistants
  {
    id: 'rag-agents',
    categoryId: 'ai-agents',
    categoryName: 'AI Agents & Intelligent Assistants',
    title: 'Private Knowledge Retrieval Agents (RAG)',
    description:
      'Custom AI agents trained strictly on your company documentation, SOPs, and knowledge repositories to provide accurate answers to employees or customers.',
    deliverables: [
      'Vector database indexing (Pinecone / pgvector)',
      'Strict hallucination-prevention guardrails',
      'Audit trail & query monitoring',
    ],
    tags: ['RAG', 'Vector DB', 'Pinecone', 'LangChain', 'Guardrails'],
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigLabel: 'Agents Gig',
  },
  {
    id: 'support-agents',
    categoryId: 'ai-agents',
    categoryName: 'AI Agents & Intelligent Assistants',
    title: 'Autonomous Customer Support Agents',
    description:
      'Tier-1 support assistants that resolve common inquiries, verify order statuses, and handle complex requests while escalating sensitive tickets gracefully.',
    deliverables: [
      'Multi-channel web & chat integration',
      'Sub-second contextual response latency',
      'Seamless human hand-off protocols',
    ],
    tags: ['Customer Support', 'Chat Widget', 'Escalation Protocol', 'Fast SLA'],
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigLabel: 'Agents Gig',
  },
  {
    id: 'intake-agents',
    categoryId: 'ai-agents',
    categoryName: 'AI Agents & Intelligent Assistants',
    title: 'Lead Qualification & Intake Agents',
    description:
      'Interactive conversational assistants that interview prospective clients, gather project constraints, and book qualified meetings on your calendar.',
    deliverables: [
      'Custom intake logic & questionnaires',
      'Calendar & booking system sync',
      'Structured lead summary generation',
    ],
    tags: ['Lead Qualification', 'Calendar Booking', 'Conversational AI'],
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigLabel: 'Agents Gig',
  },

  // Category 3: Web & Business Solutions
  {
    id: 'fullstack-web',
    categoryId: 'web-solutions',
    categoryName: 'Web & Business Solutions',
    title: 'Full-Stack Web Applications',
    description:
      'Production-grade web applications engineered with Next.js 14, React, and TypeScript. Built for maximum speed, security, and long-term maintainability.',
    deliverables: [
      'Server-Side Rendering (SSR) & Edge API routes',
      'Relational database architecture (Postgres / Supabase)',
      'Clean, maintainable component libraries',
    ],
    tags: ['Next.js 14', 'TypeScript', 'React', 'Supabase', 'PostgreSQL'],
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigLabel: 'Web Gig',
  },
  {
    id: 'client-portals',
    categoryId: 'web-solutions',
    categoryName: 'Web & Business Solutions',
    title: 'Client Management Portals & Dashboards',
    description:
      'Bespoke client-facing platforms featuring role-based authentication, real-time analytics, encrypted document management, and billing dashboards.',
    deliverables: [
      'Role-based access control (RBAC)',
      'Interactive analytics & chart reporting',
      'Secure file upload & document storage',
    ],
    tags: ['Client Portal', 'RBAC', 'Dashboard', 'Invoicing', 'Analytics'],
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigLabel: 'Web Gig',
  },
  {
    id: 'business-websites',
    categoryId: 'web-solutions',
    categoryName: 'Web & Business Solutions',
    title: 'Modern Business Websites',
    description:
      'Fast, elegant business websites designed to clearly communicate your value proposition, build credibility, and convert visitors into paying clients.',
    deliverables: [
      '100/100 Core Web Vitals target',
      'Responsive design for all viewports',
      'Complete SEO & OpenGraph setup',
    ],
    tags: ['Web Design', 'Core Web Vitals', 'Responsive', 'SEO Schema'],
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    gigLabel: 'Web Gig',
  },

  // Category 4: Maintenance & Tuning
  {
    id: 'performance-tuning',
    categoryId: 'maintenance',
    categoryName: 'Maintenance & Performance Tuning',
    title: 'Core Web Vitals & Speed Optimization',
    description:
      'Comprehensive performance audits and code refactoring to minimize latency, reduce bundle sizes, and achieve top Google search rankings.',
    deliverables: [
      'Sub-second Largest Contentful Paint (LCP)',
      'Image compression & font optimization',
      'Cache policy & CDN configuration',
    ],
    tags: ['Performance', 'LCP', 'Speed', 'CDN', 'Bundle Reduction'],
    fiverrUrl: FIVERR_URL,
    gigLabel: 'Fiverr Pro',
  },
  {
    id: 'system-support',
    categoryId: 'maintenance',
    categoryName: 'Maintenance & Performance Tuning',
    title: 'Ongoing System Monitoring & Support',
    description:
      'Proactive technical support to monitor automated workflows, maintain external API dependencies, and patch vulnerabilities.',
    deliverables: [
      'Continuous uptime & webhook monitoring',
      'Dependency security updates',
      'Direct developer SLA response',
    ],
    tags: ['Support', 'Uptime SLA', 'API Health', 'Security Patches'],
    fiverrUrl: FIVERR_URL,
    gigLabel: 'Fiverr Pro',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Capabilities', icon: Layout },
  { id: 'ai-automation', label: 'AI Automation', icon: Cpu },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot },
  { id: 'web-solutions', label: 'Web & SaaS', icon: Layout },
  { id: 'maintenance', label: 'Performance', icon: Zap },
]

export default function ServicesCatalog() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery)
    if (initialCategory) setActiveCategory(initialCategory)
  }, [initialQuery, initialCategory])

  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.categoryId === activeCategory

      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCategory

      const matchesText =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.deliverables.some((d) => d.toLowerCase().includes(query))

      return matchesCategory && matchesText
    })
  }, [searchQuery, activeCategory])

  const resetFilters = () => {
    setSearchQuery('')
    setActiveCategory('all')
  }

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capabilities (e.g., webhook, RAG agent, client portal, Postgres, CRM)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="p-1 rounded text-slate-500 hover:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0 self-end sm:self-auto">
            <span>
              Showing <strong className="text-white">{filteredServices.length}</strong> of{' '}
              {ALL_SERVICES.length} services
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id
            const Icon = cat.icon
            const count =
              cat.id === 'all'
                ? ALL_SERVICES.length
                : ALL_SERVICES.filter((s) => s.categoryId === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Services Grid or Empty State */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              No matching capabilities found
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No services matched &quot;{searchQuery}&quot;. We frequently engineer bespoke solutions tailored to custom architectures.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              Reset Filters
            </button>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              Request Custom Scope
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="pro-card pro-card-hover p-6 flex flex-col justify-between scroll-mt-28"
            >
              <div>
                {/* Header Tag & Gig Badge */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-mono text-blue-400 font-medium text-[11px]">
                    {item.categoryName}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    Escrow Protected
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2 pt-3 border-t border-slate-850 mb-5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Core Deliverables:
                  </span>
                  {item.deliverables.map((d) => (
                    <div key={d} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pb-4">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-850"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3.5 border-t border-slate-850 flex items-center justify-between text-xs">
                <Link
                  href={`/contact?service=${encodeURIComponent(item.title)}`}
                  className="text-slate-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href={item.fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1dbf73] hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                >
                  <span>{item.gigLabel}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
