import React from 'react'
import Link from 'next/link'
import { Home, ArrowRight, HelpCircle } from 'lucide-react'
import Button from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md mx-auto relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-blue-950/50">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            ERROR 404 • PAGE NOT LOCATED
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
            Lost In Cyberspace
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you requested does not exist or has been relocated within our architecture.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="glow" size="md" icon>
            Return to Homepage
          </Button>
          <Button href="/services" variant="secondary" size="md">
            View Services
          </Button>
        </div>

        <div className="pt-6 border-t border-slate-900 text-xs text-slate-500 font-mono">
          <span>Need assistance? Reach us at </span>
          <a href="mailto:D.JACOBWEBPRO@GMAIL.COM" className="text-cyan-400 hover:underline">
            D.JACOBWEBPRO@GMAIL.COM
          </a>
        </div>
      </div>
    </div>
  )
}
