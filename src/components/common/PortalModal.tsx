'use client'

import React, { useEffect, useRef } from 'react'
import { X, ArrowUpRight, ShieldCheck, Lock, FolderKanban, MessageSquareCode, FileText } from 'lucide-react'

interface PortalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PortalModal({ isOpen, onClose }: PortalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close portal modal"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium text-blue-400 bg-blue-950/40 border border-blue-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>CLIENT APPLICATION &amp; DASHBOARD</span>
          </div>
          <h2 id="portal-modal-title" className="text-xl font-semibold text-white tracking-tight">
            TSTACK Client Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The dedicated web application where active clients track project milestones, inspect code deliverables, and communicate directly with lead architects.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
              <span>Milestone Gated Sprints</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Track real-time progress on architecture, development, and QA testing gates.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Milestone Escrow &amp; Billing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Funds locked in escrow until milestone deliverables are tested and approved.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <MessageSquareCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Direct Architect Chat</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Direct access to David Alison, Daniel Kylan Jacob, and Baron with zero intermediary layers.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Invoices &amp; SLA Documents</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Instant PDF invoices, master engineering agreements, and code repository keys.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>Launch Client Portal WebApp</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 font-mono">
            <span>Authentication: Email / Password</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              256-bit TLS Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
