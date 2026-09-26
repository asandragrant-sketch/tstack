'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/portal')
        }
        router.refresh()
      } else {
        setError(data.error || 'Invalid credentials. Please register if you do not have an account.')
      }
    } catch {
      setError('Network error while authenticating. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md pro-card p-7 sm:p-8 space-y-6 shadow-2xl border border-slate-800/90">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-400 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TSTACK CLIENT &amp; ARCHITECT PORTAL</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to Your Account</h1>
          <p className="text-xs text-slate-400">
            Access your active engineering sprints, milestone deliverables, invoices, and support channels.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Business Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <span>{loading ? 'Verifying Session...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-xs text-slate-400">
            New to TSTACK?{' '}
            <Link href="/portal/register" className="text-blue-400 hover:text-blue-300 font-semibold underline">
              Create a Client Account
            </Link>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Owners (Daniel Kylan Jacob &amp; Baron) may sign in above to enter the Admin Console.
          </p>
        </div>
      </div>
    </div>
  )
}
