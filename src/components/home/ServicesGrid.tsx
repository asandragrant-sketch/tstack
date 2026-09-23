import React from 'react'
import Link from 'next/link'
import {
  Layout,
  Code2,
  ShoppingBag,
  Compass,
  Cpu,
  FileCode,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  Boxes,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { SERVICES_DATA } from '@/types/services'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  Code2,
  ShoppingBag,
  Compass,
  Cpu,
  FileCode,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  Boxes,
  TrendingUp,
}

export default function ServicesGrid() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950/80 tech-dot-pattern border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Specialized Expertise"
          title="COMPREHENSIVE DIGITAL"
          highlight="CAPABILITIES"
          description="From custom bespoke websites to enterprise-grade web applications, TSTACK WEB delivers end-to-end digital solutions built for real commercial impact."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service, index) => {
            const IconComponent = ICON_MAP[service.icon] || Code2

            return (
              <div
                key={service.id}
                className="group relative p-7 rounded-2xl glass-panel border border-slate-800/90 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Hover Top Glow Line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-cyan-400/80 transition-all duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400/60 group-hover:bg-blue-900/50 transition-all duration-300 shadow-sm shadow-blue-950">
                      <IconComponent className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    </div>

                    {service.badge && (
                      <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-500/30 text-cyan-300">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-blue-200 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between">
                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-blue-400 group-hover:text-cyan-300 transition-colors"
                  >
                    <span>Explore Capabilities</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <span className="text-xs font-mono text-slate-600 group-hover:text-slate-500 transition-colors">
                    0{index + 1}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Services Footer Link */}
        <div className="text-center mt-16">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 text-slate-200 hover:text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-950/50 group"
          >
            <span>View All Detailed Service Specifications &amp; Deliverables</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
