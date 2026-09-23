import React from 'react'
import { FIVERR_URL } from '@/types/contact'

export default function FiverrButton() {
  return (
    <aside aria-label="Hire on Fiverr" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-mono font-medium border border-emerald-500/40 shadow-xl shadow-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Order Securely on Fiverr • Verified Pro
      </span>

      {/* Fiverr Button */}
      <a
        href={FIVERR_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hire Daniel Jacob / TSTACK WEB on Fiverr"
        className="relative w-14 h-14 rounded-full bg-[#1dbf73] hover:bg-[#19a463] text-white flex items-center justify-center shadow-lg shadow-[#1dbf73]/40 hover:shadow-[#1dbf73]/60 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#1dbf73]/50"
      >
        {/* Subtle Pulse Effect */}
        <span className="absolute -inset-1 rounded-full bg-[#1dbf73] opacity-30 animate-ping pointer-events-none" />

        {/* Fiverr 'fi.' typography mark */}
        <span className="relative z-10 font-black text-xl font-sans tracking-tighter leading-none select-none">
          fi<span className="text-[#0e4828] font-black">.</span>
        </span>
      </a>
    </aside>
  )
}
