'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FolderKanban,
  CreditCard,
  LifeBuoy,
  LogOut,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Lock,
  Sparkles,
  FileText,
  UserCheck,
  AlertCircle,
} from 'lucide-react'
import {
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL,
} from '@/types/contact'

interface UserProfile {
  id: string
  email: string
  fullName: string
  company?: string
  phone?: string
  role: 'client' | 'admin'
  createdAt: string
}

interface Milestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface Order {
  id: string
  orderNumber: string
  serviceId: string
  serviceName: string
  description: string
  price: number
  currency: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'failed'
  assignedArchitect: string
  milestones: Milestone[]
  createdAt: string
}

interface SupportTicket {
  id: string
  ticketNumber: string
  subject: string
  category: string
  priority: string
  status: string
  createdAt: string
  messages: { message: string; createdAt: string; senderName: string }[]
}

const VERIFIED_SERVICE_PACKAGES = [
  {
    id: 'ai-automation-workflows',
    name: 'AI Automation & Workflows (Pipelines & API Sync)',
    defaultPrice: 1250,
    desc: 'End-to-end operational workflow automation, webhook orchestration, and CRM data synchronization.',
  },
  {
    id: 'custom-ai-agents-rag',
    name: 'Custom AI Agents & RAG Knowledge Systems',
    defaultPrice: 2850,
    desc: 'Autonomous AI customer support or research agents grounded on your proprietary business data.',
  },
  {
    id: 'nextjs-web-platform',
    name: 'Full-Stack Next.js Web Application & Portal',
    defaultPrice: 3900,
    desc: 'High-conversion production web platform, client dashboard, authentication, and Stripe integration.',
  },
  {
    id: 'crm-revops-architecture',
    name: 'CRM & Revenue Operations Architecture',
    defaultPrice: 1850,
    desc: 'Automated lead routing, multi-channel attribution, and executive reporting dashboards.',
  },
  {
    id: 'custom-enterprise-sprint',
    name: 'Custom Engineering Sprint (Bespoke Scope)',
    defaultPrice: 5000,
    desc: 'Dedicated architecture & engineering sprint led by Daniel Kylan Jacob and David Alison.',
  },
]

export default function ClientPortalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'new-order' | 'support'>('overview')

  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [clientNotifications, setClientNotifications] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // New Order Form State
  const [selectedPkg, setSelectedPkg] = useState(VERIFIED_SERVICE_PACKAGES[0])
  const [customPrice, setCustomPrice] = useState<number>(VERIFIED_SERVICE_PACKAGES[0].defaultPrice)
  const [orderDescription, setOrderDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('')

  // Payment Checkout Modal State
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'fiverr'>('stripe')
  const [cardHolderName, setCardHolderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Technical Architecture')
  const [ticketPriority, setTicketPriority] = useState('high')
  const [ticketMessage, setTicketMessage] = useState('')
  const [ticketSubmitting, setTicketSubmitting] = useState(false)
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('')

  useEffect(() => {
    checkSessionAndLoad()
  }, [])

  const checkSessionAndLoad = async () => {
    setLoadingAuth(true)
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (!data.success || !data.user) {
        router.replace('/portal/login')
        return
      }
      setUser(data.user)
      setCardHolderName(data.user.fullName)
      await fetchPortalData()
    } catch {
      router.replace('/portal/login')
    } finally {
      setLoadingAuth(false)
    }
  }

  const fetchPortalData = async () => {
    setLoadingData(true)
    try {
      const sessionId = localStorage.getItem('tstack_chat_session_id') || ''
      const [ordersRes, ticketsRes, notifRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/tickets'),
        fetch(`/api/notifications?sessionId=${encodeURIComponent(sessionId)}`),
      ])
      const ordersData = await ordersRes.json()
      const ticketsData = await ticketsRes.json()
      const notifData = await notifRes.json()

      if (ordersData.success) setOrders(ordersData.orders || [])
      if (ticketsData.success) setTickets(ticketsData.tickets || [])
      if (notifData.success) setClientNotifications(notifData.notifications || [])
    } catch (err) {
      console.error('Failed to load portal data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/portal/login')
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderSubmitting(true)
    setOrderSuccessMsg('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedPkg.id,
          serviceName: selectedPkg.name,
          price: customPrice,
          description: orderDescription.trim() || selectedPkg.desc,
          targetDate: targetDate || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrders((prev) => [data.order, ...prev])
        setOrderSuccessMsg(`Order ${data.order.orderNumber} initialized! Both owners have been notified.`)
        setOrderDescription('')
        setTimeout(() => {
          setOrderSuccessMsg('')
          setActiveTab('overview')
          setCheckoutOrder(data.order)
        }, 1200)
      }
    } finally {
      setOrderSubmitting(false)
    }
  }

  const handleProcessStripePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkoutOrder) return

    if (cardNumber.replace(/\s+/g, '').length < 12) {
      setPaymentError('Please enter a valid 16-digit card number.')
      return
    }
    if (!cardExpiry.includes('/')) {
      setPaymentError('Please enter expiration in MM/YY format.')
      return
    }
    if (cardCvc.length < 3) {
      setPaymentError('Please enter a valid 3 or 4-digit CVC code.')
      return
    }

    setPaymentProcessing(true)
    setPaymentError('')

    try {
      // 1. Create server-side PaymentIntent
      const intentRes = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: checkoutOrder.id }),
      })
      const intentData = await intentRes.json()

      if (!intentRes.ok || !intentData.success) {
        throw new Error(intentData.error || 'Could not initialize payment intent.')
      }

      // 2. Confirm payment and notify owners (d.jacobwebpro@gmail.com & baronwebpro@gmail.com)
      const confirmRes = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: checkoutOrder.id,
          transactionRef: intentData.paymentIntentId,
          provider: 'stripe',
          method: 'credit_card',
        }),
      })

      const confirmData = await confirmRes.json()
      if (!confirmRes.ok || !confirmData.success) {
        throw new Error(confirmData.error || 'Payment confirmation failed.')
      }

      setPaymentSuccess(true)
      await fetchPortalData()
      setTimeout(() => {
        setPaymentSuccess(false)
        setCheckoutOrder(null)
        setCardNumber('')
        setCardExpiry('')
        setCardCvc('')
      }, 2000)
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setTicketSubmitting(true)
    setTicketSuccessMsg('')

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          category: ticketCategory,
          priority: ticketPriority,
          message: ticketMessage,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTickets((prev) => [data.ticket, ...prev])
        setTicketSubject('')
        setTicketMessage('')
        setTicketSuccessMsg(`Ticket ${data.ticket.ticketNumber} dispatched to Daniel Kylan Jacob & Baron!`)
      }
    } finally {
      setTicketSubmitting(false)
    }
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">VERIFYING AUTHENTICATED SESSION...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Bar */}
        <div className="pro-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                AUTHENTICATED CLIENT WORKSPACE
              </span>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono bg-blue-600 text-white hover:bg-blue-500"
                >
                  Switch to Owner Admin Console →
                </Link>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Welcome, {user?.fullName}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {user?.email} {user?.company ? `• ${user.company}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('new-order')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Commission New Project</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>My Projects &amp; Invoices ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new-order')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'new-order'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Configure &amp; Place Order</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'support'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Architect Support Tickets ({tickets.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ORDERS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Direct Architect Messages & Notifications Bar */}
            {clientNotifications.length > 0 && (
              <div className="pro-card p-5 border border-blue-500/40 bg-blue-950/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <h3 className="text-sm font-bold text-white">
                      Messages &amp; Project Updates from TSTACK Architects ({clientNotifications.length})
                    </h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {clientNotifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-blue-300">
                          {n.title}
                        </div>
                        <p className="text-xs text-slate-200">{n.message}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="pro-card p-10 text-center space-y-5 border border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h2 className="text-lg font-semibold text-white">
                    No Active Orders Yet
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Your account is newly registered and clean—we never pre-fill fake demo orders. Commission your first AI automation, custom LLM agent, or web platform below.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('new-order')}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    Configure Your First Order →
                  </button>
                  <a
                    href={FIVERR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Or Order via Fiverr Escrow</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="pro-card p-6 border border-slate-800/90 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-400">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950/70 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {order.paymentStatus === 'paid' ? 'PAID & VERIFIED' : 'UNPAID INVOICE'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 text-slate-300 border border-slate-700">
                            Status: {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                          {order.serviceName}
                        </h3>
                        <p className="text-xs text-slate-400">{order.description}</p>
                      </div>

                      <div className="flex flex-col sm:items-end justify-between gap-2">
                        <div className="text-xl font-bold text-white font-mono">
                          ${order.price.toLocaleString()} {order.currency}
                        </div>
                        {order.paymentStatus !== 'paid' ? (
                          <button
                            type="button"
                            onClick={() => setCheckoutOrder(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Invoice Now →</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Receipt Issued
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Milestones Progress */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>ENGINEERING MILESTONES</span>
                        <span>Assigned Lead: {order.assignedArchitect}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {order.milestones.map((ms, i) => (
                          <div
                            key={ms.id}
                            className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono text-slate-400">
                                GATE 0{i + 1}
                              </span>
                              <span
                                className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                  ms.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : ms.status === 'in_progress'
                                    ? 'bg-blue-950 text-blue-400'
                                    : 'bg-slate-900 text-slate-500'
                                }`}
                              >
                                {ms.status}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-200">
                              {ms.title}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {ms.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLACE NEW ORDER */}
        {activeTab === 'new-order' && (
          <div className="pro-card p-6 sm:p-8 border border-slate-800/90 max-w-3xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Commission a New Engineering Order
              </h2>
              <p className="text-xs text-slate-400">
                Select a verified service architecture below. Submitting an order initializes your milestone gates and notifies Daniel Kylan Jacob and Baron immediately.
              </p>
            </div>

            {orderSuccessMsg && (
              <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{orderSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="space-y-2.5">
                <label className="block text-xs font-medium text-slate-300">
                  1. Select Service Track
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {VERIFIED_SERVICE_PACKAGES.map((pkg) => {
                    const isSelected = selectedPkg.id === pkg.id
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          setSelectedPkg(pkg)
                          setCustomPrice(pkg.defaultPrice)
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          isSelected
                            ? 'bg-blue-950/30 border-blue-500 text-white'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-semibold text-white">
                            {pkg.name}
                          </div>
                          <p className="text-xs text-slate-400">{pkg.desc}</p>
                        </div>
                        <div className="text-sm font-mono font-bold text-blue-400 shrink-0">
                          ${pkg.defaultPrice.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Agreed Project Budget (USD) <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Delivery Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Project Requirements, Tech Stack &amp; Deliverable Scope
                </label>
                <textarea
                  rows={4}
                  required
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  placeholder="Describe your integration endpoints, desired workflows, or web application specifications..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={orderSubmitting}
                className="w-full py-3 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
              >
                {orderSubmitting
                  ? 'Initializing Order & Notifying Architects...'
                  : `Confirm Order ($${customPrice.toLocaleString()} USD) & Proceed to Payment →`}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ARCHITECT SUPPORT TICKETS */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 pro-card p-6 border border-slate-800/90 space-y-4">
              <h2 className="text-base font-bold text-white">
                Open Priority Architect Ticket
              </h2>
              <p className="text-xs text-slate-400">
                Dispatches an immediate notification to Daniel Kylan Jacob (d.jacobwebpro@gmail.com) and Baron (baronwebpro@gmail.com).
              </p>

              {ticketSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs">
                  {ticketSuccessMsg}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subject <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="API Webhook / Milestone Review"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      <option>Technical Architecture</option>
                      <option>Billing &amp; Escrow</option>
                      <option>Milestone Delivery</option>
                      <option>Urgent Bug / Hotfix</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Detailed Message <span className="text-blue-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Explain how we can help..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  {ticketSubmitting ? 'Sending...' : 'Submit Priority Ticket →'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 pro-card p-6 border border-slate-800/90 space-y-4">
              <h2 className="text-base font-bold text-white">
                Your Support Ticket Log ({tickets.length})
              </h2>
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No support tickets opened yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {t.ticketNumber}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                          {t.status} • {t.priority}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white">{t.subject}</div>
                      <p className="text-xs text-slate-400">{t.messages[0]?.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CHECKOUT & ESCROW PAYMENT MODAL */}
      {checkoutOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400">
                  VERIFIED PAYMENT GATEWAY
                </span>
                <h3 className="text-lg font-bold text-white">
                  Invoice {checkoutOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOrder(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  {checkoutOrder.serviceName}
                </div>
                <div className="text-[11px] text-slate-400">
                  Client: {user?.fullName} ({user?.email})
                </div>
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400">
                ${checkoutOrder.price.toLocaleString()} USD
              </div>
            </div>

            {/* Payment Channel Selector */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  paymentMethod === 'stripe'
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Stripe Card Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('fiverr')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  paymentMethod === 'fiverr'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Fiverr Milestone Escrow</span>
              </button>
            </div>

            {paymentMethod === 'stripe' ? (
              paymentSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Payment Verified &amp; Receipt Dispatched!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Order {checkoutOrder.orderNumber} is now PAID. Confirmation sent to d.jacobwebpro@gmail.com &amp; baronwebpro@gmail.com.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleProcessStripePayment} className="space-y-3.5">
                  {paymentError && (
                    <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                      {paymentError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Card Number (16 Digits)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="08/28"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-lg"
                  >
                    {paymentProcessing
                      ? 'Verifying Stripe PaymentIntent...'
                      : `Authorize & Pay $${checkoutOrder.price.toLocaleString()} USD`}
                  </button>
                </form>
              )
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prefer Fiverr Milestone Escrow? You can fund your order directly on our verified Fiverr Pro Gigs and reference order number{' '}
                  <strong className="text-white">{checkoutOrder.orderNumber}</strong>:
                </p>
                <div className="space-y-2">
                  <a
                    href={FIVERR_GIG_AUTOMATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Fund on AI Automation Fiverr Gig</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href={FIVERR_GIG_AGENTS_WEB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Fund on AI Agents &amp; Web Fiverr Gig</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
