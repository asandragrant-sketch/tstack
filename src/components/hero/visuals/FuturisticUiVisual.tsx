import React from 'react'
import { Rocket, Shield, Globe2, Sparkles, Network, Cpu } from 'lucide-react'

export default function FuturisticUiVisual({
  mouseX = 0,
  mouseY = 0,
}: {
  mouseX?: number
  mouseY?: number
}) {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-[16/11] select-none perspective-1000">
      {/* Background Cyber Glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-cyan-500/25 via-indigo-600/25 to-blue-500/25 rounded-3xl blur-2xl opacity-75"
        style={{
          transform: `translate(${mouseX * 12}px, ${mouseY * 12}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Main Futuristic Interface Frame */}
      <div
        className="relative h-full w-full rounded-2xl glass-panel-glow border border-cyan-500/40 overflow-hidden shadow-2xl shadow-black/85 flex flex-col p-5 justify-between"
        style={{
          transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Futuristic Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-widest font-display uppercase">
                TSTACK NEXT-GEN CORE
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">v4.8 • Production Cluster</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>CLOUD DEPLOYED</span>
          </div>
        </div>

        {/* Central Futuristic Network Map */}
        <div className="relative my-auto py-2 flex items-center justify-center">
          {/* Radial grid circles */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-blue-500/20 flex items-center justify-center animate-glow-spin">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/20 border border-blue-400/50 flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Network className="w-6 h-6 text-cyan-400" />
                <span className="text-[9px] font-mono text-cyan-200 mt-0.5">NEXUS</span>
              </div>
            </div>
          </div>

          {/* Node Orbit Badges */}
          <div className="absolute top-2 left-4 sm:left-8 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 shadow-md">
            <span className="text-cyan-400">01</span> Node.USA [East]
          </div>
          <div className="absolute top-4 right-4 sm:right-8 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 shadow-md">
            <span className="text-cyan-400">02</span> Node.UK [London]
          </div>
          <div className="absolute bottom-4 left-6 sm:left-12 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 shadow-md">
            <span className="text-cyan-400">03</span> Node.Spain [Madrid]
          </div>
          <div className="absolute bottom-2 right-6 sm:right-12 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 shadow-md">
            <span className="text-cyan-400">04</span> Node.Asia [Tokyo/SG]
          </div>
        </div>

        {/* Bottom Capabilities Checklist */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 text-center">
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-bold block">IDEA</span>
            <span>Discovery & Plan</span>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-blue-400 font-bold block">BUILD</span>
            <span>Design & Code</span>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-indigo-400 font-bold block">SCALE</span>
            <span>Launch & Grow</span>
          </div>
        </div>
      </div>

      {/* Floating Card: Modern Stack Readiness */}
      <div
        className="absolute -top-3 -right-3 sm:-right-6 p-3 rounded-xl glass-panel border border-cyan-500/40 shadow-xl shadow-cyan-950/40 z-20 flex items-center gap-3 animate-float-slow"
        style={{
          transform: `translate(${mouseX * 25}px, ${mouseY * 25}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Future-Proof
          </div>
          <div className="text-xs font-bold text-white">Modern Ecosystem</div>
        </div>
      </div>

      {/* Floating Card: Global Launchpad */}
      <div
        className="absolute -bottom-3 -left-3 sm:-left-6 p-3 rounded-xl glass-panel border border-indigo-500/40 shadow-xl shadow-indigo-950/40 z-20 flex items-center gap-3 animate-float-reverse"
        style={{
          transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Globe2 className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Ready To Launch
          </div>
          <div className="text-xs font-bold text-white">Turnkey Delivery</div>
        </div>
      </div>
    </div>
  )
}
