import React from 'react'
import Link from 'next/link'

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'monochrome'
  theme?: 'dark' | 'light'
  className?: string
  iconSize?: number
  href?: string
}

export function LogoSymbol({
  size = 32,
  monochrome = false,
  className = '',
}: {
  size?: number
  monochrome?: boolean
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Clean, architectural geometric mark: Stacked minimal T structure */}
      <rect x="4" y="6" width="28" height="6" rx="2" fill={monochrome ? 'currentColor' : '#3B82F6'} />
      <rect x="15" y="15" width="6" height="15" rx="2" fill={monochrome ? 'currentColor' : '#2563EB'} />
      <rect x="23" y="15" width="9" height="3" rx="1.5" fill={monochrome ? 'currentColor' : '#64748B'} />
      <rect x="4" y="15" width="9" height="3" rx="1.5" fill={monochrome ? 'currentColor' : '#64748B'} />
    </svg>
  )
}

export default function Logo({
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  iconSize = 28,
  href = '/',
}: LogoProps) {
  const isLight = theme === 'light'
  const isMonochrome = variant === 'monochrome'

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoSymbol size={iconSize} monochrome={isMonochrome} />

      {variant !== 'compact' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span
              className={`font-bold text-base tracking-wider uppercase ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              TSTACK
            </span>
          </div>
          <span
            className={`text-[9px] font-mono tracking-widest uppercase mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            AI &amp; Digital Solutions
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-label="TSTACK - Home"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg inline-block"
      >
        {content}
      </Link>
    )
  }

  return content
}
