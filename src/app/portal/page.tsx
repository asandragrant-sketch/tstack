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
  UploadCloud,
  Download,
  Calendar,
  Star,
  Receipt,
  ClipboardList,
  Trash2,
  Printer,
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

interface OrderRequirements {
  projectTitle: string
  businessDescription: string
  targetAudience: string
  featuresRequired: string
  designPreferences: string
  competitorExamples: string
  deadlineGoals: string
  domainHostingDetails: string
  apiCredentialsOrNotes: string
  submittedAt: string
  updatedAt: string
}

interface Order {
  id: string
  orderNumber: string
  serviceId: string
  serviceName: string
  description: string
  price: number
  currency: string
  status:
    | 'order_created'
    | 'payment_pending'
    | 'requirements_pending'
    | 'in_progress'
    | 'review'
    | 'revision'
    | 'completed'
    | 'cancelled'
    | 'pending'
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'failed'
  progressPercent?: number
  assignedArchitect: string
  milestones: Milestone[]
  requirements?: OrderRequirements
  activityHistory?: { id: string; actor: string; message: string; createdAt: string }[]
  createdAt: string
}

interface ProjectFile {
  id: string
  orderId?: string
  userId: string
  uploadedByRole: 'client' | 'owner'
  uploadedByName: string
  fileName: string
  fileType: string
  fileSize: number
  category: 'requirement' | 'asset' | 'deliverable' | 'invoice'
  dataUrl: string
  notes?: string
  createdAt: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  orderNumber: string
  clientName: string
  clientEmail: string
  serviceName: string
  amount: number
  currency: string
  status: 'paid' | 'unpaid' | 'refunded'
  paymentMethod: string
  transactionRef: string
  issuedAt: string
  paidAt?: string
}

interface Appointment {
  id: string
  clientName: string
  clientEmail: string
  serviceInterest: string
  date: string
  timeSlot: string
  timezone: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  meetingLink?: string
  notes?: string
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
  messages: { message: string; createdAt: string; senderName: string; senderRole?: string }[]
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

const LIFECYCLE_STEPS = [
  { key: 'order_created', label: 'Order Created' },
  { key: 'payment_pending', label: 'Payment' },
  { key: 'requirements_pending', label: 'Requirements' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Under Review' },
  { key: 'completed', label: 'Completed' },
]

export default function ClientPortalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'new-order' | 'files' | 'invoices' | 'appointments' | 'reviews' | 'support'
  >('overview')

  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [bookedSlots, setBookedSlots] = useState<{ date: string; timeSlot: string }[]>([])

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authCompany, setAuthCompany] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')

  // New Order states
  const [selectedServiceId, setSelectedServiceId] = useState(VERIFIED_SERVICE_PACKAGES[0].id)
  const [customBudget, setCustomBudget] = useState<number>(VERIFIED_SERVICE_PACKAGES[0].defaultPrice)
  const [orderBrief, setOrderBrief] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccessMessage, setOrderSuccessMessage] = useState('')

  // Payment Checkout Modal
  const [payingOrder, setPayingOrder] = useState<Order | null>(null)
  const [paymentChannel, setPaymentChannel] = useState<'fiverr_escrow' | 'manual_invoice' | 'stripe'>('fiverr_escrow')
  const [paymentReferenceInput, setPaymentReferenceInput] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentStatusMsg, setPaymentStatusMsg] = useState('')
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('')

  // Requirements Modal
  const [reqOrder, setReqOrder] = useState<Order | null>(null)
  const [reqForm, setReqForm] = useState({
    projectTitle: '',
    businessDescription: '',
    targetAudience: '',
    featuresRequired: '',
    designPreferences: '',
    competitorExamples: '',
    deadlineGoals: '',
    domainHostingDetails: '',
    apiCredentialsOrNotes: '',
  })
  const [reqSubmitting, setReqSubmitting] = useState(false)
  const [reqSuccess, setReqSuccess] = useState('')

  // File Upload states
  const [fileOrderId, setFileOrderId] = useState('')
  const [fileCategory, setFileCategory] = useState<'requirement' | 'asset'>('asset')
  const [fileNotes, setFileNotes] = useState('')
  const [fileUploading, setFileUploading] = useState(false)
  const [fileMsg, setFileMsg] = useState('')

  // Appointment states
  const [apptTopic, setApptTopic] = useState('Enterprise AI & Full-Stack Web Architecture')
  const [apptDate, setApptDate] = useState('')
  const [apptTimeSlot, setApptTimeSlot] = useState('14:00 UTC')
  const [apptTimezone, setApptTimezone] = useState('UTC / EST')
  const [apptNotes, setApptNotes] = useState('')
  const [apptSubmitting, setApptSubmitting] = useState(false)
  const [apptSuccess, setApptSuccess] = useState('')

  // Review states
  const [reviewOrderId, setReviewOrderId] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewRole, setReviewRole] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')

  // Support Ticket states
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Architecture & Engineering')
  const [ticketPriority, setTicketPriority] = useState('high')
  const [ticketMessage, setTicketMessage] = useState('')
  const [ticketSubmitting, setTicketSubmitting] = useState(false)
  const [ticketSuccess, setTicketSuccess] = useState('')
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null)
  const [replyTicketText, setReplyTicketText] = useState('')

  // Printable Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const fetchDashboardData = async () => {
    try {
      const [meRes, ordersRes, ticketsRes, filesRes, invoicesRes, apptsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/orders'),
        fetch('/api/support/tickets'),
        fetch('/api/files'),
        fetch('/api/invoices'),
        fetch('/api/appointments'),
      ])

      const meData = await meRes.json()
      if (meRes.ok && meData.authenticated) {
        setUser(meData.user)
      } else {
        setUser(null)
      }

      if (ordersRes.ok) {
        const oData = await ordersRes.json()
        setOrders(oData.orders || [])
      }

      if (ticketsRes.ok) {
        const tData = await ticketsRes.json()
        setTickets(tData.tickets || [])
      }

      if (filesRes.ok) {
        const fData = await filesRes.json()
        setFiles(fData.files || [])
      }

      if (invoicesRes.ok) {
        const iData = await invoicesRes.json()
        setInvoices(iData.invoices || [])
      }

      if (apptsRes.ok) {
        const aData = await apptsRes.json()
        setAppointments(aData.appointments || [])
        setBookedSlots(aData.bookedSlots || [])
      }
    } catch (err) {
      console.error('Error loading portal data:', err)
    } finally {
      setLoadingAuth(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab') as any
      if (
        tabParam &&
        ['overview', 'new-order', 'files', 'invoices', 'appointments', 'reviews', 'support'].includes(tabParam)
      ) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthNotice('')
    setAuthLoading(true)

    try {
      if (authMode === 'reset') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            resetToken
              ? { action: 'confirm', token: resetToken, newPassword: resetNewPassword }
              : { action: 'request', email: authEmail }
          ),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          if (data.verificationToken && !resetToken) {
            setResetToken(data.verificationToken)
            setAuthNotice(`Reset token generated: ${data.verificationToken}. Enter a new password below.`)
          } else {
            setAuthNotice(data.message || 'Password updated. Please sign in.')
            setAuthMode('login')
            setResetToken('')
            setResetNewPassword('')
          }
        } else {
          setAuthError(data.error || 'Password reset failed.')
        }
        setAuthLoading(false)
        return
      }

      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload =
        authMode === 'login'
          ? { email: authEmail, password: authPassword }
          : {
              email: authEmail,
              password: authPassword,
              fullName: authName,
              company: authCompany,
              phone: authPhone,
            }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setUser(data.user)
        await fetchDashboardData()
      } else {
        setAuthError(data.error || 'Authentication failed.')
      }
    } catch {
      setAuthError('Network error occurred.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setOrders([])
    setTickets([])
  }

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id)
    const found = VERIFIED_SERVICE_PACKAGES.find((p) => p.id === id)
    if (found) {
      setCustomBudget(found.defaultPrice)
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderBrief.trim()) return

    setOrderSubmitting(true)
    setOrderSuccessMessage('')

    const pkg = VERIFIED_SERVICE_PACKAGES.find((p) => p.id === selectedServiceId)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          serviceName: pkg?.name || 'Custom Engineering Sprint',
          description: orderBrief,
          price: customBudget,
          currency: 'USD',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setOrders((prev) => [data.order, ...prev])
        setOrderBrief('')
        setOrderSuccessMessage(
          `Order ${data.order.orderNumber} created! Next step: complete your Project Requirements form or fund the order via Verified Escrow.`
        )
        setPayingOrder(data.order)
      }
    } catch (err) {
      console.error('Order creation error:', err)
    } finally {
      setOrderSubmitting(false)
    }
  }

  const handlePaymentConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payingOrder) return

    setPaymentProcessing(true)
    setPaymentErrorMsg('')
    setPaymentStatusMsg('')

    try {
      if (paymentChannel === 'stripe') {
        const intentRes = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: payingOrder.id }),
        })
        const intentData = await intentRes.json()
        if (!intentRes.ok || !intentData.stripeConfigured) {
          setPaymentErrorMsg(
            intentData.error ||
              'Direct Stripe card processing requires STRIPE_SECRET_KEY in environment variables. Please use Verified Fiverr Milestone Escrow or submit a wire/escrow reference below.'
          )
          setPaymentProcessing(false)
          return
        }
      }

      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: payingOrder.id,
          provider: paymentChannel,
          transactionRef: paymentReferenceInput.trim(),
          submitReferenceOnly: true,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setPaymentStatusMsg(data.message)
        setPaymentReferenceInput('')
        await fetchDashboardData()
      } else {
        setPaymentErrorMsg(data.error || 'Failed to submit payment verification.')
      }
    } catch {
      setPaymentErrorMsg('Network error submitting payment reference.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  const openRequirementsModal = (order: Order) => {
    setReqOrder(order)
    setReqSuccess('')
    setReqForm({
      projectTitle: order.requirements?.projectTitle || order.serviceName,
      businessDescription: order.requirements?.businessDescription || '',
      targetAudience: order.requirements?.targetAudience || '',
      featuresRequired: order.requirements?.featuresRequired || order.description || '',
      designPreferences: order.requirements?.designPreferences || '',
      competitorExamples: order.requirements?.competitorExamples || '',
      deadlineGoals: order.requirements?.deadlineGoals || '',
      domainHostingDetails: order.requirements?.domainHostingDetails || '',
      apiCredentialsOrNotes: order.requirements?.apiCredentialsOrNotes || '',
    })
  }

  const handleSubmitRequirements = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqOrder) return
    setReqSubmitting(true)
    setReqSuccess('')
    try {
      const res = await fetch(`/api/orders/${reqOrder.id}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqForm),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setReqSuccess(data.message)
        await fetchDashboardData()
        setTimeout(() => setReqOrder(null), 1200)
      }
    } finally {
      setReqSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileUploading(true)
    setFileMsg('')

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const res = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: fileOrderId || orders[0]?.id || undefined,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            fileSize: file.size,
            category: fileCategory,
            dataUrl: String(reader.result || ''),
            notes: fileNotes,
          }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setFileMsg('✓ File uploaded securely to your Project File Center.')
          setFileNotes('')
          await fetchDashboardData()
        } else {
          setFileMsg(`Error: ${data.error || 'Upload failed'}`)
        }
      } catch {
        setFileMsg('Error uploading file.')
      } finally {
        setFileUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteFile = async (id: string) => {
    await fetch(`/api/files?id=${id}`, { method: 'DELETE' })
    await fetchDashboardData()
  }

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setApptSubmitting(true)
    setApptSuccess('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceInterest: apptTopic,
          date: apptDate,
          timeSlot: apptTimeSlot,
          timezone: apptTimezone,
          notes: apptNotes,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setApptSuccess(data.message)
        setApptNotes('')
        await fetchDashboardData()
      } else {
        setApptSuccess(`Error: ${data.error || 'Failed to schedule call'}`)
      }
    } finally {
      setApptSubmitting(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewSubmitting(true)
    setReviewSuccess('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: reviewOrderId || orders[0]?.id,
          rating: reviewRating,
          roleOrCompany: reviewRole || user?.company || 'Verified Client',
          comment: reviewComment,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setReviewSuccess(data.message)
        setReviewComment('')
      } else {
        setReviewSuccess(`Error: ${data.error || 'Could not submit review'}`)
      }
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) return

    setTicketSubmitting(true)
    setTicketSuccess('')

    try {
      const res = await fetch('/api/support/tickets', {
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
        setTicketSuccess(
          `Support ticket ${data.ticket.ticketNumber} opened. Our engineering team will reply here.`
        )
      }
    } catch (err) {
      console.error('Support ticket error:', err)
    } finally {
      setTicketSubmitting(false)
    }
  }

  const handleReplyTicket = async (ticketId: string) => {
    if (!replyTicketText.trim()) return
    await fetch('/api/support/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, replyMessage: replyTicketText }),
    })
    setReplyTicketText('')
    setReplyTicketId(null)
    await fetchDashboardData()
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Authenticating TSTACK Client Workspace...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4">
        <div className="max-w-md mx-auto pro-card p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              TSTACK Client Portal
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage project orders, submit requirements, exchange deliverables, download invoices, and message Daniel Kylan Jacob &amp; Baron.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login')
                setAuthError('')
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                authMode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register')
                setAuthError('')
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                authMode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('reset')
                setAuthError('')
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                authMode === 'reset' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reset Password
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authNotice && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300">
              {authNotice}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Company</label>
                    <input
                      type="text"
                      value={authCompany}
                      onChange={(e) => setAuthCompany(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+1 555-0000"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address <span className="text-blue-400">*</span>
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
              />
            </div>

            {authMode !== 'reset' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password <span className="text-blue-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>
            )}

            {authMode === 'reset' && resetToken && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Reset Token</label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              {authLoading
                ? 'Processing...'
                : authMode === 'login'
                ? 'Sign In to Client Portal →'
                : authMode === 'register'
                ? 'Create Client Account →'
                : resetToken
                ? 'Confirm New Password →'
                : 'Generate Password Reset Token →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="pro-card p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                <UserCheck className="w-3.5 h-3.5" />
                AUTHENTICATED WORKSPACE
              </span>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Open Owner Admin Console →
                </Link>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user.fullName}</h1>
            <p className="text-xs text-slate-400 font-mono">
              {user.email} {user.company ? `• ${user.company}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'overview', label: `Orders (${orders.length})`, icon: FolderKanban },
                { id: 'new-order', label: 'New Order', icon: PlusCircle },
                { id: 'files', label: `File Center (${files.length})`, icon: UploadCloud },
                { id: 'invoices', label: `Invoices (${invoices.length})`, icon: Receipt },
                { id: 'appointments', label: `Discovery Calls (${appointments.length})`, icon: Calendar },
                { id: 'reviews', label: 'Submit Review', icon: Star },
                { id: 'support', label: `Support (${tickets.length})`, icon: LifeBuoy },
              ] as const
            ).map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === t.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Requirements Modal */}
        {reqOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl pro-card p-6 border border-blue-500/40 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase">
                    PROJECT REQUIREMENTS SPECIFICATION • {reqOrder.orderNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white">{reqOrder.serviceName}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReqOrder(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close ✕
                </button>
              </div>

              {reqSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                  {reqSuccess}
                </div>
              )}

              <form onSubmit={handleSubmitRequirements} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={reqForm.projectTitle}
                      onChange={(e) => setReqForm({ ...reqForm, projectTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Target Deadline / Timeline Goals</label>
                    <input
                      type="text"
                      value={reqForm.deadlineGoals}
                      onChange={(e) => setReqForm({ ...reqForm, deadlineGoals: e.target.value })}
                      placeholder="e.g. Launch within 3 weeks"
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Business Description &amp; Core Objectives *</label>
                  <textarea
                    rows={2}
                    required
                    value={reqForm.businessDescription}
                    onChange={(e) => setReqForm({ ...reqForm, businessDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Required Features, Integrations &amp; Workflows *</label>
                  <textarea
                    rows={3}
                    required
                    value={reqForm.featuresRequired}
                    onChange={(e) => setReqForm({ ...reqForm, featuresRequired: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={reqForm.targetAudience}
                      onChange={(e) => setReqForm({ ...reqForm, targetAudience: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Design Preferences / Reference Sites</label>
                    <input
                      type="text"
                      value={reqForm.designPreferences}
                      onChange={(e) => setReqForm({ ...reqForm, designPreferences: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Domain &amp; Hosting Details</label>
                    <input
                      type="text"
                      value={reqForm.domainHostingDetails}
                      onChange={(e) => setReqForm({ ...reqForm, domainHostingDetails: e.target.value })}
                      placeholder="e.g. Vercel / AWS / Custom Domain"
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">API Notes / Technical Constraints</label>
                    <input
                      type="text"
                      value={reqForm.apiCredentialsOrNotes}
                      onChange={(e) => setReqForm({ ...reqForm, apiCredentialsOrNotes: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={reqSubmitting}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  {reqSubmitting ? 'Saving Requirements...' : 'Submit Project Requirements to Architects →'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Honest Payment Settlement Modal */}
        {payingOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg pro-card p-6 border border-blue-500/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                    VERIFIED ORDER FUNDING
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Order {payingOrder.orderNumber} — ${payingOrder.price.toLocaleString()} USD
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPayingOrder(null)
                    setPaymentStatusMsg('')
                    setPaymentErrorMsg('')
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close ✕
                </button>
              </div>

              {paymentStatusMsg ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Payment Reference Logged</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{paymentStatusMsg}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPayingOrder(null)
                      setPaymentStatusMsg('')
                    }}
                    className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Return to Workspace
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePaymentConfirm} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('fiverr_escrow')}
                      className={`p-3 rounded-lg border text-left text-xs font-semibold ${
                        paymentChannel === 'fiverr_escrow'
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      1. Verified Fiverr Milestone Escrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('manual_invoice')}
                      className={`p-3 rounded-lg border text-left text-xs font-semibold ${
                        paymentChannel === 'manual_invoice'
                          ? 'bg-blue-950/40 border-blue-500 text-blue-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      2. Bank Wire / Direct Invoice
                    </button>
                  </div>

                  {paymentChannel === 'fiverr_escrow' && (
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Fund your milestone safely via our verified Fiverr Escrow profile, then enter your Fiverr Order ID below so Daniel Kylan Jacob &amp; Baron can verify it and issue your official invoice (`INV-YYYY-XXXX`).
                      </p>
                      <a
                        href={FIVERR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        <span>Open Verified Fiverr Escrow Checkout</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {paymentErrorMsg && (
                    <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-300">
                      {paymentErrorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      {paymentChannel === 'fiverr_escrow'
                        ? 'Your Fiverr Order Number (e.g. FO829A...)'
                        : 'Wire Transfer / Invoice Reference ID'}{' '}
                      *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentReferenceInput}
                      onChange={(e) => setPaymentReferenceInput(e.target.value)}
                      placeholder="Enter reference for Owner verification"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    {paymentProcessing
                      ? 'Submitting Reference...'
                      : 'Submit Payment Reference for Owner Verification →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Printable Invoice Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    OFFICIAL RECEIPT &amp; TAX INVOICE
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedInvoice.invoiceNumber}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-2.5 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 uppercase font-mono text-[10px]">Issued By</p>
                  <p className="text-white font-semibold">TSTACK Web &amp; AI Engineering</p>
                  <p className="text-slate-400">Daniel Kylan Jacob &amp; Baron</p>
                  <p className="text-slate-400">d.jacobwebpro@gmail.com</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 uppercase font-mono text-[10px]">Billed To</p>
                  <p className="text-white font-semibold">{selectedInvoice.clientName}</p>
                  <p className="text-slate-400">{selectedInvoice.clientEmail}</p>
                  <p className="text-slate-400">Order: {selectedInvoice.orderNumber}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{selectedInvoice.serviceName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Ref: {selectedInvoice.transactionRef} • Method: {selectedInvoice.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">
                    ${selectedInvoice.amount.toLocaleString()} {selectedInvoice.currency}
                  </p>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW & LIFECYCLE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="pro-card p-10 text-center space-y-4 border border-slate-800">
                <FolderKanban className="w-8 h-8 text-blue-400 mx-auto" />
                <h3 className="text-lg font-semibold text-white">No Active Engineering Orders Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Launch a new AI automation, custom RAG agent, or full-stack Next.js application order to track milestones, upload files, and collaborate with Daniel Kylan Jacob &amp; Baron.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('new-order')}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Configure New Project Order →
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const currentStepIndex = Math.max(
                  0,
                  LIFECYCLE_STEPS.findIndex((s) => s.key === order.status)
                )
                return (
                  <div key={order.id} className="pro-card p-6 border border-slate-800 space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-500/30">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                            Status: {order.status.replace(/_/g, ' ')}
                          </span>
                          <span
                            className={`text-xs font-mono uppercase px-2.5 py-0.5 rounded border ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white pt-1">{order.serviceName}</h3>
                        <p className="text-xs text-slate-400">
                          Lead Architect: <strong className="text-slate-200">{order.assignedArchitect}</strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="text-right mr-2">
                          <span className="text-xl font-bold text-white">
                            ${order.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">{order.currency}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openRequirementsModal(order)}
                          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>{order.requirements ? 'Update Requirements' : 'Submit Requirements'}</span>
                        </button>
                        {order.paymentStatus !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => setPayingOrder(order)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Fund / Verify Payment</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lifecycle Progress Stepper */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {LIFECYCLE_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIndex || order.status === 'completed'
                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-lg border text-center ${
                              isDone
                                ? 'bg-blue-950/30 border-blue-500/40 text-blue-300'
                                : 'bg-slate-900/50 border-slate-800 text-slate-500'
                            }`}
                          >
                            <p className="text-[10px] font-mono uppercase">{step.label}</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Milestones */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {order.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{m.title}</span>
                            {m.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{m.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Activity History */}
                    {order.activityHistory && order.activityHistory.length > 0 && (
                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
                        <p className="text-[10px] font-mono text-slate-400 uppercase">
                          Order Activity Timeline
                        </p>
                        {order.activityHistory.slice(-4).map((act) => (
                          <div key={act.id} className="text-xs text-slate-300 flex items-center justify-between">
                            <span>• {act.message}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(act.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* TAB 2: NEW ORDER */}
        {activeTab === 'new-order' && (
          <div className="max-w-3xl mx-auto pro-card p-6 sm:p-8 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white">Configure New Engineering Order</h2>
            {orderSuccessMessage && (
              <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300">
                {orderSuccessMessage}
              </div>
            )}
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Select Service Architecture Package
                </label>
                <div className="space-y-2">
                  {VERIFIED_SERVICE_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleServiceSelect(pkg.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                        selectedServiceId === pkg.id
                          ? 'bg-blue-950/30 border-blue-500'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{pkg.name}</p>
                        <p className="text-[11px] text-slate-400">{pkg.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-blue-400">
                        ${pkg.defaultPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Scope &amp; Technical Goals *
                </label>
                <textarea
                  rows={4}
                  required
                  value={orderBrief}
                  onChange={(e) => setOrderBrief(e.target.value)}
                  placeholder="Describe your target features, workflows, and timeline..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={orderSubmitting}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                {orderSubmitting ? 'Creating Order...' : 'Initialize Project Order →'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECT FILE CENTER */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                <span>Upload Project File / Asset</span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload PDFs, design screenshots, logos, specifications, or ZIP archives (up to 4.5MB).
              </p>
              {fileMsg && (
                <div className="p-3 rounded-lg bg-slate-900 border border-blue-500/40 text-xs text-blue-300">
                  {fileMsg}
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-300 mb-1">Associated Order</label>
                <select
                  value={fileOrderId}
                  onChange={(e) => setFileOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <option value="">General Workspace</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.serviceName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={fileNotes}
                  onChange={(e) => setFileNotes(e.target.value)}
                  placeholder="e.g. Brand kit & API documentation"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
              <label className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                <span>{fileUploading ? 'Uploading...' : 'Select File to Upload'}</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="lg:col-span-2 pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Project Files &amp; Deliverables Vault</h3>
              {files.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  No project files or deliverables uploaded yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{f.fileName}</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                              f.uploadedByRole === 'owner'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {f.uploadedByRole === 'owner' ? 'Owner Deliverable' : 'Client Upload'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Uploaded by {f.uploadedByName} • {(f.fileSize / 1024).toFixed(1)} KB •{' '}
                          {new Date(f.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={f.dataUrl}
                          download={f.fileName}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(f.id)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: INVOICES & RECEIPTS */}
        {activeTab === 'invoices' && (
          <div className="pro-card p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Verified Invoices &amp; Receipts</h3>
            {invoices.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                Invoices (INV-YYYY-XXXX) are automatically generated when order payments are verified.
              </p>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-xs text-white font-semibold">{inv.serviceName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Order: {inv.orderNumber} • Issued: {new Date(inv.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">
                        ${inv.amount.toLocaleString()} {inv.currency}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        View / Print Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DISCOVERY CALLS & APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Schedule 1-on-1 Discovery Call</span>
              </h3>
              {apptSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                  {apptSuccess}
                </div>
              )}
              <form onSubmit={handleBookAppointment} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Consultation Topic *</label>
                  <select
                    value={apptTopic}
                    onChange={(e) => setApptTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option>Enterprise AI &amp; Full-Stack Web Architecture</option>
                    <option>Custom AI Agents &amp; RAG Systems</option>
                    <option>CRM &amp; Workflow Automation Sprint</option>
                    <option>Ongoing Project Milestone Review</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Time Slot *</label>
                    <select
                      value={apptTimeSlot}
                      onChange={(e) => setApptTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      {['13:00 UTC', '14:00 UTC', '15:00 UTC', '16:00 UTC', '17:00 UTC', '19:00 UTC'].map(
                        (slot) => {
                          const isTaken = bookedSlots.some(
                            (b) => b.date === apptDate && b.timeSlot === slot
                          )
                          return (
                            <option key={slot} value={slot} disabled={isTaken}>
                              {slot} {isTaken ? '(Booked)' : '(Available)'}
                            </option>
                          )
                        }
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Your Timezone</label>
                  <input
                    type="text"
                    value={apptTimezone}
                    onChange={(e) => setApptTimezone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Agenda / Notes</label>
                  <textarea
                    rows={2}
                    value={apptNotes}
                    onChange={(e) => setApptNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={apptSubmitting}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  {apptSubmitting ? 'Scheduling...' : 'Confirm Discovery Call →'}
                </button>
              </form>
            </div>

            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Your Scheduled Calls</h3>
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">No scheduled calls yet.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((a) => (
                    <div key={a.id} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{a.serviceInterest}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30">
                          {a.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        {a.date} at {a.timeSlot} ({a.timezone})
                      </p>
                      {a.meetingLink && (
                        <a
                          href={a.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline pt-1"
                        >
                          <span>Join Meeting Link</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SUBMIT VERIFIED REVIEW */}
        {activeTab === 'reviews' && (
          <div className="max-w-xl mx-auto pro-card p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Submit Verified Project Review</span>
            </h3>
            {reviewSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                {reviewSuccess}
              </div>
            )}
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Select Completed / Active Order</label>
                <select
                  value={reviewOrderId}
                  onChange={(e) => setReviewOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.serviceName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Star Rating (1–5)</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <option value={5}>★★★★★ (5/5 — Exceptional)</option>
                  <option value={4}>★★★★☆ (4/5 — Very Good)</option>
                  <option value={3}>★★★☆☆ (3/5 — Satisfactory)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Title / Company</label>
                <input
                  type="text"
                  value={reviewRole}
                  onChange={(e) => setReviewRole(e.target.value)}
                  placeholder="e.g. CTO, FinTech Labs"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Review *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience working with Daniel Kylan Jacob & Baron..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Verified Review →'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: TWO-WAY SUPPORT & MESSAGING */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Open Direct Support Thread</h3>
              {ticketSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                  {ticketSuccess}
                </div>
              )}
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  {ticketSubmitting ? 'Sending...' : 'Send Message to Engineering Lead →'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 pro-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Active Support Threads</h3>
              {tickets.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">No support threads yet.</p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-blue-400 font-bold">
                          {t.ticketNumber} • {t.subject}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t.status}
                        </span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {t.messages.map((m, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg text-xs ${
                              m.senderRole === 'admin'
                                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-100'
                                : 'bg-slate-950 border border-slate-800 text-slate-300'
                            }`}
                          >
                            <p className="text-[10px] font-mono text-slate-400 mb-1">{m.senderName}</p>
                            <p>{m.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyTicketId === t.id ? replyTicketText : ''}
                          onChange={(e) => {
                            setReplyTicketId(t.id)
                            setReplyTicketText(e.target.value)
                          }}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleReplyTicket(t.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
