'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Bot,
  Layout
} from 'lucide-react'
import { FIVERR_URL, FIVERR_GIG_AUTOMATION_URL, FIVERR_GIG_AGENTS_WEB_URL } from '@/types/contact'

interface ArchPipeline {
  id: string
  title: string
  icon: any
  tag: string
  steps: {
    stage: string
    title: string
    description: string
    metaLabel: string
    metaValue: string
  }[]
  telemetry: {
    label: string
    value: string
  }[]
  stack: string
}

const ARCH_PIPELINES: ArchPipeline[] = [
  {
    id: 'automation',
    title: 'AI Workflow Pipeline',
    icon: Cpu,
    tag: 'Event Driven',
    steps: [
      {
        stage: '01. INGESTION',
        title: 'Webhook & Event Listener',
        description: 'Real-time payload ingestion from CRMs, forms, Stripe, and customer emails.',
        metaLabel: 'Latency',
        metaValue: '0.02s response',
      },
      {
        stage: '02. NORMALIZATION',
        title: 'Schema Validation & Queue',
        description: 'TypeScript schema enforcement, duplicate filtering, and automated dead-letter retries.',
        metaLabel: 'Reliability',
        metaValue: '99.98% delivery',
      },
      {
        stage: '03. EXECUTION',
        title: 'Multi-App Sync & Dispatch',
        description: 'Instant synchronization to PostgreSQL, HubSpot, Airtable, and automated alerts.',
        metaLabel: 'Outcome',
        metaValue: 'Zero manual entry',
      },
    ],
    telemetry: [
      { label: 'Uptime SLA', value: '99.98%' },
      { label: 'Avg Latency', value: '28ms' },
      { label: 'Data Loss Rate', value: '0.00%' },
    ],
    stack: 'Stack: Node.js • TypeScript • Webhook Queues • PostgreSQL • REST/GraphQL',
  },
  {
    id: 'agents',
    title: 'Autonomous RAG Agent',
    icon: Bot,
    tag: 'Intelligence',
    steps: [
      {
        stage: '01. INTAKE',
        title: 'Query Classification',
        description: 'Semantic intent parsing, user context identification, and session history assembly.',
        metaLabel: 'Vector search',
        metaValue: '<15ms retrieval',
      },
      {
        stage: '02. RETRIEVAL',
        title: 'Private Knowledge Base',
        description: 'Hybrid vector search against company SOPs, manuals, and databases with guardrails.',
        metaLabel: 'Guardrails',
        metaValue: 'Strict schema check',
      },
      {
        stage: '03. RESOLUTION',
        title: 'Action & Escalation',
        description: 'Direct response generation with citations, or seamless escalation to lead engineers.',
        metaLabel: 'Autonomous rate',
        metaValue: '68% instant fix',
      },
    ],
    telemetry: [
      { label: 'Hallucination Check', value: 'Strict 100%' },
      { label: 'Avg Turnaround', value: '1.2s' },
      { label: 'Context Length', value: '128k Tokens' },
    ],
    stack: 'Stack: Python • LangChain • Pinecone • OpenAI / Anthropic • Supabase',
  },
  {
    id: 'web',
    title: 'Full-Stack Web & Portal',
    icon: Layout,
    tag: 'Web Platform',
    steps: [
      {
        stage: '01. EDGE APP',
        title: 'Next.js 14 SSR Architecture',
        description: 'Server-side rendered React components, static caching, and sub-second Core Web Vitals.',
        metaLabel: 'Core Web Vitals',
        metaValue: '100/100 score',
      },
      {
        stage: '02. SECURITY',
        title: 'Role-Based Authentication',
        description: 'Strict session tokens, protected client dashboard routes, and encrypted document storage.',
        metaLabel: 'Security',
        metaValue: '256-bit TLS',
      },
      {
        stage: '03. MILESTONES',
        title: 'Escrow Gated Delivery',
        description: 'Clients test code in sandbox environments before approving milestones on Fiverr.',
        metaLabel: 'Escrow status',
        metaValue: '100% Protected',
      },
    ],
    telemetry: [
      { label: 'Page Load (LCP)', value: '0.4s' },
      { label: 'Auth Token TTL', value: 'Encrypted' },
      { label: 'Codebase Ownership', value: '100% Client' },
    ],
    stack: 'Stack: Next.js 14 • React 18 • TypeScript • Tailwind CSS • Vercel Edge',
  },
]

export default function Hero() {
  const [activeArchTab, setActiveArchTab] = useState<string>('automation')

  const currentArch =
    ARCH_PIPELINES.find((p) => p.id === activeArchTab) || ARCH_PIPELINES[0]

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>AI Automation • Custom Agents • Business Software</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.12] text-balance">
            We build practical AI automation, autonomous agents, and software for modern businesses.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto text-balance">
            TSTACK designs and deploys reliable automated workflows, custom AI assistants, and high-performance digital systems that eliminate repetitive operations and scale business capacity.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Order on Fiverr (Escrow Protected)</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-sm font-medium border border-slate-800 hover:border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Explore All Capabilities</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Direct Gig Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <span className="text-slate-500 font-mono">Verified Direct Gigs:</span>
            <a
              href={FIVERR_GIG_AUTOMATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              <span>AI Automation Gig</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a
              href={FIVERR_GIG_AGENTS_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              <span>AI Agents &amp; Web Gig</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            </a>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Verified Pro Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Milestone Escrow
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Direct Senior Developer Access
            </span>
          </div>
        </div>

        {/* Clean, Interactive Architecture Explorer Card */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
          <div className="pro-card p-6 sm:p-8 shadow-xl">
            {/* Window bar with tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
                <span className="font-mono text-slate-400 text-xs">
                  architecture_preview.config
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-850">
                {ARCH_PIPELINES.map((pipeline) => {
                  const isActive = activeArchTab === pipeline.id
                  const Icon = pipeline.icon
                  return (
                    <button
                      key={pipeline.id}
                      type="button"
                      onClick={() => setActiveArchTab(pipeline.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{pipeline.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Architecture Flow Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {currentArch.steps.map((step, idx) => (
                <div
                  key={step.stage}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                      {step.stage}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {step.title}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-850 flex items-center justify-between">
                    <span className="text-slate-500">{step.metaLabel}:</span>
                    <span className="text-slate-200 font-medium">{step.metaValue}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Telemetry Strip */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetry Live:</span>
                </div>
                {currentArch.telemetry.map((t) => (
                  <span key={t.label} className="hidden sm:inline">
                    {t.label}: <strong className="text-white font-medium">{t.value}</strong>
                  </span>
                ))}
              </div>

              <Link
                href="/services"
                className="text-blue-400 hover:text-blue-300 font-sans font-medium transition-colors inline-flex items-center gap-1"
              >
                <span>Full specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
