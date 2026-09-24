import React from 'react'
import type { Metadata } from 'next'
import SectionHeading from '@/components/common/SectionHeading'
import FounderSpotlight from '@/components/about/FounderSpotlight'
import CoreValues from '@/components/about/CoreValues'
import HomeCTA from '@/components/home/HomeCTA'
import { Target, Compass } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About TSTACK | Leadership, Engineering Standards & Mission',
  description:
    'Learn about TSTACK: practical AI automation, autonomous agents, and custom web software founded by lead solutions architect Daniel Jacob.',
  alternates: {
    canonical: 'https://tstackweb.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen text-slate-300">
      {/* About Us Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800">
              <span>ABOUT TSTACK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Engineering digital infrastructure for businesses ready to scale.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              We combine architectural rigor, modern full-stack development, and practical AI automation to build software that solves real commercial bottlenecks.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Spotlight & Team */}
      <FounderSpotlight />

      {/* Story & Mission Section */}
      <section className="py-20 sm:py-28 border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-6 space-y-5">
              <SectionHeading
                badge="Our Philosophy"
                title="Built on engineering rigor,"
                highlight="not marketing hype."
                align="left"
                description="TSTACK was founded to bridge the gap between fragile no-code templates and inaccessible, bloated enterprise agencies."
              />

              <div className="space-y-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <p>
                  In a market flooded with generic website builders and fragile automations that break under real-world usage, businesses need systems they can actually rely on.
                </p>
                <p>
                  TSTACK provides the alternative: clean, documented, and strictly typed systems engineered by senior software practitioners who prioritize uptime, security, and measurable ROI over flashy trends.
                </p>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="pro-card p-6 space-y-3">
                <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-white">Our Mission</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  To empower companies worldwide with durable, high-performance automation pipelines and digital platforms that eliminate operational waste and create lasting competitive advantages.
                </p>
              </div>

              <div className="pro-card p-6 space-y-3">
                <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-white">Our Standards</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Every solution is engineered with production-ready standards: verified API schemas, proactive error logging, sub-second execution speeds, and safe escrow delivery via Fiverr.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <CoreValues />

      {/* CTA Section */}
      <HomeCTA />
    </div>
  )
}
