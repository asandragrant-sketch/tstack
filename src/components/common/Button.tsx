import React from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'fiverr'
  size?: 'sm' | 'md' | 'lg'
  icon?: boolean
  loading?: boolean
  children: React.ReactNode
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon = false,
  loading = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed group'

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
  }

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-sm',
    secondary:
      'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80',
    outline:
      'bg-transparent hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white',
    // Glow variant now styled as clean high-contrast primary to replace previous neon effects
    glow:
      'bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-sm',
    fiverr:
      'bg-[#1dbf73] hover:bg-[#19a463] text-white font-medium shadow-sm',
  }

  const content = (
    <>
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      <span>{children}</span>
      {icon && !loading && (
        <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      )}
    </>
  )

  if (href) {
    const { onClick, target, rel, download } = props as any
    return (
      <Link
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        download={download}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      disabled={loading || props.disabled}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {content}
    </button>
  )
}
