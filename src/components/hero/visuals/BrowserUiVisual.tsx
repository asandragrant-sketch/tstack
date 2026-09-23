import React from 'react'
import { Sparkles, CheckCircle2, Zap, Layout, Globe, ArrowUpRight } from 'lucide-react'

export default function BrowserUiVisual({
  mouseX = 0,
  mouseY = 0,
}: {
  mouseX?: number
  mouseY?: number
}) {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-[16/11] select-none perspective-1000">
      {/* Background Soft Glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-indigo-600/20 rounded-3xl blur-2xl opacity-75"
        style={{
          transform: `translate(${mouseX * 10}px, ${mouseY * 10}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Main Browser Window Frame */}
      <div
        className="relative h-full w-full rounded-2xl glass-panel-glow border border-slate-700/60 overflow-hidden shadow-2xl shadow-black/80 flex flex-col"
        style={{
          transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Browser Top Window Bar */}
        <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-300 w-1/2 justify-center">
            <span className="text-cyan-400">https://</span>
            <span className="text-slate-200">tstackweb.com</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
          </div>

          <div className="text-[10px] font-mono text-slate-400">PRODUCTION</div>
        </div>

        {/* Browser Viewport Content */}
        <div className="flex-1 p-5 bg-gradient-to-b from-slate-900/50 via-slate-950/80 to-slate-950 overflow-hidden flex flex-col justify-between">
          {/* Mockup Header */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                T
              </div>
              <span className="text-xs font-bold text-white tracking-wider">TSTACK PLATFORM</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
              <span className="text-cyan-400">Overview</span>
              <span>Architecture</span>
              <span>Global Edge</span>
            </div>
          </div>

          {/* Hero Inside Mockup */}
          <div className="my-auto py-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] text-blue-400 mb-2 font-mono">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>DIGITAL SYSTEM ONLINE</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Enterprise Grade Engineering
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm line-clamp-2">
              Built for high-performance international brands across USA, UK, Spain, and Asia.
            </p>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Performance</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span>99.8%</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Page Speed</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5 flex items-center gap-1">
                  <span>100/100</span>
                  <Zap className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono">CDN Edge</div>
                <div className="text-sm font-bold text-blue-400 mt-0.5 flex items-center gap-1">
                  <span>Global</span>
                  <Globe className="w-3 h-3 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Nominal
            </span>
            <span>SSR Latency: 12ms</span>
          </div>
        </div>
      </div>

      {/* Floating Card 1: Performance Score Badge */}
      <div
        className="absolute -top-3 -right-3 sm:-right-6 p-3 rounded-xl glass-panel border border-cyan-500/40 shadow-xl shadow-cyan-950/40 z-20 flex items-center gap-3 animate-float-slow"
        style={{
          transform: `translate(${mouseX * 25}px, ${mouseY * 25}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
          99
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Google Lighthouse
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1">
            <span>Optimal Performance</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Floating Card 2: Live Deployment Badge */}
      <div
        className="absolute -bottom-4 -left-3 sm:-left-6 p-3 rounded-xl glass-panel border border-blue-500/40 shadow-xl shadow-blue-950/40 z-20 flex items-center gap-3 animate-float-reverse"
        style={{
          transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Next.js Engine
          </div>
          <div className="text-xs font-bold text-white">Edge Accelerated</div>
        </div>
      </div>
    </div>
  )
}
