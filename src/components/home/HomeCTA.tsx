import React from 'react'
import Button from '@/components/common/Button'
import { Sparkles, Mail, Globe, ArrowRight } from 'lucide-react'

export default function HomeCTA() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-950/80 border border-blue-500/40 text-cyan-300 mb-6 shadow-sm shadow-blue-900/50">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>START YOUR COLLABORATION</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.15] mb-6">
          READY TO BUILD YOUR NEXT{' '}
          <span className="gradient-text-cyan">DIGITAL EXPERIENCE?</span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Tell us what you&apos;re building and let&apos;s turn the idea into a digital experience designed around your goals.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            href="/contact"
            variant="glow"
            size="lg"
            icon
            className="font-bold tracking-wide shadow-blue-500/30 text-base px-8 py-4"
          >
            Start Your Project
          </Button>

          <Button
            href="/services"
            variant="secondary"
            size="lg"
            className="font-semibold text-base px-8 py-4"
          >
            Explore Services
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
          <span>USA • UK • Spain • Selected Parts of Asia</span>
          <span className="hidden sm:inline">•</span>
          <span>Response within 24 business hours</span>
          <span className="hidden sm:inline">•</span>
          <span>Direct developer consultation</span>
        </div>
      </div>
    </section>
  )
}
