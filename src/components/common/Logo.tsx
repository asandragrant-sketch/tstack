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
  size = 36, 
  monochrome = false,
  className = '' 
}: { 
  size?: number
  monochrome?: boolean
  className?: string 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tstackGradPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="tstackGradAccent" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {monochrome ? (
        <g fill="currentColor">
          {/* Top Bar of the T-Stack */}
          <path d="M6 10C6 7.79086 7.79086 6 10 6H38C40.2091 6 42 7.79086 42 10V14C42 16.2091 40.2091 18 38 18H10C7.79086 18 6 16.2091 6 14V10Z" />
          {/* Middle Stacking Node */}
          <path d="M18 20H30V26C30 27.1046 29.1046 28 28 28H20C18.8954 28 18 27.1046 18 26V20Z" />
          {/* Lower Stem Base */}
          <path d="M18 30H30V38C30 40.2091 28.2091 42 26 42H22C19.7909 42 18 40.2091 18 38V30Z" />
          {/* Architectural Brackets */}
          <path d="M10 24L6 28L10 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M38 24L42 28L38 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      ) : (
        <g>
          {/* Ambient Glow */}
          <rect x="8" y="8" width="32" height="32" rx="16" fill="#2563EB" opacity="0.15" filter="url(#logoGlow)" />
          
          {/* Top Modular Layer (Crossbar of T) */}
          <path
            d="M7 11C7 8.23858 9.23858 6 12 6H36C38.7614 6 41 8.23858 41 11C41 13.7614 38.7614 16 36 16H12C9.23858 16 7 13.7614 7 11Z"
            fill="url(#tstackGradPrimary)"
          />

          {/* Central Connecting Data Node */}
          <rect
            x="18"
            y="19"
            width="12"
            height="9"
            rx="3"
            fill="url(#tstackGradAccent)"
          />

          {/* Vertical Foundation Pillar */}
          <path
            d="M19 31C19 29.8954 19.8954 29 21 29H27C28.1046 29 29 29.8954 29 31V37C29 39.7614 26.7614 42 24 42C21.2386 42 19 39.7614 19 37V31Z"
            fill="url(#tstackGradPrimary)"
          />

          {/* Precision Digital Brackets (Code angle accents) */}
          <path
            d="M11 23L6.5 27.5L11 32"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M37 23L41.5 27.5L37 32"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Pulsing Digital Infrastructure Core Dot */}
          <circle cx="24" cy="23.5" r="1.75" fill="#FFFFFF" />
        </g>
      )}
    </svg>
  )
}

export default function Logo({
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  iconSize = 34,
  href = '/',
}: LogoProps) {
  const isLight = theme === 'light'
  const isMonochrome = variant === 'monochrome'

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      <LogoSymbol size={iconSize} monochrome={isMonochrome} />
      
      {variant !== 'compact' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-black text-xl tracking-wider uppercase font-display transition-colors ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              TSTACK
            </span>
            <span
              className={`font-semibold text-xl tracking-widest ml-1 uppercase transition-colors ${
                isLight ? 'text-blue-600' : 'text-cyan-400'
              }`}
            >
              WEB
            </span>
          </div>
          <span
            className={`text-[9px] font-semibold tracking-[0.25em] uppercase mt-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Digital Solutions
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} aria-label="TSTACK WEB - Home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
