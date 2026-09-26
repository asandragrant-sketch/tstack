'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  DollarSign,
  FolderKanban,
  Users,
  MessageSquare,
  LifeBuoy,
  Bell,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UploadCloud,
  Calendar,
  Star,
  Activity,
  FileText,
  Receipt,
  LogOut,
  Send,
  UserCheck,
  Download,
  ExternalLink,
} from 'lucide-react'

type AdminTab =
  | 'overview'
  | 'crm'
  | 'orders'
  | 'ai'
  | 'support'
  | 'files'
  | 'payments'
  | 'appointments'
  | 'health'

const CRM_STAGES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
] as const

const ORDER_STATUSES = [
  'order_created',
  'payment_pending',
  'requirements_pending',
  'in_progress',
  'review',
  'revision',
  'completed',
  'cancelled',
] as const

export default function AdminCommandCenter() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  // Login states (no hardcoded passwords displayed anywhere)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  // Dashboard Datasets
  const [stats, setStats] = useState<any>({})
  const [orders, setOrders] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [projectFiles, setProjectFiles] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [emailLogs, setEmailLogs] = useState<any[]>([])
  const [healthServices, setHealthServices] = useState<any[]>([])

  // Action states
  const [actionBanner, setActionBanner] = useState('')
  const [chatReplyMap, setChatReplyMap] = useState<Record<string, string>>({})
  const [ticketReplyMap, setTicketReplyMap] = useState<Record<string, string>>({})
  const [meetingLinkMap, setMeetingLinkMap] = useState<Record<string, string>>({})
  const [deliverableOrderId, setDeliverableOrderId] = useState('')
  const [deliverableNotes, setDeliverableNotes] = useState('')

  // Email settings state
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState('465')
  const [smtpUser, setSmtpUser] = useState('d.jacobwebpro@gmail.com')
  const [smtpPass, setSmtpPass] = useState('')
  const [resendKey, setResendKey] = useState('')

  const fetchAdminAll = async () => {
    try {
      const meRes = await fetch('/api/auth/me')
      const meData = await meRes.json()
      if (!meRes.ok || !meData.authenticated || meData.user?.role !== 'admin') {
        setUser(null)
        setLoading(false)
        return
      }
      setUser(meData.user)

      const [statsRes, healthRes, emailSettingsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/system-health'),
        fetch('/api/admin/email-settings'),
      ])

      if (statsRes.ok) {
        const sData = await statsRes.json()
        setStats(sData.stats || {})
        setOrders(sData.recentOrders || [])
        setLeads(sData.leads || [])
        setInquiries(sData.recentInquiries || [])
        setConversations(sData.recentConversations || [])
        setTickets(sData.recentTickets || [])
        setPayments(sData.recentPayments || [])
        setInvoices(sData.invoices || [])
        setAppointments(sData.appointments || [])
        setReviews(sData.reviews || [])
        setProjectFiles(sData.projectFiles || [])
        setAuditLogs(sData.auditLogs || [])
        setEmailLogs(sData.emailDeliveryLogs || [])
      }

      if (healthRes.ok) {
        const hData = await healthRes.json()
        setHealthServices(hData.services || [])
      }

      if (emailSettingsRes.ok) {
        const eData = await emailSettingsRes.json()
        if (eData.settings) {
          setSmtpHost(eData.settings.smtpHost || 'smtp.gmail.com')
          setSmtpPort(eData.settings.smtpPort || '465')
          setSmtpUser(eData.settings.smtpUser || 'd.jacobwebpro@gmail.com')
        }
      }
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminAll()
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab') as AdminTab
      if (tabParam) setActiveTab(tabParam)
    }
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok && data.success && data.user?.role === 'admin') {
        setUser(data.user)
        setLoginPassword('')
        await fetchAdminAll()
      } else {
        setLoginError(data.error || 'Authorized Owner credentials required.')
      }
    } catch {
      setLoginError('Network error during authentication.')
    } finally {
      setLoginSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const notifyAction = (msg: string) => {
    setActionBanner(msg)
    setTimeout(() => setActionBanner(''), 4000)
  }

  const handleLeadStageUpdate = async (id: string, stage: string, assignedOwner?: string) => {
    await fetch('/api/admin/crm', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stage, assignedOwner }),
    })
    notifyAction(`Lead stage updated to ${stage.toUpperCase()}`)
    await fetchAdminAll()
  }

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    notifyAction(`Order status updated to ${status.toUpperCase()}`)
    await fetchAdminAll()
  }

  const handleVerifyOrderPayment = async (orderId: string) => {
    const res = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        provider: 'manual_invoice',
        method: 'owner_verified',
        transactionRef: `VERIFIED_OWNER_${Date.now().toString(36).toUpperCase()}`,
      }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      notifyAction(data.message || 'Payment verified & Invoice issued.')
      await fetchAdminAll()
    }
  }

  const handleToggleChatTakeover = async (sessionId: string, humanTakeover: boolean) => {
    await fetch('/api/admin/chat-takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action: 'toggle', humanTakeover }),
    })
    notifyAction(
      humanTakeover
        ? 'Live Owner Takeover activated — AI automated replies paused for this session.'
        : 'Session returned to AI Assistant.'
    )
    await fetchAdminAll()
  }

  const handleSendChatReply = async (sessionId: string) => {
    const text = chatReplyMap[sessionId]?.trim()
    if (!text) return
    await fetch('/api/admin/chat-takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action: 'reply', replyText: text }),
    })
    setChatReplyMap((prev) => ({ ...prev, [sessionId]: '' }))
    notifyAction('Live reply delivered to visitor chat widget.')
    await fetchAdminAll()
  }

  const handleReplySupportTicket = async (ticketId: string) => {
    const text = ticketReplyMap[ticketId]?.trim()
    if (!text) return
    await fetch('/api/support/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, replyMessage: text, status: 'in_progress' }),
    })
    setTicketReplyMap((prev) => ({ ...prev, [ticketId]: '' }))
    notifyAction('Reply sent to Client Portal support thread.')
    await fetchAdminAll()
  }

  const handleUploadDeliverable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: deliverableOrderId || orders[0]?.id,
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          fileSize: file.size,
          category: 'deliverable',
          dataUrl: String(reader.result || ''),
          notes: deliverableNotes || 'Official Engineering Deliverable',
        }),
      })
      setDeliverableNotes('')
      notifyAction(`Deliverable "${file.name}" uploaded to Client Portal.`)
      await fetchAdminAll()
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateAppointment = async (id: string, status: string) => {
    await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        status,
        meetingLink: meetingLinkMap[id] || undefined,
      }),
    })
    notifyAction(`Appointment marked ${status.toUpperCase()}.`)
    await fetchAdminAll()
  }

  const handleModerateReview = async (id: string, status: 'approved' | 'rejected') => {
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    notifyAction(`Review ${status.toUpperCase()}.`)
    await fetchAdminAll()
  }

  const handleSaveEmailSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/email-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        resendApiKey: resendKey,
        sendTestEmail: true,
      }),
    })
    const data = await res.json()
    notifyAction(data.message || 'Email provider settings updated.')
    await fetchAdminAll()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4">
        <div className="max-w-md mx-auto pro-card p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white">TSTACK Owner Command Center</h1>
            <p className="text-xs text-slate-400">
              Restricted to authorized owners (Daniel Kylan Jacob &amp; Baron).
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Owner Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="d.jacobwebpro@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              {loginSubmitting ? 'Verifying RBAC Session...' : 'Sign In to Owner Command Center →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="pro-card p-6 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-500/30">
                OWNER COMMAND CENTER • RBAC VERIFIED
              </span>
              <Link
                href="/admin/system-health"
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:underline"
              >
                Live Diagnostics Page →
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              TSTACK Executive Operations Console
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Signed in as {user.fullName} ({user.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'crm', label: `CRM Pipeline (${leads.length})` },
                { id: 'orders', label: `Orders (${orders.length})` },
                { id: 'ai', label: `AI Queue (${conversations.length})` },
                { id: 'support', label: `Tickets & Inquiries (${tickets.length + inquiries.length})` },
                { id: 'files', label: `Files (${projectFiles.length})` },
                { id: 'payments', label: `Payments & Invoices (${invoices.length})` },
                { id: 'appointments', label: `Calls & Reviews (${appointments.length})` },
                { id: 'health', label: 'System Health & Logs' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === t.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-xs bg-slate-900 text-slate-400 hover:text-red-400 border border-slate-800"
            >
              Sign Out
            </button>
          </div>
        </div>

        {actionBanner && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 font-medium flex items-center justify-between">
            <span>✓ {actionBanner}</span>
          </div>
        )}

        {/* Dynamic Command Center KPI Cards (Clickable to open filtered views) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className="pro-card p-4 border border-slate-800 hover:border-emerald-500/50 text-left space-y-1 transition-all"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase">Verified Revenue</span>
            <p className="text-xl font-bold text-emerald-400">
              ${(stats.totalRevenue || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500">{invoices.length} Invoices Issued →</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className="pro-card p-4 border border-slate-800 hover:border-blue-500/50 text-left space-y-1 transition-all"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase">Active Projects</span>
            <p className="text-xl font-bold text-white">{stats.activeOrders || 0}</p>
            <span className="text-[10px] text-amber-400">
              {stats.pendingPaymentsCount || 0} Pending Payment →
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className="pro-card p-4 border border-slate-800 hover:border-blue-500/50 text-left space-y-1 transition-all"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase">CRM Lead Pipeline</span>
            <p className="text-xl font-bold text-blue-400">{stats.totalLeads || 0}</p>
            <span className="text-[10px] text-slate-500">
              {stats.qualifiedLeadsCount || 0} Qualified Leads →
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className="pro-card p-4 border border-slate-800 hover:border-amber-500/50 text-left space-y-1 transition-all"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase">AI Escalations</span>
            <p className="text-xl font-bold text-amber-400">{stats.escalatedChatsCount || 0}</p>
            <span className="text-[10px] text-slate-500">{conversations.length} Total Chats →</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className="pro-card p-4 border border-slate-800 hover:border-blue-500/50 text-left space-y-1 transition-all"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase">Open Tickets</span>
            <p className="text-xl font-bold text-white">{stats.openTicketsCount || 0}</p>
            <span className="text-[10px] text-slate-500">{inquiries.length} Contact Forms →</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="pro-card p-4 border border-slate-800 hover:border-emerald-500/50 text-left space-y-1 transition-all"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase">Discovery Calls</span>
            <p className="text-xl font-bold text-emerald-400">
              {stats.scheduledAppointmentsCount || 0}
            </p>
            <span className="text-[10px] text-slate-500">
              {stats.pendingReviewsCount || 0} Reviews Pending →
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Recent Audit Trail</h3>
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {auditLogs.slice(0, 12).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="text-white font-medium">{log.summary}</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        Actor: {log.actorEmail} ({log.actorRole}) • Action: {log.action}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Live Service Health Summary</h3>
              <div className="space-y-2.5">
                {healthServices.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{s.name}</p>
                      <p className="text-[11px] text-slate-400">{s.summary}</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                        s.status === 'GREEN'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'YELLOW'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-red-950 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRM LEAD PIPELINE */}
        {activeTab === 'crm' && (
          <div className="pro-card p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">CRM Lead Management Pipeline</h3>
                <p className="text-xs text-slate-400">
                  Automatically populated from Contact Form submissions, AI Lead Qualification, and Discovery Call bookings.
                </p>
              </div>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No CRM leads recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{lead.name}</span>
                        <span className="text-xs font-mono text-blue-400">{lead.email}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Source: {lead.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Service: <strong>{lead.serviceInterest}</strong>{' '}
                        {lead.budget ? `• Budget: ${lead.budget}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-400">{lead.notes}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleLeadStageUpdate(lead.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono uppercase"
                      >
                        {CRM_STAGES.map((st) => (
                          <option key={st} value={st}>
                            Stage: {st.toUpperCase()}
                          </option>
                        ))}
                      </select>

                      <select
                        value={lead.assignedOwner || 'd.jacobwebpro@gmail.com'}
                        onChange={(e) =>
                          handleLeadStageUpdate(lead.id, lead.stage, e.target.value)
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300"
                      >
                        <option value="d.jacobwebpro@gmail.com">Owner: Daniel Kylan Jacob</option>
                        <option value="baronwebpro@gmail.com">Owner: Baron</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS & REQUIREMENTS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="pro-card p-6 border border-slate-800 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {o.orderNumber}
                      </span>
                      <span className="text-sm font-bold text-white">{o.serviceName}</span>
                      <span className="text-xs font-mono text-emerald-400">
                        ${o.price.toLocaleString()} {o.currency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Client: {o.clientName || 'Client'} ({o.clientEmail || 'Portal User'})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    {o.paymentStatus !== 'paid' ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyOrderPayment(o.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        Verify Payment &amp; Issue Invoice →
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                        ✓ PAID &amp; INVOICED
                      </span>
                    )}
                  </div>
                </div>

                {o.requirements && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/30 space-y-2 text-xs">
                    <p className="text-blue-400 font-mono uppercase text-[10px] font-bold">
                      Client Submitted Project Requirements ({o.requirements.projectTitle})
                    </p>
                    <p className="text-slate-200">
                      <strong>Business &amp; Goals:</strong> {o.requirements.businessDescription}
                    </p>
                    <p className="text-slate-200">
                      <strong>Features Required:</strong> {o.requirements.featuresRequired}
                    </p>
                    <p className="text-slate-400">
                      <strong>Timeline:</strong> {o.requirements.deadlineGoals || 'Standard'} •{' '}
                      <strong>Domain/Hosting:</strong> {o.requirements.domainHostingDetails || 'TBD'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AI ESCALATIONS & LIVE HUMAN TAKEOVER */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            {conversations.map((c) => (
              <div key={c.id} className="pro-card p-6 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {c.clientName || 'Website Visitor'}
                      </span>
                      <span className="text-xs font-mono text-blue-400">
                        {c.clientEmail || c.sessionId}
                      </span>
                      {c.humanTakeover && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                          LIVE HUMAN TAKEOVER ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Reason: {c.escalationReason || 'AI Support Session'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleChatTakeover(c.sessionId, !c.humanTakeover)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                      c.humanTakeover
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {c.humanTakeover ? 'Return Session to AI Bot' : 'Take Over Conversation Live'}
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  {c.messages.slice(-8).map((m: any, idx: number) => (
                    <div key={idx} className="text-xs">
                      <span className="font-mono uppercase text-[10px] text-blue-400 mr-2">
                        [{m.sender}]:
                      </span>
                      <span className="text-slate-200">{m.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatReplyMap[c.sessionId] || ''}
                    onChange={(e) =>
                      setChatReplyMap((prev) => ({ ...prev, [c.sessionId]: e.target.value }))
                    }
                    placeholder="Send live owner reply directly to client chat window..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendChatReply(c.sessionId)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Send Live Reply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SUPPORT TICKETS & CONTACT INQUIRIES */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Client Support Threads</h3>
              {tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 font-bold">
                      {t.ticketNumber} • {t.subject}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{t.clientEmail}</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {t.messages.map((m: any, i: number) => (
                      <p key={i} className="text-xs text-slate-300">
                        <strong className="text-white">{m.senderName}:</strong> {m.message}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ticketReplyMap[t.id] || ''}
                      onChange={(e) =>
                        setTicketReplyMap((prev) => ({ ...prev, [t.id]: e.target.value }))
                      }
                      placeholder="Reply to client support ticket..."
                      className="flex-1 px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleReplySupportTicket(t.id)}
                      className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Direct Contact Briefs</h3>
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{inq.fullName}</span>
                    <span className="text-xs font-mono text-blue-400">{inq.email}</span>
                  </div>
                  <p className="text-xs text-emerald-400">
                    {inq.service} • {inq.budget}
                  </p>
                  <p className="text-xs text-slate-300">{inq.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROJECT FILE CENTER */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Upload Owner Deliverable</h3>
              <select
                value={deliverableOrderId}
                onChange={(e) => setDeliverableOrderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} — {o.serviceName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={deliverableNotes}
                onChange={(e) => setDeliverableNotes(e.target.value)}
                placeholder="Deliverable release notes..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <label className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                <span>Select Deliverable File to Upload</span>
                <input type="file" onChange={handleUploadDeliverable} className="hidden" />
              </label>
            </div>

            <div className="lg:col-span-2 pro-card p-6 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white">All Client &amp; Owner Project Files</h3>
              {projectFiles.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {f.fileName} ({f.uploadedByRole.toUpperCase()})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      By {f.uploadedByName} • {(f.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <a
                    href={f.dataUrl}
                    download={f.fileName}
                    className="px-3 py-1.5 rounded bg-slate-800 text-white text-xs"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENTS & INVOICES */}
        {activeTab === 'payments' && (
          <div className="pro-card p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Issued Invoices &amp; Verified Transactions</h3>
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 mr-2">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-xs font-semibold text-white">{inv.serviceName}</span>
                  <p className="text-[11px] text-slate-400">
                    Client: {inv.clientName} ({inv.clientEmail}) • Order: {inv.orderNumber} • Ref:{' '}
                    {inv.transactionRef}
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  ${inv.amount.toLocaleString()} {inv.currency}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: APPOINTMENTS & REVIEWS MODERATION */}
        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Scheduled Discovery Calls</h3>
              {appointments.map((a) => (
                <div key={a.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {a.clientName} ({a.clientEmail})
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-400">
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    {a.date} at {a.timeSlot} ({a.timezone}) — {a.serviceInterest}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={meetingLinkMap[a.id] || a.meetingLink || ''}
                      onChange={(e) =>
                        setMeetingLinkMap((prev) => ({ ...prev, [a.id]: e.target.value }))
                      }
                      placeholder="Paste Google Meet / Zoom URL..."
                      className="flex-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateAppointment(a.id, 'confirmed')}
                      className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Confirm Call
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Client Reviews Moderation</h3>
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {r.clientName} ({r.rating}★)
                    </span>
                    <span className="text-[10px] font-mono uppercase text-amber-400">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{r.comment}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleModerateReview(r.id, 'approved')}
                      className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerateReview(r.id, 'rejected')}
                      className="px-3 py-1 rounded bg-red-900/60 text-red-200 text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SYSTEM HEALTH & EMAIL LOGS */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">
                External Email Provider Configuration (SMTP / Resend)
              </h3>
              <form onSubmit={handleSaveEmailSettings} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">SMTP Port</label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">SMTP User</label>
                  <input
                    type="email"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Gmail App Password (SMTP_PASS)
                  </label>
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="16-character Google App Password"
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Or Resend API Key (RESEND_API_KEY)
                  </label>
                  <input
                    type="password"
                    value={resendKey}
                    onChange={(e) => setResendKey(e.target.value)}
                    placeholder="re_..."
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Save &amp; Dispatch Test Email to Owners →
                </button>
              </form>
            </div>

            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Truthful Email Delivery Logs</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {emailLogs.map((el) => (
                  <div
                    key={el.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{el.subject}</span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          el.status === 'delivered'
                            ? 'bg-emerald-950 text-emerald-400'
                            : el.status === 'unconfigured'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {el.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">
                      Provider: {el.provider} • To: {el.recipients?.join(', ')}
                    </p>
                    {el.errorMessage && (
                      <p className="text-[11px] text-amber-300/90">{el.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
