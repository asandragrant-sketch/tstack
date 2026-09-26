import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import {
  User,
  ContactInquiry,
  Order,
  PaymentTransaction,
  ChatConversation,
  SupportTicket,
  ActivityNotification,
  EmailSettings,
} from './types'

interface DatabaseSchema {
  users: User[]
  contactInquiries: ContactInquiry[]
  orders: Order[]
  payments: PaymentTransaction[]
  conversations: ChatConversation[]
  tickets: SupportTicket[]
  notifications: ActivityNotification[]
  emailSettings?: EmailSettings
}

// Persistent storage path
const DATA_DIR = path.join(process.cwd(), '.data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

// In-memory cache for fast serverless performance
let cache: DatabaseSchema | null = null

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (err) {
    console.warn('[DB] Could not create .data directory (likely read-only serverless environment):', err)
  }
}

function getInitialData(): DatabaseSchema {
  // Pre-hashed password for initial admin credentials: AdminPassword2026!
  // Salt rounds: 10
  const salt = bcrypt.genSaltSync(10)
  const defaultAdminHash = bcrypt.hashSync('AdminPassword2026!', salt)

  const initialUsers: User[] = [
    {
      id: 'usr-admin-daniel',
      email: 'd.jacobwebpro@gmail.com',
      passwordHash: defaultAdminHash,
      fullName: 'Daniel Kylan Jacob',
      company: 'TSTACK Technologies',
      role: 'admin',
      createdAt: '2026-09-20T00:00:00Z',
    },
    {
      id: 'usr-admin-baron',
      email: 'baronwebpro@gmail.com',
      passwordHash: defaultAdminHash,
      fullName: 'Baron',
      company: 'TSTACK Technologies',
      role: 'admin',
      createdAt: '2026-09-20T00:00:00Z',
    },
  ]

  return {
    users: initialUsers,
    contactInquiries: [],
    orders: [],
    payments: [],
    conversations: [],
    tickets: [],
    notifications: [],
  }
}

function loadDB(): DatabaseSchema {
  if (cache) return cache

  ensureDataDir()

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8')
      cache = JSON.parse(raw)
      return cache!
    } catch (err) {
      console.error('[DB] Error parsing db.json, resetting to initial data:', err)
    }
  }

  cache = getInitialData()
  saveDB(cache)
  return cache
}

function saveDB(data: DatabaseSchema): void {
  cache = data
  try {
    ensureDataDir()
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[DB] File write failed (using memory store):', err)
  }
}

// ==================== USER OPERATIONS ====================

export async function getUsers(): Promise<User[]> {
  const db = loadDB()
  return db.users
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const db = loadDB()
  const cleanEmail = email.trim().toLowerCase()
  return db.users.find((u) => u.email.toLowerCase() === cleanEmail)
}

export async function findUserById(id: string): Promise<User | undefined> {
  const db = loadDB()
  return db.users.find((u) => u.id === id)
}

export async function createUser(data: {
  email: string
  password: string
  fullName: string
  company?: string
  phone?: string
  role?: 'client' | 'admin'
}): Promise<User> {
  const db = loadDB()
  const cleanEmail = data.email.trim().toLowerCase()

  if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists.')
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(data.password, salt)

  const newUser: User = {
    id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    passwordHash,
    fullName: data.fullName.trim(),
    company: data.company?.trim(),
    phone: data.phone?.trim(),
    role: data.role || 'client',
    createdAt: new Date().toISOString(),
  }

  db.users.push(newUser)
  saveDB(db)
  return newUser
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User | null> {
  const db = loadDB()
  const index = db.users.findIndex((u) => u.id === id)
  if (index === -1) return null

  db.users[index] = { ...db.users[index], ...updates }
  saveDB(db)
  return db.users[index]
}

// ==================== CONTACT INQUIRIES ====================

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  const db = loadDB()
  return [...db.contactInquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function createContactInquiry(data: {
  fullName: string
  email: string
  phone?: string
  company?: string
  service: string
  budget: string
  message: string
}): Promise<ContactInquiry> {
  const db = loadDB()
  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim(),
    company: data.company?.trim(),
    service: data.service.trim(),
    budget: data.budget.trim(),
    message: data.message.trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  }

  db.contactInquiries.push(newInquiry)
  saveDB(db)
  return newInquiry
}

// ==================== ORDER OPERATIONS ====================

export async function getOrders(userId?: string): Promise<Order[]> {
  const db = loadDB()
  let list = db.orders
  if (userId) {
    list = list.filter((o) => o.userId === userId)
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = loadDB()
  return db.orders.find((o) => o.id === id || o.orderNumber === id)
}

export async function createOrder(data: {
  userId: string
  clientName: string
  clientEmail: string
  serviceId: string
  serviceName: string
  description: string
  price: number
  currency?: string
  assignedArchitect?: string
  milestones?: { title: string; description: string }[]
  targetDate?: string
}): Promise<Order> {
  const db = loadDB()
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

  const defaultMilestones = data.milestones?.map((m, idx) => ({
    id: `ms-${idx + 1}`,
    title: m.title,
    description: m.description,
    status: 'pending' as const,
  })) || [
    {
      id: 'ms-1',
      title: 'Architecture & System Specification',
      description: 'System schema, API contract definitions, and sprint milestones lock.',
      status: 'pending' as const,
    },
    {
      id: 'ms-2',
      title: 'Core Development & Integration',
      description: 'Implementation of automated pipelines, models, or web application.',
      status: 'pending' as const,
    },
    {
      id: 'ms-3',
      title: 'QA Testing & Escrow Delivery',
      description: 'End-to-end sandbox verification and production deployment.',
      status: 'pending' as const,
    },
  ]

  const newOrder: Order = {
    id: `ord-${Date.now().toString(36)}`,
    orderNumber,
    userId: data.userId,
    clientName: data.clientName,
    clientEmail: data.clientEmail.toLowerCase(),
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    description: data.description,
    price: data.price,
    currency: data.currency || 'USD',
    status: 'pending',
    paymentStatus: 'unpaid',
    assignedArchitect: data.assignedArchitect || 'Daniel Kylan Jacob & David Alison',
    milestones: defaultMilestones,
    targetDate: data.targetDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.orders.push(newOrder)
  saveDB(db)
  return newOrder
}

export async function updateOrder(
  id: string,
  updates: Partial<Omit<Order, 'id' | 'orderNumber' | 'createdAt'>>
): Promise<Order | null> {
  const db = loadDB()
  const index = db.orders.findIndex((o) => o.id === id || o.orderNumber === id)
  if (index === -1) return null

  db.orders[index] = {
    ...db.orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveDB(db)
  return db.orders[index]
}

// ==================== PAYMENT TRANSACTIONS ====================

export async function getPayments(userId?: string): Promise<PaymentTransaction[]> {
  const db = loadDB()
  let list = db.payments
  if (userId) {
    list = list.filter((p) => p.userId === userId)
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function createPayment(data: {
  orderId: string
  userId: string
  amount: number
  currency?: string
  provider: 'stripe' | 'paypal' | 'fiverr' | 'wire'
  transactionRef: string
  status: 'succeeded' | 'failed' | 'refunded'
  errorMessage?: string
  metadata?: Record<string, any>
}): Promise<PaymentTransaction> {
  const db = loadDB()
  const newPayment: PaymentTransaction = {
    id: `pmt-${Date.now().toString(36)}`,
    orderId: data.orderId,
    userId: data.userId,
    amount: data.amount,
    currency: data.currency || 'USD',
    provider: data.provider,
    transactionRef: data.transactionRef,
    status: data.status,
    errorMessage: data.errorMessage,
    metadata: data.metadata,
    createdAt: new Date().toISOString(),
  }

  db.payments.push(newPayment)
  saveDB(db)
  return newPayment
}

// ==================== CHAT CONVERSATIONS ====================

export async function getConversations(): Promise<ChatConversation[]> {
  const db = loadDB()
  return [...db.conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export async function getConversationBySession(
  sessionId: string
): Promise<ChatConversation | undefined> {
  const db = loadDB()
  return db.conversations.find((c) => c.sessionId === sessionId)
}

export async function saveConversation(data: {
  sessionId: string
  userId?: string
  clientName?: string
  clientEmail?: string
  messages: { sender: 'user' | 'assistant' | 'system'; text: string }[]
  isEscalated?: boolean
  escalationReason?: string
}): Promise<ChatConversation> {
  const db = loadDB()
  const existingIndex = db.conversations.findIndex((c) => c.sessionId === data.sessionId)

  const formattedMessages = data.messages.map((m, idx) => ({
    id: `msg-${idx + 1}-${Date.now().toString(36)}`,
    sender: m.sender,
    text: m.text,
    timestamp: new Date().toISOString(),
  }))

  if (existingIndex !== -1) {
    const existing = db.conversations[existingIndex]
    const updated: ChatConversation = {
      ...existing,
      userId: data.userId || existing.userId,
      clientName: data.clientName || existing.clientName,
      clientEmail: data.clientEmail || existing.clientEmail,
      messages: formattedMessages,
      isEscalated: data.isEscalated !== undefined ? data.isEscalated : existing.isEscalated,
      escalationReason: data.escalationReason || existing.escalationReason,
      updatedAt: new Date().toISOString(),
    }
    db.conversations[existingIndex] = updated
    saveDB(db)
    return updated
  } else {
    const newConv: ChatConversation = {
      id: `conv-${Date.now().toString(36)}`,
      sessionId: data.sessionId,
      userId: data.userId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      messages: formattedMessages,
      isEscalated: !!data.isEscalated,
      escalationReason: data.escalationReason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.conversations.push(newConv)
    saveDB(db)
    return newConv
  }
}

// ==================== SUPPORT TICKETS ====================

export async function getSupportTickets(userId?: string): Promise<SupportTicket[]> {
  const db = loadDB()
  let list = db.tickets
  if (userId) {
    list = list.filter((t) => t.userId === userId)
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getTicketById(id: string): Promise<SupportTicket | undefined> {
  const db = loadDB()
  return db.tickets.find((t) => t.id === id || t.ticketNumber === id)
}

export async function createSupportTicket(data: {
  userId: string
  clientName: string
  clientEmail: string
  subject: string
  category: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  message: string
}): Promise<SupportTicket> {
  const db = loadDB()
  const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

  const newTicket: SupportTicket = {
    id: `tck-${Date.now().toString(36)}`,
    ticketNumber,
    userId: data.userId,
    clientName: data.clientName,
    clientEmail: data.clientEmail.toLowerCase(),
    subject: data.subject.trim(),
    category: data.category.trim(),
    priority: data.priority || 'medium',
    status: 'open',
    messages: [
      {
        id: `tmsg-1`,
        senderId: data.userId,
        senderName: data.clientName,
        isAdmin: false,
        message: data.message.trim(),
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.tickets.push(newTicket)
  saveDB(db)
  return newTicket
}

// ==================== ACTIVITY NOTIFICATIONS ====================

export async function getActivityNotifications(): Promise<ActivityNotification[]> {
  const db = loadDB()
  return [...db.notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function createActivityNotification(data: {
  type: ActivityNotification['type']
  title: string
  message: string
  data?: Record<string, any>
}): Promise<ActivityNotification> {
  const db = loadDB()
  const newNotification: ActivityNotification = {
    id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    type: data.type,
    title: data.title,
    message: data.message,
    data: data.data,
    isRead: false,
    createdAt: new Date().toISOString(),
  }

  db.notifications.push(newNotification)
  // Keep last 200 notifications to prevent unbounded growth
  if (db.notifications.length > 200) {
    db.notifications = db.notifications.slice(-200)
  }
  saveDB(db)
  return newNotification
}

// ==================== EMAIL TRANSPORT SETTINGS ====================

export async function getEmailSettings(): Promise<EmailSettings> {
  const db = loadDB()
  return (
    db.emailSettings || {
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: Number(process.env.SMTP_PORT) || 465,
      smtpUser: process.env.SMTP_USER || 'd.jacobwebpro@gmail.com',
      smtpPass: process.env.SMTP_PASS || '',
      resendApiKey: process.env.RESEND_API_KEY || '',
      web3formsKey: process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '',
    }
  )
}

export async function saveEmailSettings(settings: Partial<EmailSettings>): Promise<EmailSettings> {
  const db = loadDB()
  const current = await getEmailSettings()
  const updated: EmailSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  }
  db.emailSettings = updated
  saveDB(db)
  return updated
}

