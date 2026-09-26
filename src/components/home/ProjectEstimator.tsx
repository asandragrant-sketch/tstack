'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calculator,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { FIVERR_URL, FIVERR_GIG_AUTOMATION_URL, FIVERR_GIG_AGENTS_WEB_URL } from '@/types/contact'

interface ServiceTrack {
  id: string
  name: string
  category: string
  baseDays: number
  lead: string
  fiverrUrl: string
  description: string
}

const SERVICE_TRACKS: ServiceTrack[] = [
  {
    id: 'ai-automation',
    name: 'AI Workflow & Event Automation',
    category: 'Automation',
    baseDays: 5,
    lead: 'David Alison (AI Architecture)',
    fiverrUrl: FIVERR_GIG_AUTOMATION_URL,
    description: 'Connect disparate apps, automate CRM routing, and process documents 24/7.',
  },
  {
    id: 'ai-agents',
    name: 'Autonomous Agent / Private RAG',
    category: 'Agents',
    baseDays: 8,
    lead: 'Daniel Kylan Jacob (Lead Architect)',
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    description: 'Custom-trained AI agents indexing your company documents with zero hallucinations.',
  },
  {
    id: 'web-platform',
    name: 'Full-Stack Web App & Portal',
    category: 'Web Solutions',
    baseDays: 12,
    lead: 'Daniel Kylan Jacob & Baron',
    fiverrUrl: FIVERR_GIG_AGENTS_WEB_URL,
    description: 'Production Next.js 14 web applications, client dashboards, and secure auth.',
  },
  {
    id: 'perf-optimization',
    name: 'Speed & Infrastructure Tuning',
    category: 'Optimization',
    baseDays: 4,
    lead: 'David Alison (Technical Solutions)',
    fiverrUrl: FIVERR_URL,
    description: 'Sub-second Core Web Vitals, API latency reduction, and reliability audits.',
  },
]

interface AddonModule {
  id: string
  label: string
  extraDays: number
  category: string
}

const ADDON_MODULES: AddonModule[] = [
  { id: 'crm-sync', label: 'CRM / Database 2-Way Sync (HubSpot, Postgres)', extraDays: 2, category: 'Integration' },
  { id: 'rag-vector', label: 'Vector Database Indexing (Pinecone / pgvector)', extraDays: 3, category: 'Intelligence' },
  { id: 'rbac-auth', label: 'Role-Based Authentication & Permissions', extraDays: 2, category: 'Security' },
  { id: 'billing-escrow', label: 'Automated Invoice & Escrow Checkout', extraDays: 2, category: 'Commerce' },
  { id: 'retry-resilience', label: 'Automated Webhook Retry & Error Queue', extraDays: 1, category: 'Resilience' },
  { id: 'sla-monitoring', label: '24/7 Uptime & Anomaly Health Alerting', extraDays: 1, category: 'Operations' },
]

export default function ProjectEstimator() {
  const [selectedTrack, setSelectedTrack] = useState<string>('ai-automation')
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['crm-sync', 'retry-resilience'])

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const activeTrack = useMemo(() => {
    return SERVICE_TRACKS.find((t) => t.id === selectedTrack) || SERVICE_TRACKS[0]
  }, [selectedTrack])

  const calculation = useMemo(() => {
    const totalDays =
      activeTrack.baseDays +
      selectedAddons.reduce((acc, addonId) => {
        const addon = ADDON_MODULES.find((m) => m.id === addonId)
        return acc + (addon ? addon.extraDays : 0)
      }, 0)

    const estimatedSprintWeeks = Math.ceil(totalDays / 5)

    return {
      daysMin: totalDays,
      daysMax: totalDays + 3,
      weeks: estimatedSprintWeeks,
      milestonesCount: 3 + Math.floor(selectedAddons.length / 2),
    }
  }, [activeTrack, selectedAddons])

  // Generate pre-filled contact URL
  const contactUrl = useMemo(() => {
    const addonNames = selectedAddons
      .map((id) => ADDON_MODULES.find((m) => m.id === id)?.label)
      .filter(Boolean)
      .join(', ')

    const params = new URLSearchParams({
      service: activeTrack.name,
      timeline: `${calculation.daysMin}–${calculation.daysMax} Business Days`,
      modules: addonNames,
    })

    return `/contact?${params.toString()}`
  }, [activeTrack, calculation, selectedAddons])

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Interactive Estimator"
          title="Configure your project scope."
          highlight="Get an instant delivery breakdown."
          description="Select your core requirements to view estimated sprint durations, key architecture milestones, and assigned lead architects."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scope Configurator */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Core Track */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Step 1: Select Primary Engineering Track</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_TRACKS.map((track) => {
                  const isSelected = selectedTrack === track.id
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrack(track.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-950/30 border-blue-500/80 ring-1 ring-blue-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-white">
                          {track.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {track.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Add-on Capabilities */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Step 2: Add Modules &amp; Integrations</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedAddons.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADDON_MODULES.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id)
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-lg border text-left flex items-start justify-between gap-2 transition-colors ${
                        isChecked
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium block leading-snug">
                          {addon.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          +{addon.extraDays} days • {addon.category}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                          isChecked
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Scope & Milestone Breakdown */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="pro-card p-6 sm:p-7 shadow-xl space-y-6">
              {/* Scope Header */}
              <div className="border-b border-slate-800 pb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    ESTIMATED SPRINT METRICS
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                    Escrow Protected
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  {activeTrack.name}
                </h3>
              </div>

              {/* Estimated Duration & Milestones Pill Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Est. Turnaround</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {calculation.daysMin}–{calculation.daysMax}{' '}
                    <span className="text-xs font-medium text-slate-400">days</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    ~{calculation.weeks} sprint weeks
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Review Gates</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {calculation.milestonesCount}{' '}
                    <span className="text-xs font-medium text-slate-400">milestones</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    100% verified testing
                  </span>
                </div>
              </div>

              {/* Delivery Lead Assignment */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-1 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Assigned Architecture Lead:
                </span>
                <span className="text-slate-200 font-medium block">
                  {activeTrack.lead}
                </span>
              </div>

              {/* Selected Modules Summary */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Scope Inclusions ({selectedAddons.length + 1} items):
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Core architecture: {activeTrack.name}</span>
                  </div>
                  {selectedAddons.map((id) => {
                    const addon = ADDON_MODULES.find((m) => m.id === id)
                    if (!addon) return null
                    return (
                      <div key={id} className="flex items-center gap-2 text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{addon.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href={contactUrl}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
                >
                  <span>Transfer Scope to Project Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={activeTrack.fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white text-xs font-medium border border-slate-800 transition-colors"
                >
                  <span>Order Directly via Fiverr Escrow</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
