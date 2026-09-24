import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { FIVERR_URL } from '@/types/contact'

export default function FiverrButton() {
  return (
    <aside aria-label="Order on Fiverr" className="fixed bottom-5 right-5 z-30">
      <a
        href={FIVERR_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on Fiverr (Verified Pro Delivery)"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/80 shadow-md backdrop-blur-md transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-[#1dbf73]" />
        <span>Order on Fiverr</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
      </a>
    </aside>
  )
}
