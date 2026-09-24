import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 text-center">
      <div className="max-w-md mx-auto space-y-5">
        <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
          404 ERROR
        </span>

        <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
          The page you requested does not exist or has been relocated within our site structure.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
          >
            View Services
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-900 text-xs text-slate-500 font-mono">
          <span>Need assistance? Email </span>
          <a href="mailto:davidalisonwebpro@gmail.com" className="text-slate-400 hover:text-white underline">
            davidalisonwebpro@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}
