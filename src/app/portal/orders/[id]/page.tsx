'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, CreditCard, ShieldCheck } from 'lucide-react'

export default function OrderDetailViewPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`)
        const data = await res.json()
        if (res.ok && data.success) {
          setOrder(data.order)
        } else {
          router.replace('/portal')
        }
      } catch {
        router.replace('/portal')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-950 text-xs font-mono text-slate-400">
        LOADING ORDER MILESTONES...
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Client Portal Dashboard</span>
        </Link>

        <div className="pro-card p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">
                  {order.orderNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  {order.paymentStatus}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {order.serviceName}
              </h1>
              <p className="text-xs text-slate-400">{order.description}</p>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              ${order.price.toLocaleString()} {order.currency}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">
              Project Milestone Gates ({order.assignedArchitect})
            </h2>
            <div className="space-y-3">
              {order.milestones?.map((m: any, idx: number) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-white">
                      Gate 0{idx + 1}: {m.title}
                    </div>
                    <p className="text-xs text-slate-400">{m.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
