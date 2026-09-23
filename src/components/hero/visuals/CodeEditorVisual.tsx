import React from 'react'
import { Terminal, Code, Cpu, Check, Layers, Smartphone } from 'lucide-react'

export default function CodeEditorVisual({
  mouseX = 0,
  mouseY = 0,
}: {
  mouseX?: number
  mouseY?: number
}) {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-[16/11] select-none perspective-1000">
      {/* Background Ambient Aura */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-blue-600/25 to-purple-600/20 rounded-3xl blur-2xl opacity-70"
        style={{
          transform: `translate(${mouseX * 12}px, ${mouseY * 12}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Main IDE Window */}
      <div
        className="relative h-full w-full rounded-2xl glass-panel border border-slate-700/70 overflow-hidden shadow-2xl shadow-black/85 flex flex-col font-mono"
        style={{
          transform: `translate(${mouseX * 15}px, ${mouseY * 15}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Editor Tabs Header */}
        <div className="h-10 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block" />
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border-t-2 border-cyan-400 text-xs text-slate-200 rounded-t">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>architecture.tsx</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-500 hover:text-slate-400">
              <span>config.ts</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500">TypeScript 5.6</div>
        </div>

        {/* Code Content Body */}
        <div className="flex-1 p-4 bg-[#0a0f1d]/90 text-xs overflow-hidden flex flex-col justify-between">
          <div className="space-y-1 leading-relaxed text-[11px] sm:text-xs">
            <div className="text-slate-500 italic">// TSTACK WEB High-Scale Architecture</div>
            <div>
              <span className="text-purple-400">import</span>{' '}
              <span className="text-blue-300">&#123; createDigitalExperience &#125;</span>{' '}
              <span className="text-purple-400">from</span>{' '}
              <span className="text-emerald-400">&apos;@tstack/core&apos;</span>
            </div>
            <div className="pt-1">
              <span className="text-blue-400">export const</span>{' '}
              <span className="text-yellow-300">TStackEngine</span> ={' '}
              <span className="text-blue-400">async</span> () =&gt; &#123;
            </div>
            <div className="pl-4">
              <span className="text-purple-400">return await</span>{' '}
              <span className="text-cyan-300">createDigitalExperience</span>(&#123;
            </div>
            <div className="pl-8 text-slate-300">
              stack: [<span className="text-emerald-300">&apos;Next.js&apos;</span>,{' '}
              <span className="text-emerald-300">&apos;React&apos;</span>,{' '}
              <span className="text-emerald-300">&apos;TypeScript&apos;</span>],
            </div>
            <div className="pl-8 text-slate-300">
              regions: [<span className="text-emerald-300">&apos;USA&apos;</span>,{' '}
              <span className="text-emerald-300">&apos;UK&apos;</span>,{' '}
              <span className="text-emerald-300">&apos;Spain&apos;</span>,{' '}
              <span className="text-emerald-300">&apos;Asia&apos;</span>],
            </div>
            <div className="pl-8 text-slate-300">
              quality: <span className="text-cyan-400">Standards.ENTERPRISE_GRADE</span>,
            </div>
            <div className="pl-8 text-slate-300">
              responsive: <span className="text-purple-400">true</span>,
            </div>
            <div className="pl-4">&#125;)</div>
            <div>&#125;</div>
          </div>

          {/* Embedded Terminal Output */}
          <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-slate-800/80 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>TERMINAL — build:production</span>
              </div>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-emerald-400 font-bold">&#x2713; Compiled in 384ms</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">Zero lint errors</span>
              <span className="text-slate-500">|</span>
              <span className="text-purple-400">100% Type Checked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card: Responsive Viewport Badge */}
      <div
        className="absolute -top-4 -left-3 sm:-left-6 p-3 rounded-xl glass-panel border border-cyan-500/40 shadow-xl shadow-cyan-950/40 z-20 flex items-center gap-3 animate-float-slow"
        style={{
          transform: `translate(${mouseX * 22}px, ${mouseY * 22}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Smartphone className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Multi-Screen
          </div>
          <div className="text-xs font-bold text-white">Full Screen Adaptability</div>
        </div>
      </div>

      {/* Floating Card: Clean Code Standard */}
      <div
        className="absolute -bottom-3 -right-3 sm:-right-6 p-3 rounded-xl glass-panel border border-purple-500/40 shadow-xl shadow-purple-950/40 z-20 flex items-center gap-3 animate-float-reverse"
        style={{
          transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
          <Layers className="w-4 h-4 text-purple-300" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            Architecture
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1">
            <span>Modular & Scalable</span>
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
