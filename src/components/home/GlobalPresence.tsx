import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import { Globe, Clock, ShieldCheck, Zap } from 'lucide-react'

const REGIONS = [
  {
    name: 'United States (USA)',
    code: 'USA',
    tag: 'Primary Market',
    description: 'Serving North American startups, enterprises, and fast-growing digital brands with high-performance web engineering.',
    timezones: 'EST • CST • MST • PST',
  },
  {
    name: 'United Kingdom (UK)',
    code: 'UK',
    tag: 'European Hub',
    description: 'Partnering with UK businesses, consultancies, and e-commerce innovators seeking distinctive digital distinction.',
    timezones: 'GMT • BST',
  },
  {
    name: 'Spain',
    code: 'ES',
    tag: 'European Hub',
    description: 'Delivering modern digital solutions, web redesigns, and high-conversion systems across the Spanish digital landscape.',
    timezones: 'CET • CEST',
  },
  {
    name: 'Selected Parts of Asia',
    code: 'ASIA',
    tag: 'Expanding Reach',
    description: 'Collaborating with forward-looking international businesses and technological entrepreneurs across leading Asian markets.',
    timezones: 'SGT • JST • HKT',
  },
]

export default function GlobalPresence() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-slate-900">
      {/* Background World Network Graphic / Nodes */}
      <div className="absolute inset-0 opacity-15 pointer-events-none tech-grid-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="International Delivery"
          title="GLOBAL SERVICE REACH:"
          highlight="USA • UK • SPAIN • ASIA"
          description="TSTACK WEB delivers high-end web development and digital solutions across key international timezones, providing seamless remote collaboration and world-class digital standards."
        />

        {/* Global Network Digital Visual Map Representation */}
        <div className="my-12 p-8 rounded-3xl glass-panel-glow border border-slate-800/90 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-md space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>CROSS-BORDER COLLABORATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                Engineered for International Standards
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We operate as a distributed digital agency serving cross-continental clients. Our structured communication, async engineering workflows, and strict milestone tracking ensure smooth execution across all four service territories.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Timezone Aligned</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Direct communication coverage</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Edge Deployments</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Sub-second global CDN access</div>
                </div>
              </div>
            </div>

            {/* Interactive Region Cards Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
              {REGIONS.map((region) => (
                <div
                  key={region.code}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-cyan-400">
                      {region.code}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-slate-500">
                      {region.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 font-display group-hover:text-blue-200 transition-colors">
                    {region.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {region.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500">
                    Zones: {region.timezones}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
