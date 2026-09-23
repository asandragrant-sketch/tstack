import React from 'react'
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, BarChart3 } from 'lucide-react'

export default function DashboardVisual({
  mouseX = 0,
  mouseY = 0,
}: {
  mouseX?: number
  mouseY?: number
}) {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-[16/11] select-none perspective-1000">
      {/* Background Soft Aura */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-75"
        style={{
          transform: `translate(${mouseX * 12}px, ${mouseY * 12}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Main Analytics Dashboard Frame */}
      <div
        className="relative h-full w-full rounded-2xl glass-panel-glow border border-slate-700/60 overflow-hidden shadow-2xl shadow-black/85 flex flex-col p-5 justify-between"
        style={{
          transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                BUSINESS PERFORMANCE HUB
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Live Conversion Telemetry</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GROWTH INDEX ACTIVE</span>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-2.5 my-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Conversion Rate</span>
            <div className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-1">
              <span>+34.2%</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-[9px] text-emerald-400 mt-1 font-mono">Optimized UX Funnel</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Qualified Leads</span>
            <div className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-1">
              <span>3.8x</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-[9px] text-cyan-400 mt-1 font-mono">High-Intent Inquiries</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Load Latency</span>
            <div className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-1">
              <span>0.38s</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div className="text-[9px] text-blue-400 mt-1 font-mono">Sub-Second Delivery</div>
          </div>
        </div>

        {/* Simulated Graph Vector */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              Strategic Growth Curve
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Multi-Quarter Trend</span>
          </div>

          {/* SVG Growth Graph */}
          <div className="w-full h-16 sm:h-20 py-1">
            <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 55 Q 50 48, 90 40 T 170 32 T 230 18 T 300 8"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 55 Q 50 48, 90 40 T 170 32 T 230 18 T 300 8 L 300 70 L 0 70 Z"
                fill="url(#growthGrad)"
              />
              <circle cx="300" cy="8" r="4" fill="#FFFFFF" />
              <circle cx="300" cy="8" r="8" fill="#38BDF8" opacity="0.4" className="animate-ping" />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800/40">
            <span>DISCOVERY</span>
            <span>STRATEGY</span>
            <span>ARCHITECTURE</span>
            <span>LAUNCH</span>
            <span className="text-cyan-400 font-bold">EXPANSION</span>
          </div>
        </div>
      </div>

      {/* Floating Card: ROI / Growth Badge */}
      <div
        className="absolute -top-3 -right-3 sm:-right-6 p-3 rounded-xl glass-panel border border-emerald-500/40 shadow-xl shadow-emerald-950/40 z-20 flex items-center gap-3 animate-float-slow"
        style={{
          transform: `translate(${mouseX * 25}px, ${mouseY * 25}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Advantage
          </div>
          <div className="text-xs font-bold text-white">Engineered for Results</div>
        </div>
      </div>

      {/* Floating Card: Strategy + Tech Synergy */}
      <div
        className="absolute -bottom-3 -left-3 sm:-left-6 p-3 rounded-xl glass-panel border border-blue-500/40 shadow-xl shadow-blue-950/40 z-20 flex items-center gap-3 animate-float-reverse"
        style={{
          transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Users className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Audience Focus
          </div>
          <div className="text-xs font-bold text-white">Targeted Engagement</div>
        </div>
      </div>
    </div>
  )
}
