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
        'max-w-2xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800 mb-4',
            align === 'center' && 'justify-center'
          )}
        >
          <span>{badge}</span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
        {title}{' '}
        {highlight && (
          <span className="text-slate-300 font-medium">{highlight}</span>
        )}
      </h2>

      {description && (
        <p className="mt-3.5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
