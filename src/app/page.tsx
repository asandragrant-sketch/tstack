import React from 'react'
import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import FeaturedServices from '@/components/home/FeaturedServices'
import FeaturedWork from '@/components/home/FeaturedWork'
import WhyTStack from '@/components/home/WhyTStack'
import HomeCTA from '@/components/home/HomeCTA'

export const metadata: Metadata = {
  title: 'TSTACK | AI Automation, Autonomous Agents & Business Software',
  description:
    'TSTACK engineers practical AI automation pipelines, custom autonomous agents, and high-performance web applications for modern businesses.',
  alternates: {
    canonical: 'https://tstackweb.com',
  },
  openGraph: {
    title: 'TSTACK | AI Automation, Autonomous Agents & Business Software',
    description:
      'We design and build dependable automated workflows, autonomous assistants, and full-stack software that eliminate repetitive operations and help businesses scale.',
    url: 'https://tstackweb.com',
    siteName: 'TSTACK',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedServices />
      <FeaturedWork />
      <WhyTStack />
      <HomeCTA />
    </>
  )
}
