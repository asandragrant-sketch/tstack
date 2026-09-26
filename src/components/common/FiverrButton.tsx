'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowUpRight, ChevronUp } from 'lucide-react'
import {
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL
} from '@/types/contact'

export default function FiverrButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <aside
      aria-label="Order on Fiverr"
      className="fixed bottom-5 left-5 z-30"
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Popover Menu with Specific Gigs */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-slate-900 border border-slate-800 p-2 shadow-2xl backdrop-blur-md animate-in fade-in duration-150">
          <div className="px-2.5 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Verified Gigs &amp; Escrow
          </div>

          <div className="space-y-1 mt-1">
            <a
              href={FIVERR_GIG_AUTOMATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 rounded-md hover:bg-slate-800 transition-colors group"
            >
              <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                <span>AI Automation Gig</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Pipelines, CRM sync &amp; automated workflows
              </div>
            </a>

            <a
              href={FIVERR_GIG_AGENTS_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 rounded-md hover:bg-slate-800 transition-colors group"
            >
              <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                <span>AI Agents &amp; Web Gig</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Autonomous agents &amp; Next.js platforms
              </div>
            </a>

            <div className="pt-1 border-t border-slate-800/80">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-1.5 rounded-md hover:bg-slate-800 text-[11px] text-slate-400 hover:text-slate-200"
              >
                View Full Pro Profile (All Services) →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <div className="inline-flex items-center rounded-full bg-slate-900/95 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/80 shadow-lg backdrop-blur-md transition-colors">
        <a
          href={FIVERR_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on Fiverr (Verified Pro Delivery)"
          className="inline-flex items-center gap-2 pl-3.5 pr-2 py-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#1dbf73]" />
          <span>Order on Fiverr</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </a>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle gig selection menu"
          className="pr-2.5 pl-1 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  )
}

