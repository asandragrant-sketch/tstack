import React from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow'
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
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden'

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 font-semibold tracking-wide',
    md: 'text-sm px-5 py-2.5 gap-2 tracking-wide',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold tracking-wide',
  }

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'bg-transparent hover:bg-blue-950/40 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/60 hover:-translate-y-0.5 active:translate-y-0',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
    glow:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0',
  }

  const content = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      <span>{children}</span>
      {icon && !loading && (
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
