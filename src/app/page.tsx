import React from 'react'
import type { Metadata } from 'next'
import HeroSlider from '@/components/hero/HeroSlider'
import Introduction from '@/components/home/Introduction'
import ServicesGrid from '@/components/home/ServicesGrid'
import WhyTStack from '@/components/home/WhyTStack'
import ProcessTimeline from '@/components/home/ProcessTimeline'
import SelectedConcepts from '@/components/home/SelectedConcepts'
import TechStack from '@/components/home/TechStack'
import GlobalPresence from '@/components/home/GlobalPresence'
import HomeCTA from '@/components/home/HomeCTA'

export const metadata: Metadata = {
  title: 'TSTACK WEB | Modern Web Development & Digital Solutions',
  description:
    'Full-service web development and digital solutions agency. Distinctive websites, custom software, and scalable digital experiences serving the USA, UK, Spain, and Asia.',
  alternates: {
    canonical: 'https://tstackweb.com',
  },
  openGraph: {
    title: 'TSTACK WEB | Modern Web Development & Digital Solutions',
    description:
      'Full-service web development and digital solutions agency. Distinctive websites, custom software, and scalable digital experiences.',
    url: 'https://tstackweb.com',
    siteName: 'TSTACK WEB',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Introduction />
      <ServicesGrid />
      <WhyTStack />
      <ProcessTimeline />
      <SelectedConcepts />
      <TechStack />
      <GlobalPresence />
      <HomeCTA />
    </>
  )
}
