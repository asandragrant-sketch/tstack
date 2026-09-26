'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldAlert,
  Users,
  FolderKanban,
  DollarSign,
  MessageSquare,
  Bell,
  Mail,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  RefreshCw,
  ArrowUpRight,
  Lock,
} from 'lucide-react'

export default function AdminOwnerConsolePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginEmail, setLoginEmail] = useState('d.jacobwebpro@gmail.com')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [activeSection, setActiveSection] = useState<
    'overview' | 'orders' | 'conversations' | 'inquiries' | 'clients'
  >('overview')

  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    verifyAdminSession()
  }, [])

  const verifyAdminSession = async () => {
    setAuthLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.success && data.user && data.user.role === 'admin') {
        setUser(data.user)
        await fetchAllAdminTelemetry()
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.user.role !== 'admin') {
          setLoginError('Access denied. Only authorized owners (d.jacobwebpro@gmail.com & baronwebpro@gmail.com) may enter this console.')
          return
        }
        setUser(data.user)
        await fetchAllAdminTelemetry()
      } else {
        setLoginError(data.error || 'Invalid owner credentials.')
      }
    } catch {
      setLoginError('Network error during authentication.')
    }
  }

  const fetchAllAdminTelemetry = async () => {
    setRefreshing(true)
    try {
      const [statsRes, clientsRes, convRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/clients'),
        fetch('/api/admin/conversations'),
        fetch('/api/orders'),
      ])
      const statsData = await statsRes.json()
      const clientsData = await clientsRes.json()
      const convData = await convRes.json()
      const ordersData = await ordersRes.json()

      if (statsData.success) {
        setStats(statsData.stats)
        setInquiries(statsData.recentInquiries || [])
        setTickets(statsData.recentTickets || [])
        setNotifications(statsData.recentNotifications || [])
      }
      if (clientsData.success) setClients(clientsData.clients || [])
      if (convData.success) setConversations(convData.conversations || [])
      if (ordersData.success) setOrders(ordersData.orders || [])
    } catch (err) {
      console.error('Failed to load admin telemetry:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          ...(paymentStatus && { paymentStatus }),
        }),
      })
      if (res.ok) {
        await fetchAllAdminTelemetry()
      }
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-950 text-xs font-mono text-slate-400">
        VERIFYING OWNER SECURITY CLEARANCE...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-md pro-card p-7 sm:p-8 space-y-6 border border-slate-800 shadow-2xl">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-[10px] font-mono">
              <Lock className="w-3 h-3" />
              <span>OWNER &amp; LEAD ARCHITECT COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Executive Admin Login</h1>
            <p className="text-xs text-slate-400">
              Restricted to authorized TSTACK owners: <strong>d.jacobwebpro@gmail.com</strong> &amp;{' '}
              <strong>baronwebpro@gmail.com</strong>.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Executive Passkey
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg"
            >
              Authenticate Owner Session →
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Executive Header */}
        <div className="pro-card p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 border border-blue-500/40 text-blue-400">
                EXECUTIVE TELEMETRY &amp; CONTROL
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                ● Dual-Owner Notifications Active (d.jacobwebpro &amp; baronwebpro)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              TSTACK Owner Command Console
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Authenticated as {user.fullName} ({user.email})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchAllAdminTelemetry}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium"
            >
              <span>Client View</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-300 text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="pro-card p-4 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Verified Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              ${(stats?.totalRevenue || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Stripe &amp; Escrow Paid</div>
          </div>

          <div className="pro-card p-4 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Orders</span>
              <FolderKanban className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {stats?.totalOrders || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {stats?.activeOrders || 0} active in sprint
            </div>
          </div>

          <div className="pro-card p-4 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Registered Clients</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {stats?.totalClients || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Verified Accounts</div>
          </div>

          <div className="pro-card p-4 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>AI Escalations</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {stats?.escalatedChatsCount || 0}
            </div>
            <div className="text-[10px] text-amber-400 font-mono">
              Out of {stats?.totalChats || 0} AI Sessions
            </div>
          </div>

          <div className="pro-card p-4 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Contact &amp; Tickets</span>
              <Mail className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {(stats?.totalInquiries || 0) + (stats?.openTicketsCount || 0)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {stats?.totalInquiries || 0} Form / {stats?.openTicketsCount || 0} Tickets
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: `Activity & Dispatch Log (${notifications.length})` },
            { id: 'orders', label: `Orders & Milestones (${orders.length})` },
            { id: 'conversations', label: `AI Support Transcripts (${conversations.length})` },
            { id: 'inquiries', label: `Inquiries & Tickets (${inquiries.length + tickets.length})` },
            { id: 'clients', label: `Clients Directory (${clients.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: ACTIVITY & EMAIL DISPATCH FEED */}
        {activeSection === 'overview' && (
          <div className="pro-card p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                Dual-Owner Notification &amp; System Event Feed
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Routed to: d.jacobwebpro@gmail.com, baronwebpro@gmail.com
              </span>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No recent system notifications logged yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/60 text-blue-400 border border-blue-500/30">
                          {n.type}
                        </span>
                        <span className="text-xs font-semibold text-white">{n.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">{n.message}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: ORDERS & MILESTONES */}
        {activeSection === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="pro-card p-8 text-center text-xs text-slate-500">
                No orders recorded yet.
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="pro-card p-5 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {o.orderNumber}
                        </span>
                        <span className="text-xs text-white font-semibold">
                          {o.serviceName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                          {o.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Client: {o.clientName} ({o.clientEmail})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-400 mr-2">
                        ${o.price.toLocaleString()} USD
                      </span>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>

                      {o.paymentStatus !== 'paid' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(o.id, 'in_progress', 'paid')}
                          className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{o.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* SECTION 3: AI CONVERSATIONS & ESCALATIONS */}
        {activeSection === 'conversations' && (
          <div className="space-y-4">
            {conversations.length === 0 ? (
              <div className="pro-card p-8 text-center text-xs text-slate-500">
                No AI chat sessions recorded yet.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  className={`pro-card p-5 border space-y-3 ${
                    c.isEscalated ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        Session: {c.sessionId}
                      </span>
                      {c.isEscalated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950 text-amber-400 border border-amber-500/40">
                          ESCALATED TO OWNERS
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {c.clientName || 'Visitor'} ({c.clientEmail || 'No email'})
                    </span>
                  </div>

                  {c.escalationReason && (
                    <div className="text-xs text-amber-300 font-mono">
                      Reason: {c.escalationReason}
                    </div>
                  )}

                  <div className="space-y-2 max-h-60 overflow-y-auto p-3 rounded-lg bg-slate-950 border border-slate-900">
                    {c.messages?.map((m: any) => (
                      <div key={m.id} className="text-xs">
                        <strong
                          className={
                            m.sender === 'user'
                              ? 'text-blue-400'
                              : m.sender === 'system'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          [{m.sender.toUpperCase()}]:{' '}
                        </strong>
                        <span className="text-slate-300">{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SECTION 4: CONTACT INQUIRIES & SUPPORT TICKETS */}
        {activeSection === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pro-card p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">
                Website Contact Inquiries ({inquiries.length})
              </h3>
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{inq.fullName}</span>
                    <span className="font-mono text-emerald-400">{inq.budget}</span>
                  </div>
                  <div className="text-slate-400 font-mono">{inq.email} • {inq.service}</div>
                  <p className="text-slate-300 pt-1">{inq.message}</p>
                </div>
              ))}
            </div>

            <div className="pro-card p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">
                Client Support Tickets ({tickets.length})
              </h3>
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-400">{t.ticketNumber}</span>
                    <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                      {t.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-white">{t.subject}</div>
                  <div className="text-slate-400 font-mono">{t.clientName} ({t.clientEmail})</div>
                  <p className="text-slate-300">{t.messages?.[0]?.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: REGISTERED CLIENTS DIRECTORY */}
        {activeSection === 'clients' && (
          <div className="pro-card p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clients.map((cl) => (
                  <tr key={cl.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-semibold text-white">{cl.fullName}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{cl.email}</td>
                    <td className="py-3 px-4 text-slate-400">{cl.company}</td>
                    <td className="py-3 px-4 font-mono text-blue-400">{cl.totalOrders}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      ${(cl.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(cl.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
