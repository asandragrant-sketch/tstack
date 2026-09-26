'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Activity, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function AdminSystemHealthPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/system-health')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || 'Admin authentication required.')
        } else {
          setData(json)
        }
      })
      .catch(() => setError('Failed to load system diagnostics.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 pt-28 px-4 text-center space-y-4">
        <p className="text-sm text-red-400">{error || 'Unauthorized'}</p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          ← Sign In at Owner Command Center
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase">
              PRODUCTION TELEMETRY &amp; DIAGNOSTICS
            </span>
            <h1 className="text-2xl font-bold text-white">TSTACK System Health Center</h1>
          </div>
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Console</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.services?.map((s: any) => (
            <div
              key={s.id}
              className="pro-card p-5 border border-slate-800 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.summary}</p>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded shrink-0 ${
                  s.status === 'GREEN'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : s.status === 'YELLOW'
                    ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    : 'bg-red-950 text-red-400 border border-red-500/40'
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="pro-card p-6 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">Recent Email Delivery Logs</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.recentEmailLogs?.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{log.subject}</span>
                    <span className="text-[10px] font-mono uppercase text-blue-400">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">
                    Provider: {log.provider} • {new Date(log.createdAt).toLocaleString()}
                  </p>
                  {log.errorMessage && (
                    <p className="text-[11px] text-amber-300">{log.errorMessage}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pro-card p-6 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">Recent System Audit Logs</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.recentAuditLogs?.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                >
                  <p className="text-white font-medium">{log.summary}</p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {log.actorEmail} ({log.actorRole}) • {log.action} •{' '}
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
