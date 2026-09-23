import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import SectionHeading from '@/components/common/SectionHeading'
import Button from '@/components/common/Button'
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
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react'
import { SERVICES_DATA } from '@/types/services'

export const metadata: Metadata = {
  title: 'TSTACK WEB Services | Web Design, Development & Digital Solutions',
  description:
    'Explore our 12 specialized digital services: custom website design, Next.js web development, e-commerce platforms, UI/UX architecture, SEO, performance tuning, and software engineering.',
  alternates: {
    canonical: 'https://tstackweb.com/services',
  },
  openGraph: {
    title: 'TSTACK WEB Services | Web Design, Development & Digital Solutions',
    description:
      'Digital services built around your goals. From your first idea to launch and beyond, TSTACK WEB provides the design, development and technology expertise needed.',
    url: 'https://tstackweb.com/services',
    siteName: 'TSTACK WEB',
    type: 'website',
  },
}

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

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      {/* Services Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-950/80 border border-blue-500/30 text-cyan-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>END-TO-END DIGITAL CAPABILITIES</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            DIGITAL SERVICES BUILT{' '}
            <span className="gradient-text-cyan">AROUND YOUR GOALS.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            From your first idea to launch and beyond, TSTACK WEB provides the design, development and technology expertise needed to build a stronger digital presence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="glow" size="md" icon>
              Consult With an Engineer
            </Button>
            <Button href="#services-list" variant="secondary" size="md">
              Browse All 12 Services
            </Button>
          </div>
        </div>
      </section>

      {/* Detailed Services Breakdown Section */}
      <section id="services-list" className="relative py-24 sm:py-32 bg-slate-950 tech-grid-pattern border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-24">
          {SERVICES_DATA.map((service, index) => {
            const Icon = ICON_MAP[service.icon] || Code2
            const isEven = index % 2 === 1

            return (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-32 rounded-3xl glass-panel border border-slate-800/90 p-8 sm:p-12 hover:border-blue-500/40 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Subtle top edge border glow on hover */}
                <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/80 transition-all duration-500" />

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Service Description Column */}
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
                        SERVICE 0{index + 1} / 12
                      </span>
                      {service.badge && (
                        <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/30 text-cyan-300">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight">
                      {service.title}
                    </h2>

                    <p className="text-base text-slate-300 leading-relaxed">
                      {service.fullDescription}
                    </p>

                    {/* Capabilities Checklist */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                        Key Capabilities &amp; Architecture:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.capabilities.map((cap) => (
                          <div key={cap} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-4 flex items-center gap-4">
                      <Button
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        variant="glow"
                        size="sm"
                        icon
                      >
                        Request Quote for {service.title}
                      </Button>
                    </div>
                  </div>

                  {/* Deliverables & Visual Card Column */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl shadow-black/60 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                        <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-400" />
                          <span>Standard Deliverables</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>

                      <div className="space-y-3">
                        {service.deliverables.map((item, dIdx) => (
                          <div
                            key={item}
                            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300"
                          >
                            <span className="font-medium">{item}</span>
                            <span className="text-[10px] font-mono text-cyan-400">Phase 0{dIdx + 1}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Quality Guarantee</span>
                        <span className="text-emerald-400 font-semibold">100% Tested</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* End Section: HAVE A PROJECT IN MIND? LET'S TALK */}
      <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-950/80 border border-blue-500/30 text-cyan-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>DIRECT COLLABORATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight mb-6">
            HAVE A PROJECT IN MIND?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed mb-10">
            Tell us about your timeline, business requirements, and goals. Our engineering and design leadership is ready to review your project.
          </p>

          <Button
            href="/contact"
            variant="glow"
            size="lg"
            icon
            className="font-bold tracking-wider text-base px-10 py-4 uppercase"
          >
            LET&apos;S TALK
          </Button>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span>Direct Inquiries:</span>
            <a href="mailto:B.ELOWENWEBPRO@GMAIL.COM" className="hover:text-cyan-300 transition-colors">
              B.ELOWENWEBPRO@GMAIL.COM
            </a>
            <span>•</span>
            <a href="mailto:D.JACOBWEBPRO@GMAIL.COM" className="hover:text-cyan-300 transition-colors">
              D.JACOBWEBPRO@GMAIL.COM
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
