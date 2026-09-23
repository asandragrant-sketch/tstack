'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface SlideControlsProps {
  currentSlide: number
  totalSlides: number
  progress: number
  isPlaying: boolean
  onSelectSlide: (index: number) => void
  onPrev: () => void
  onNext: () => void
  onTogglePlay: () => void
}

export default function SlideControls({
  currentSlide,
  totalSlides,
  progress,
  isPlaying,
  onSelectSlide,
  onPrev,
  onNext,
  onTogglePlay,
}: SlideControlsProps) {
  return (
    <div className="relative w-full z-30 pt-6 sm:pt-10">
      {/* Autoplay Progress Bar */}
      <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden mb-6 relative">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Slide Numerical Indicators */}
        <div className="flex items-center gap-2 sm:gap-3" role="tablist" aria-label="Hero Slide Selector">
          {Array.from({ length: totalSlides }).map((_, index) => {
            const isActive = currentSlide === index
            return (
              <button
                key={index}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => onSelectSlide(index)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isActive
                    ? 'bg-blue-600/25 border border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>0{index + 1}</span>
                <span
                  className={`hidden sm:inline-block h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 group-hover:bg-slate-500'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Prev / Next & Pause Buttons */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause slider autoplay' : 'Play slider autoplay'}
            className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Previous Slide */}
          <button
            onClick={onPrev}
            aria-label="Previous slide"
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-mono font-medium">PREV</span>
          </button>

          {/* Next Slide */}
          <button
            onClick={onNext}
            aria-label="Next slide"
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-200 hover:text-white hover:bg-blue-600/50 hover:border-cyan-400 transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <span className="hidden sm:inline text-xs font-mono font-medium">NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
