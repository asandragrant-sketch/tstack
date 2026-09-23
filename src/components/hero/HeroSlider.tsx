'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Button from '@/components/common/Button'
import SlideControls from './SlideControls'
import BrowserUiVisual from './visuals/BrowserUiVisual'
import CodeEditorVisual from './visuals/CodeEditorVisual'
import DashboardVisual from './visuals/DashboardVisual'
import FuturisticUiVisual from './visuals/FuturisticUiVisual'

interface SlideData {
  id: number
  themeBadge: string
  headline: string
  headlineHighlight?: string
  supportingText: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
  VisualComponent: React.ComponentType<{ mouseX?: number; mouseY?: number }>
  ambientGradient: string
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    themeBadge: 'SLIDE 01 • DIGITAL EXPERIENCES',
    headline: 'WE BUILD DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD.',
    headlineHighlight: 'MOVE BUSINESSES FORWARD.',
    supportingText:
      'Modern websites and digital solutions engineered around your business goals. Delivering high-impact digital presence for leaders across the USA, UK, Spain, and Asia.',
    primaryCtaText: 'Start Your Project',
    primaryCtaHref: '/contact',
    secondaryCtaText: 'Explore Services',
    secondaryCtaHref: '/services',
    VisualComponent: BrowserUiVisual,
    ambientGradient: 'from-blue-900/20 via-cyan-900/10 to-transparent',
  },
  {
    id: 2,
    themeBadge: 'SLIDE 02 • WEB DEVELOPMENT',
    headline: 'POWERFUL WEB DEVELOPMENT. BEAUTIFULLY ENGINEERED.',
    headlineHighlight: 'BEAUTIFULLY ENGINEERED.',
    supportingText:
      'Fast, responsive and scalable digital experiences designed to perform across every screen. Clean architecture built with Next.js, React, and TypeScript.',
    primaryCtaText: 'Our Services',
    primaryCtaHref: '/services',
    secondaryCtaText: "Let's Talk",
    secondaryCtaHref: '/contact',
    VisualComponent: CodeEditorVisual,
    ambientGradient: 'from-cyan-950/25 via-blue-950/15 to-transparent',
  },
  {
    id: 3,
    themeBadge: 'SLIDE 03 • BUSINESS GROWTH',
    headline: 'TURN YOUR DIGITAL PRESENCE INTO A BUSINESS ADVANTAGE.',
    headlineHighlight: 'BUSINESS ADVANTAGE.',
    supportingText:
      'We combine strategy, design and technology to create digital experiences built for real business goals. Measurable conversions and enterprise stability.',
    primaryCtaText: 'Start a Project',
    primaryCtaHref: '/contact',
    secondaryCtaText: 'About TSTACK WEB',
    secondaryCtaHref: '/about',
    VisualComponent: DashboardVisual,
    ambientGradient: 'from-emerald-950/20 via-blue-950/15 to-transparent',
  },
  {
    id: 4,
    themeBadge: 'SLIDE 04 • DIGITAL FUTURE',
    headline: 'YOUR NEXT DIGITAL EXPERIENCE STARTS HERE.',
    headlineHighlight: 'STARTS HERE.',
    supportingText:
      'From idea to launch, TSTACK WEB helps transform ambitious ideas into polished digital products. Turnkey development ready for global expansion.',
    primaryCtaText: 'Get Started',
    primaryCtaHref: '/contact',
    secondaryCtaText: 'Contact Us',
    secondaryCtaHref: '/contact',
    VisualComponent: FuturisticUiVisual,
    ambientGradient: 'from-indigo-950/25 via-cyan-950/15 to-transparent',
  },
]

const SLIDE_DURATION_MS = 7000

export default function HeroSlider() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const activeSlide = SLIDES[currentSlideIndex]

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length)
    setProgress(0)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
    setProgress(0)
  }, [])

  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index)
    setProgress(0)
  }

  // Autoplay timer with progress calculation
  useEffect(() => {
    if (!isPlaying || isHovered) return

    const intervalTime = 50
    const step = (intervalTime / SLIDE_DURATION_MS) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + step
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [isPlaying, isHovered, handleNext])

  // Mouse parallax listener (desktop only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return
      // Normalize -1 to 1 based on window width & height
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const Visual = activeSlide.VisualComponent

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="TSTACK WEB Featured Hero Presentation"
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-slate-950 tech-grid-pattern"
    >
      {/* Dynamic Ambient Background Glow per slide */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${activeSlide.ambientGradient} pointer-events-none transition-colors duration-1000 ease-in-out`}
      />

      {/* Subtle top & corner atmospheric lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        {/* Animated Slide Stage */}
        <div key={activeSlide.id} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col z-20">
            {/* Slide Badge */}
            <div className="anim-hero-tag mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider bg-blue-950/70 border border-blue-500/40 text-cyan-300 shadow-sm shadow-blue-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {activeSlide.themeBadge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="anim-hero-heading text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white font-display tracking-tight leading-[1.1] mb-6">
              {activeSlide.headline}
            </h1>

            {/* Supporting Paragraph */}
            <p className="anim-hero-subtext text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
              {activeSlide.supportingText}
            </p>

            {/* CTA Buttons */}
            <div className="anim-hero-cta flex flex-wrap items-center gap-4">
              <Button
                href={activeSlide.primaryCtaHref}
                variant="glow"
                size="lg"
                icon
                className="font-bold tracking-wide"
              >
                {activeSlide.primaryCtaText}
              </Button>

              <Button
                href={activeSlide.secondaryCtaHref}
                variant="secondary"
                size="lg"
                className="font-semibold tracking-wide"
              >
                {activeSlide.secondaryCtaText}
              </Button>
            </div>
          </div>

          {/* Visual Presentation Column */}
          <div className="lg:col-span-6 xl:col-span-5 anim-hero-visual relative z-10">
            <Visual mouseX={mousePos.x} mouseY={mousePos.y} />
          </div>
        </div>

        {/* Minimalist Slider Revolution Controls */}
        <SlideControls
          currentSlide={currentSlideIndex}
          totalSlides={SLIDES.length}
          progress={progress}
          isPlaying={isPlaying}
          onSelectSlide={handleSelectSlide}
          onPrev={handlePrev}
          onNext={handleNext}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      </div>
    </section>
  )
}
