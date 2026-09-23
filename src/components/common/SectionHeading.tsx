import React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  badge?: string
  title: string
  highlight?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/30 bg-blue-950/40 text-blue-400 backdrop-blur-sm',
            align === 'center' && 'justify-center'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{badge}</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display leading-[1.15]">
        {title}{' '}
        {highlight && (
          <span className="gradient-text-cyan">{highlight}</span>
        )}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
