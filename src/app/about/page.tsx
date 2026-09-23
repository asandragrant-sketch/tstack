import React from 'react'
import type { Metadata } from 'next'
import SectionHeading from '@/components/common/SectionHeading'
import FounderSpotlight from '@/components/about/FounderSpotlight'
import CoreValues from '@/components/about/CoreValues'
import HomeCTA from '@/components/home/HomeCTA'
import {
  Target,
  Compass,
  CheckCircle2,
  Globe2,
  Workflow,
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About TSTACK WEB | Web Development & Digital Solutions',
  description:
    'Discover TSTACK WEB: full-service digital agency founded by lead architect Daniel Jacob. Turning ambitious ideas into high-performance web applications and websites.',
  alternates: {
    canonical: 'https://tstackweb.com/about',
  },
  openGraph: {
    title: 'About TSTACK WEB | Web Development & Digital Solutions',
    description:
      'We turn digital ideas into real-world results. Learn about our leadership, engineering values, and international delivery across USA, UK, Spain, and Asia.',
    url: 'https://tstackweb.com/about',
    siteName: 'TSTACK WEB',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      {/* About Us Hero Section */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-950/80 border border-blue-500/30 text-cyan-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>WHO WE ARE &amp; WHAT WE STAND FOR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            WE TURN DIGITAL IDEAS INTO{' '}
            <span className="gradient-text-cyan">REAL-WORLD RESULTS.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TSTACK WEB combines strategy, design, development and technology to create modern digital experiences for businesses, organizations and entrepreneurs.
          </p>
        </div>
      </section>

      {/* Founder Spotlight: Daniel Jacob */}
      <FounderSpotlight />

      {/* Company Story, Mission & Vision Section */}
      <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story text */}
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                badge="The TSTACK Story"
                title="BUILT ON TECHNICAL"
                highlight="EXCELLENCE"
                align="left"
                description="TSTACK WEB was founded to bridge the gap between creative visual artistry and robust, enterprise-grade software architecture."
              />

              <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
                <p>
                  In a digital era crowded with generic website builders and fragile site templates, businesses often find themselves trapped between clunky platforms and inaccessible enterprise agencies.
                </p>
                <p>
                  TSTACK WEB provides the ideal alternative: a high-caliber digital engineering partner that crafts bespoke, fast, and scalable digital solutions tailored directly to commercial goals.
                </p>
                <p>
                  By adopting a modern component-driven stack with Next.js, React, and TypeScript, we build websites that not only capture attention through cinematic presentation, but also deliver bulletproof reliability, lightning-fast response times, and effortless long-term maintainability.
                </p>
              </div>
            </div>

            {/* Mission & Vision Dual Cards */}
            <div className="lg:col-span-6 space-y-6">
              {/* Mission Card */}
              <div className="p-8 rounded-2xl glass-panel border border-blue-500/30 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-5">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Our Mission</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  To empower businesses, startups, and professionals worldwide with high-performance digital products that elevate brand credibility, streamline user conversion, and create lasting competitive advantages.
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-8 rounded-2xl glass-panel border border-cyan-500/30 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-5">
                  <Compass className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Our Vision</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  To be the international gold standard in modern web development — recognized for our technical precision, architectural integrity, and the distinct commercial growth we unlock for every client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <CoreValues />

      {/* Our Approach & Capabilities */}
      <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Engineering Philosophy"
            title="HOW WE APPROACH"
            highlight="EVERY ENGAGEMENT"
            description="Our structured delivery methodology emphasizes clarity, technical precision, and close strategic alignment."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-8 rounded-2xl glass-panel border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6 font-mono font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Deep Architectural Scoping</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We take the time to deeply analyze your business objectives, operational workflows, and tech stack dependencies prior to writing any production code.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6 font-mono font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Modern Production Hygiene</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Strict type safety, automated formatting, semantic HTML, and zero-compromise accessibility checks are embedded throughout our active development cycles.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6 font-mono font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Continuous Long-Term Care</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We believe in enduring relationships. We remain by your side post-launch to tune performance, monitor security, and scale your system as you grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Highlight */}
      <section className="relative py-20 bg-slate-950/80 tech-grid-pattern border-b border-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-blue-950/70 border border-blue-500/30 mb-4">
            <Globe2 className="w-3.5 h-3.5" />
            <span>GLOBAL DELIVERY COVERAGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-4">
            Serving Forward-Thinking Clients Across 4 Global Regions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Providing full-service web development across <strong className="text-slate-200 font-semibold">USA • UK • Spain • Selected Parts of Asia</strong> with seamless async workflows.
          </p>
        </div>
      </section>

      {/* About CTA */}
      <HomeCTA />
    </div>
  )
}
