import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import {
  User,
  PasswordResetToken,
  ContactInquiry,
  Lead,
  LeadStage,
  Order,
  OrderRequirements,
  ProjectFile,
  PaymentTransaction,
  Invoice,
  ChatConversation,
  SupportTicket,
  Appointment,
  Review,
  ActivityNotification,
  AuditLogEntry,
  EmailDeliveryLog,
  AnalyticsEvent,
  EmailSettings,
} from './types'

interface DatabaseSchema {
  users: User[]
  passwordResetTokens: PasswordResetToken[]
  contactInquiries: ContactInquiry[]
  leads: Lead[]
  orders: Order[]
  files: ProjectFile[]
  payments: PaymentTransaction[]
  invoices: Invoice[]
  conversations: ChatConversation[]
  tickets: SupportTicket[]
  appointments: Appointment[]
  reviews: Review[]
  notifications: ActivityNotification[]
  auditLogs: AuditLogEntry[]
  emailLogs: EmailDeliveryLog[]
  analyticsEvents: AnalyticsEvent[]
  emailSettings?: EmailSettings
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

let cache: DatabaseSchema | null = null

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (err) {
    console.warn('[DB] Read-only serverless filesystem detected, using memory state.')
  }
}

function getInitialData(): DatabaseSchema {
  // Use environment variable for initial admin password hash or generate from ADMIN_INITIAL_PASSWORD
  const initialSecret =
    process.env.ADMIN_INITIAL_PASSWORD ||
    process.env.JWT_SECRET ||
    'AdminPassword2026!'
  const defaultAdminHash =
    process.env.ADMIN_INITIAL_PASSWORD_HASH || bcrypt.hashSync(initialSecret, 10)

  const initialUsers: User[] = [
    {
      id: 'usr-admin-daniel',
      email: 'd.jacobwebpro@gmail.com',
      passwordHash: defaultAdminHash,
      fullName: 'Daniel Kylan Jacob',
      company: 'TSTACK Technologies',
      emailVerified: true,
      role: 'admin',
      createdAt: '2026-09-20T00:00:00Z',
    },
    {
      id: 'usr-admin-baron',
      email: 'baronwebpro@gmail.com',
      passwordHash: defaultAdminHash,
      fullName: 'Baron',
      company: 'TSTACK Technologies',
      emailVerified: true,
      role: 'admin',
      createdAt: '2026-09-20T00:00:00Z',
    },
  ]

  return {
    users: initialUsers,
    passwordResetTokens: [],
    contactInquiries: [],
    leads: [],
    orders: [],
    files: [],
    payments: [],
    invoices: [],
    conversations: [],
    tickets: [],
    appointments: [],
    reviews: [],
    notifications: [],
    auditLogs: [],
    emailLogs: [],
    analyticsEvents: [],
  }
}

function normalizeSchema(raw: Partial<DatabaseSchema>): DatabaseSchema {
  const init = getInitialData()
  return {
    users: Array.isArray(raw.users) && raw.users.length > 0 ? raw.users : init.users,
    passwordResetTokens: Array.isArray(raw.passwordResetTokens) ? raw.passwordResetTokens : [],
    contactInquiries: Array.isArray(raw.contactInquiries) ? raw.contactInquiries : [],
    leads: Array.isArray(raw.leads) ? raw.leads : [],
    orders: Array.isArray(raw.orders) ? raw.orders : [],
    files: Array.isArray(raw.files) ? raw.files : [],
    payments: Array.isArray(raw.payments) ? raw.payments : [],
    invoices: Array.isArray(raw.invoices) ? raw.invoices : [],
    conversations: Array.isArray(raw.conversations) ? raw.conversations : [],
    tickets: Array.isArray(raw.tickets) ? raw.tickets : [],
    appointments: Array.isArray(raw.appointments) ? raw.appointments : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    notifications: Array.isArray(raw.notifications) ? raw.notifications : [],
    auditLogs: Array.isArray(raw.auditLogs) ? raw.auditLogs : [],
    emailLogs: Array.isArray(raw.emailLogs) ? raw.emailLogs : [],
    analyticsEvents: Array.isArray(raw.analyticsEvents) ? raw.analyticsEvents : [],
    emailSettings: raw.emailSettings,
  }
}

function loadDB(): DatabaseSchema {
  if (cache) return cache

  ensureDataDir()

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8')
      cache = normalizeSchema(JSON.parse(raw))
      return cache
    } catch (err) {
      console.error('[DB] Error parsing db.json, re-initializing schema:', err)
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
  } catch {
    // Serverless read-only fallback
  }
}

// ==================== AUDIT LOGGING ====================

export async function createAuditLog(data: {
  actorId: string
  actorEmail: string
  actorRole: AuditLogEntry['actorRole']
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  ipAddress?: string
}): Promise<AuditLogEntry> {
  const db = loadDB()
  const entry: AuditLogEntry = {
    id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    actorId: data.actorId,
    actorEmail: data.actorEmail,
    actorRole: data.actorRole,
    action: data.action,
    resource: data.resource,
    resourceId: data.resourceId,
    metadata: data.metadata,
    ipAddress: data.ipAddress,
    timestamp: new Date().toISOString(),
  }
  db.auditLogs.push(entry)
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(-500)
  }
  saveDB(db)
  return entry
}

export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  const db = loadDB()
  return [...db.auditLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

// ==================== EMAIL DELIVERY LOGS ====================

export async function createEmailDeliveryLog(data: {
  recipient: string
  subject: string
  eventType: string
  provider: string
  status: 'delivered' | 'failed' | 'unconfigured'
  errorMessage?: string
}): Promise<EmailDeliveryLog> {
  const db = loadDB()
  const entry: EmailDeliveryLog = {
    id: `eml-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    recipient: data.recipient,
    subject: data.subject,
    eventType: data.eventType,
    provider: data.provider,
    status: data.status,
    errorMessage: data.errorMessage,
    timestamp: new Date().toISOString(),
  }
  db.emailLogs.push(entry)
  if (db.emailLogs.length > 300) {
    db.emailLogs = db.emailLogs.slice(-300)
  }
  saveDB(db)
  return entry
}

export async function getEmailDeliveryLogs(limit = 100): Promise<EmailDeliveryLog[]> {
  const db = loadDB()
  return [...db.emailLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

// ==================== ANALYTICS EVENTS ====================

export async function recordAnalyticsEvent(data: {
  eventType: AnalyticsEvent['eventType']
  path?: string
  sessionId?: string
  userId?: string
  metadata?: Record<string, any>
}): Promise<AnalyticsEvent> {
  const db = loadDB()
  const evt: AnalyticsEvent = {
    id: `anl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    eventType: data.eventType,
    path: data.path,
    sessionId: data.sessionId,
    userId: data.userId,
    metadata: data.metadata,
    timestamp: new Date().toISOString(),
  }
  db.analyticsEvents.push(evt)
  if (db.analyticsEvents.length > 1000) {
    db.analyticsEvents = db.analyticsEvents.slice(-1000)
  }
  saveDB(db)
  return evt
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const db = loadDB()
  return db.analyticsEvents
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
    emailVerified: false,
    role: data.role || 'client',
    createdAt: new Date().toISOString(),
  }

  db.users.push(newUser)
  saveDB(db)

  await createAuditLog({
    actorId: newUser.id,
    actorEmail: newUser.email,
    actorRole: newUser.role,
    action: 'Client registered account',
    resource: 'user',
    resourceId: newUser.id,
    metadata: { fullName: newUser.fullName, company: newUser.company },
  })

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

export async function createPasswordResetToken(email: string): Promise<PasswordResetToken | null> {
  const db = loadDB()
  const user = await findUserByEmail(email)
  if (!user) return null

  const token = `rst_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`
  const resetObj: PasswordResetToken = {
    token,
    userId: user.id,
    email: user.email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour
    used: false,
    createdAt: new Date().toISOString(),
  }
  db.passwordResetTokens.push(resetObj)
  saveDB(db)
  return resetObj
}

export async function consumePasswordResetToken(
  token: string,
  newPasswordPlain: string
): Promise<User | null> {
  const db = loadDB()
  const entry = db.passwordResetTokens.find(
    (t) => t.token === token && !t.used && new Date(t.expiresAt).getTime() > Date.now()
  )
  if (!entry) return null

  const user = db.users.find((u) => u.id === entry.userId)
  if (!user) return null

  const salt = await bcrypt.genSalt(10)
  user.passwordHash = await bcrypt.hash(newPasswordPlain, salt)
  entry.used = true
  saveDB(db)

  await createAuditLog({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'Completed password reset',
    resource: 'user',
    resourceId: user.id,
  })

  return user
}

// ==================== CRM LEAD PIPELINE ====================

export async function getLeads(): Promise<Lead[]> {
  const db = loadDB()
  return [...db.leads].sort(
    (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
  )
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  const db = loadDB()
  return db.leads.find((l) => l.id === id)
}

export async function upsertLead(data: {
  name: string
  email: string
  phone?: string
  company?: string
  source: Lead['source']
  serviceInterest: string
  budget?: string
  timeline?: string
  requirements?: string
  conversationSessionId?: string
  noteText?: string
  status?: LeadStage
}): Promise<Lead> {
  const db = loadDB()
  const cleanEmail = data.email.trim().toLowerCase()
  const existingIdx = db.leads.findIndex((l) => l.email.toLowerCase() === cleanEmail)

  if (existingIdx !== -1) {
    const existing = db.leads[existingIdx]
    const updatedNotes = [...existing.notes]
    if (data.noteText) {
      updatedNotes.push({
        id: `ln-${Date.now().toString(36)}`,
        author: 'System / AI',
        text: data.noteText,
        createdAt: new Date().toISOString(),
      })
    }

    const updated: Lead = {
      ...existing,
      name: data.name || existing.name,
      phone: data.phone || existing.phone,
      company: data.company || existing.company,
      serviceInterest: data.serviceInterest || existing.serviceInterest,
      budget: data.budget || existing.budget,
      timeline: data.timeline || existing.timeline,
      requirements: data.requirements || existing.requirements,
      conversationSessionId: data.conversationSessionId || existing.conversationSessionId,
      status: data.status || existing.status,
      notes: updatedNotes,
      lastActivityAt: new Date().toISOString(),
    }
    db.leads[existingIdx] = updated
    saveDB(db)
    return updated
  }

  const newLead: Lead = {
    id: `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    name: data.name.trim() || 'Prospective Client',
    email: cleanEmail,
    phone: data.phone?.trim(),
    company: data.company?.trim(),
    source: data.source,
    serviceInterest: data.serviceInterest.trim(),
    budget: data.budget?.trim(),
    timeline: data.timeline?.trim(),
    requirements: data.requirements?.trim(),
    conversationSessionId: data.conversationSessionId,
    notes: data.noteText
      ? [
          {
            id: `ln-1`,
            author: 'System',
            text: data.noteText,
            createdAt: new Date().toISOString(),
          },
        ]
      : [],
    assignedOwner: 'Daniel Kylan Jacob & Baron',
    status: data.status || 'new',
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  }

  db.leads.push(newLead)
  saveDB(db)
  return newLead
}

export async function updateLead(
  id: string,
  updates: {
    status?: LeadStage
    assignedOwner?: string
    budget?: string
    timeline?: string
    requirements?: string
    newNote?: { author: string; text: string }
  }
): Promise<Lead | null> {
  const db = loadDB()
  const idx = db.leads.findIndex((l) => l.id === id)
  if (idx === -1) return null

  const current = db.leads[idx]
  const notes = [...current.notes]
  if (updates.newNote && updates.newNote.text.trim()) {
    notes.push({
      id: `ln-${Date.now().toString(36)}`,
      author: updates.newNote.author,
      text: updates.newNote.text.trim(),
      createdAt: new Date().toISOString(),
    })
  }

  db.leads[idx] = {
    ...current,
    ...(updates.status && { status: updates.status }),
    ...(updates.assignedOwner && { assignedOwner: updates.assignedOwner }),
    ...(updates.budget !== undefined && { budget: updates.budget }),
    ...(updates.timeline !== undefined && { timeline: updates.timeline }),
    ...(updates.requirements !== undefined && { requirements: updates.requirements }),
    notes,
    lastActivityAt: new Date().toISOString(),
  }

  saveDB(db)
  return db.leads[idx]
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
  const lead = await upsertLead({
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    company: data.company,
    source: 'contact_form',
    serviceInterest: data.service,
    budget: data.budget,
    requirements: data.message,
    noteText: `Submitted Contact Form Inquiry (${data.service} | ${data.budget})`,
  })

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
    leadId: lead.id,
    createdAt: new Date().toISOString(),
  }

  db.contactInquiries.push(newInquiry)
  saveDB(db)

  await recordAnalyticsEvent({
    eventType: 'contact_submit',
    metadata: { service: data.service, budget: data.budget },
  })

  return newInquiry
}

// ==================== ORDER OPERATIONS & REQUIREMENTS ====================

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

  const now = new Date().toISOString()

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
    status: 'order_created',
    paymentStatus: 'unpaid',
    assignedArchitect: data.assignedArchitect || 'Daniel Kylan Jacob & David Alison',
    milestones: defaultMilestones,
    activityHistory: [
      {
        id: `act-1`,
        actorName: data.clientName,
        actorRole: 'client',
        action: `Order ${orderNumber} created for ${data.serviceName} ($${data.price.toLocaleString()} USD)`,
        timestamp: now,
      },
    ],
    targetDate: data.targetDate,
    createdAt: now,
    updatedAt: now,
  }

  db.orders.push(newOrder)
  saveDB(db)

  await createAuditLog({
    actorId: data.userId,
    actorEmail: data.clientEmail,
    actorRole: 'client',
    action: `Created Order ${orderNumber}`,
    resource: 'order',
    resourceId: newOrder.id,
    metadata: { serviceName: data.serviceName, price: data.price },
  })

  await recordAnalyticsEvent({
    eventType: 'order_created',
    userId: data.userId,
    metadata: { orderId: newOrder.id, amount: data.price },
  })

  return newOrder
}

export async function updateOrder(
  id: string,
  updates: Partial<Omit<Order, 'id' | 'orderNumber' | 'createdAt'>>,
  actor?: { name: string; email: string; role: 'client' | 'admin' | 'system' }
): Promise<Order | null> {
  const db = loadDB()
  const index = db.orders.findIndex((o) => o.id === id || o.orderNumber === id)
  if (index === -1) return null

  const existing = db.orders[index]
  const history = [...(existing.activityHistory || [])]

  if (updates.status && updates.status !== existing.status) {
    history.push({
      id: `act-${Date.now().toString(36)}`,
      actorName: actor?.name || 'Admin',
      actorRole: actor?.role || 'admin',
      action: `Changed order status from ${existing.status.toUpperCase()} to ${updates.status.toUpperCase()}`,
      timestamp: new Date().toISOString(),
    })
  }

  if (updates.paymentStatus && updates.paymentStatus !== existing.paymentStatus) {
    history.push({
      id: `act-pay-${Date.now().toString(36)}`,
      actorName: actor?.name || 'Payment System',
      actorRole: actor?.role || 'system',
      action: `Payment status updated to ${updates.paymentStatus.toUpperCase()}`,
      timestamp: new Date().toISOString(),
    })
  }

  db.orders[index] = {
    ...existing,
    ...updates,
    activityHistory: history,
    updatedAt: new Date().toISOString(),
  }
  saveDB(db)

  if (actor) {
    await createAuditLog({
      actorId: actor.email,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: `Updated Order ${existing.orderNumber}`,
      resource: 'order',
      resourceId: existing.id,
      metadata: { status: updates.status, paymentStatus: updates.paymentStatus },
    })
  }

  return db.orders[index]
}

export async function submitOrderRequirements(
  orderId: string,
  requirements: Omit<OrderRequirements, 'submittedAt' | 'updatedAt'>,
  actor: { id: string; name: string; email: string }
): Promise<Order | null> {
  const db = loadDB()
  const index = db.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId)
  if (index === -1) return null

  const existing = db.orders[index]
  const now = new Date().toISOString()

  const reqObj: OrderRequirements = {
    ...requirements,
    submittedAt: existing.requirements?.submittedAt || now,
    updatedAt: now,
  }

  const nextStatus =
    existing.status === 'order_created' || existing.status === 'requirements_pending'
      ? existing.paymentStatus === 'paid'
        ? 'in_progress'
        : 'payment_pending'
      : existing.status

  const history = [...(existing.activityHistory || [])]
  history.push({
    id: `act-req-${Date.now().toString(36)}`,
    actorName: actor.name,
    actorRole: 'client',
    action: `Submitted project requirements specification`,
    timestamp: now,
  })

  db.orders[index] = {
    ...existing,
    requirements: reqObj,
    status: nextStatus,
    activityHistory: history,
    updatedAt: now,
  }

  saveDB(db)

  await createAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: 'client',
    action: `Submitted project requirements for ${existing.orderNumber}`,
    resource: 'order',
    resourceId: existing.id,
  })

  return db.orders[index]
}

// ==================== PROJECT FILE CENTER ====================

export async function getProjectFiles(filter?: {
  orderId?: string
  userId?: string
}): Promise<ProjectFile[]> {
  const db = loadDB()
  let list = db.files
  if (filter?.orderId) {
    list = list.filter((f) => f.orderId === filter.orderId || f.orderNumber === filter.orderId)
  }
  if (filter?.userId) {
    list = list.filter((f) => f.userId === filter.userId)
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getProjectFileById(id: string): Promise<ProjectFile | undefined> {
  const db = loadDB()
  return db.files.find((f) => f.id === id)
}

export async function createProjectFile(data: {
  orderId: string
  orderNumber: string
  userId: string
  uploaderId: string
  uploaderName: string
  uploaderRole: 'client' | 'admin'
  fileName: string
  fileType: string
  fileSize: number
  category: 'client_asset' | 'deliverable'
  contentBase64: string
}): Promise<ProjectFile> {
  const db = loadDB()
  const newFile: ProjectFile = {
    id: `file-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    orderId: data.orderId,
    orderNumber: data.orderNumber,
    userId: data.userId,
    uploaderId: data.uploaderId,
    uploaderName: data.uploaderName,
    uploaderRole: data.uploaderRole,
    fileName: data.fileName,
    fileType: data.fileType,
    fileSize: data.fileSize,
    category: data.category,
    contentBase64: data.contentBase64,
    createdAt: new Date().toISOString(),
  }

  db.files.push(newFile)
  saveDB(db)

  await createAuditLog({
    actorId: data.uploaderId,
    actorEmail: data.uploaderName,
    actorRole: data.uploaderRole,
    action: `Uploaded ${data.category} file "${data.fileName}" to ${data.orderNumber}`,
    resource: 'file',
    resourceId: newFile.id,
  })

  return newFile
}

export async function deleteProjectFile(id: string): Promise<boolean> {
  const db = loadDB()
  const idx = db.files.findIndex((f) => f.id === id)
  if (idx === -1) return false
  db.files.splice(idx, 1)
  saveDB(db)
  return true
}

// ==================== PAYMENT TRANSACTIONS & INVOICES ====================

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

export async function getInvoices(userId?: string): Promise<Invoice[]> {
  const db = loadDB()
  let list = db.invoices
  if (userId) {
    list = list.filter((i) => i.userId === userId)
  }
  return [...list].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  )
}

export async function createPaymentAndInvoice(data: {
  orderId: string
  userId: string
  amount: number
  currency?: string
  provider: 'stripe' | 'paypal' | 'fiverr' | 'wire'
  transactionRef: string
  status: 'succeeded' | 'failed' | 'refunded'
  errorMessage?: string
  metadata?: Record<string, any>
}): Promise<{ payment: PaymentTransaction; invoice?: Invoice }> {
  const db = loadDB()

  // Idempotency check: prevent duplicate succeeded payment for the same transactionRef
  const existingPayment = db.payments.find(
    (p) => p.transactionRef === data.transactionRef && p.status === 'succeeded'
  )
  if (existingPayment && data.status === 'succeeded') {
    const existingInv = db.invoices.find((i) => i.transactionRef === data.transactionRef)
    return { payment: existingPayment, invoice: existingInv }
  }

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

  let createdInvoice: Invoice | undefined

  if (data.status === 'succeeded') {
    const order = db.orders.find((o) => o.id === data.orderId || o.orderNumber === data.orderId)
    const user = db.users.find((u) => u.id === data.userId)

    createdInvoice = {
      id: `inv-${Date.now().toString(36)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: order?.id || data.orderId,
      orderNumber: order?.orderNumber || data.orderId,
      userId: data.userId,
      clientName: order?.clientName || user?.fullName || 'Client',
      clientEmail: order?.clientEmail || user?.email || '',
      clientCompany: user?.company,
      serviceName: order?.serviceName || 'TSTACK Engineering Sprint',
      amount: data.amount,
      currency: data.currency || 'USD',
      paymentStatus: 'paid',
      paymentMethod: data.provider.toUpperCase(),
      transactionRef: data.transactionRef,
      issuedAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    }
    db.invoices.push(createdInvoice)

    await recordAnalyticsEvent({
      eventType: 'payment_succeeded',
      userId: data.userId,
      metadata: { orderId: data.orderId, amount: data.amount, provider: data.provider },
    })
  }

  saveDB(db)
  return { payment: newPayment, invoice: createdInvoice }
}

// Keep backwards compatibility with createPayment
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
  const res = await createPaymentAndInvoice(data)
  return res.payment
}

// ==================== CHAT CONVERSATIONS & MESSAGING ====================

export async function getConversations(filter?: {
  userId?: string
  email?: string
}): Promise<ChatConversation[]> {
  const db = loadDB()
  let list = db.conversations
  if (filter?.userId || filter?.email) {
    list = list.filter(
      (c) =>
        (filter.userId && c.userId === filter.userId) ||
        (filter.email &&
          c.clientEmail &&
          c.clientEmail.toLowerCase() === filter.email.toLowerCase())
    )
  }
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export async function getConversationBySession(
  sessionId: string
): Promise<ChatConversation | undefined> {
  const db = loadDB()
  return db.conversations.find((c) => c.sessionId === sessionId || c.id === sessionId)
}

export async function saveConversation(data: {
  sessionId: string
  userId?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  messages: {
    sender: 'user' | 'assistant' | 'system' | 'owner'
    senderName?: string
    text: string
    attachmentName?: string
    attachmentDataUrl?: string
  }[]
  isEscalated?: boolean
  escalationReason?: string
  humanTakeover?: boolean
}): Promise<ChatConversation> {
  const db = loadDB()
  const existingIndex = db.conversations.findIndex((c) => c.sessionId === data.sessionId)

  const formattedMessages = data.messages.map((m, idx) => ({
    id: `msg-${idx + 1}-${Date.now().toString(36)}`,
    sender: m.sender,
    senderName: m.senderName,
    text: m.text,
    attachmentName: m.attachmentName,
    attachmentDataUrl: m.attachmentDataUrl,
    timestamp: new Date().toISOString(),
  }))

  if (existingIndex !== -1) {
    const existing = db.conversations[existingIndex]
    const updated: ChatConversation = {
      ...existing,
      userId: data.userId || existing.userId,
      clientName: data.clientName || existing.clientName,
      clientEmail: data.clientEmail || existing.clientEmail,
      clientPhone: data.clientPhone || existing.clientPhone,
      messages: formattedMessages,
      isEscalated: data.isEscalated !== undefined ? data.isEscalated : existing.isEscalated,
      escalationReason: data.escalationReason || existing.escalationReason,
      humanTakeover:
        data.humanTakeover !== undefined ? data.humanTakeover : existing.humanTakeover,
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
      clientPhone: data.clientPhone,
      messages: formattedMessages,
      isEscalated: !!data.isEscalated,
      escalationReason: data.escalationReason,
      humanTakeover: !!data.humanTakeover,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.conversations.push(newConv)
    saveDB(db)
    return newConv
  }
}

export async function toggleConversationTakeover(
  sessionId: string,
  humanTakeover: boolean
): Promise<ChatConversation | null> {
  const db = loadDB()
  const conv = db.conversations.find((c) => c.sessionId === sessionId || c.id === sessionId)
  if (!conv) return null
  conv.humanTakeover = humanTakeover
  conv.updatedAt = new Date().toISOString()
  saveDB(db)
  return conv
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
  orderId?: string
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
    orderId: data.orderId,
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

// ==================== APPOINTMENTS / DISCOVERY CALLS ====================

export async function getAppointments(userId?: string): Promise<Appointment[]> {
  const db = loadDB()
  let list = db.appointments
  if (userId) {
    list = list.filter((a) => a.userId === userId)
  }
  return [...list].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export async function createAppointment(data: {
  userId?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  company?: string
  serviceTopic: string
  date: string
  timeSlot: string
  timezone?: string
  notes?: string
}): Promise<Appointment> {
  const db = loadDB()

  // Prevent double booking on the exact same date & timeSlot
  const conflict = db.appointments.find(
    (a) =>
      a.date === data.date &&
      a.timeSlot === data.timeSlot &&
      a.status !== 'cancelled'
  )
  if (conflict) {
    throw new Error('This date and time slot is already reserved. Please select another slot.')
  }

  const appt: Appointment = {
    id: `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    userId: data.userId,
    clientName: data.clientName.trim(),
    clientEmail: data.clientEmail.trim().toLowerCase(),
    clientPhone: data.clientPhone?.trim(),
    company: data.company?.trim(),
    serviceTopic: data.serviceTopic.trim(),
    date: data.date,
    timeSlot: data.timeSlot,
    timezone: data.timezone || 'UTC / EST',
    notes: data.notes?.trim(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.appointments.push(appt)
  saveDB(db)

  await upsertLead({
    name: appt.clientName,
    email: appt.clientEmail,
    phone: appt.clientPhone,
    company: appt.company,
    source: 'appointment',
    serviceInterest: appt.serviceTopic,
    timeline: `${appt.date} at ${appt.timeSlot}`,
    requirements: appt.notes,
    status: 'qualified',
    noteText: `Booked Discovery Call for ${appt.date} at ${appt.timeSlot}`,
  })

  await recordAnalyticsEvent({
    eventType: 'appointment_booked',
    userId: data.userId,
    metadata: { date: appt.date, timeSlot: appt.timeSlot, topic: appt.serviceTopic },
  })

  return appt
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status']
): Promise<Appointment | null> {
  const db = loadDB()
  const idx = db.appointments.findIndex((a) => a.id === id)
  if (idx === -1) return null
  db.appointments[idx].status = status
  db.appointments[idx].updatedAt = new Date().toISOString()
  saveDB(db)
  return db.appointments[idx]
}

// ==================== REVIEWS & TESTIMONIALS ====================

export async function getReviews(onlyApproved = false): Promise<Review[]> {
  const db = loadDB()
  let list = db.reviews
  if (onlyApproved) {
    list = list.filter((r) => r.status === 'approved')
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function createReview(data: {
  userId: string
  orderId: string
  orderNumber: string
  clientName: string
  clientCompany?: string
  serviceName: string
  rating: number
  comment: string
}): Promise<Review> {
  const db = loadDB()
  const newReview: Review = {
    id: `rev-${Date.now().toString(36)}`,
    userId: data.userId,
    orderId: data.orderId,
    orderNumber: data.orderNumber,
    clientName: data.clientName,
    clientCompany: data.clientCompany,
    serviceName: data.serviceName,
    rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
    comment: data.comment.trim(),
    status: 'pending_approval',
    createdAt: new Date().toISOString(),
  }
  db.reviews.push(newReview)
  saveDB(db)
  return newReview
}

export async function updateReviewStatus(
  id: string,
  status: Review['status']
): Promise<Review | null> {
  const db = loadDB()
  const idx = db.reviews.findIndex((r) => r.id === id)
  if (idx === -1) return null
  db.reviews[idx].status = status
  saveDB(db)
  return db.reviews[idx]
}

// ==================== ACTIVITY NOTIFICATIONS ====================

export async function getActivityNotifications(filter?: {
  role?: 'admin' | 'client'
  userId?: string
  email?: string
  sessionId?: string
}): Promise<ActivityNotification[]> {
  const db = loadDB()
  let list = db.notifications

  if (filter) {
    if (filter.role === 'admin') {
      list = list.filter((n) => !n.recipientRole || n.recipientRole === 'admin')
    } else if (filter.role === 'client') {
      list = list.filter(
        (n) =>
          n.recipientRole === 'client' &&
          ((filter.userId && n.recipientUserId === filter.userId) ||
            (filter.email &&
              n.recipientEmail &&
              n.recipientEmail.toLowerCase() === filter.email.toLowerCase()) ||
            (filter.sessionId && n.sessionId === filter.sessionId))
      )
    } else if (filter.sessionId) {
      list = list.filter(
        (n) => n.recipientRole === 'client' && n.sessionId === filter.sessionId
      )
    }
  }

  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function createActivityNotification(data: {
  type: ActivityNotification['type']
  title: string
  message: string
  priority?: 'normal' | 'high' | 'urgent'
  recipientRole?: 'admin' | 'client'
  recipientUserId?: string
  recipientEmail?: string
  sessionId?: string
  actionLink?: string
  data?: Record<string, any>
}): Promise<ActivityNotification> {
  const db = loadDB()
  const newNotification: ActivityNotification = {
    id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    type: data.type,
    title: data.title,
    message: data.message,
    priority: data.priority || 'normal',
    recipientRole: data.recipientRole || 'admin',
    recipientUserId: data.recipientUserId,
    recipientEmail: data.recipientEmail?.toLowerCase(),
    sessionId: data.sessionId,
    actionLink: data.actionLink,
    data: data.data,
    isRead: false,
    createdAt: new Date().toISOString(),
  }

  db.notifications.push(newNotification)
  if (db.notifications.length > 300) {
    db.notifications = db.notifications.slice(-300)
  }
  saveDB(db)
  return newNotification
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const db = loadDB()
  const item = db.notifications.find((n) => n.id === id)
  if (!item) return false
  item.isRead = true
  saveDB(db)
  return true
}

export async function markAllNotificationsRead(filter: {
  role?: 'admin' | 'client'
  userId?: string
  email?: string
  sessionId?: string
}): Promise<number> {
  const db = loadDB()
  let count = 0
  for (const n of db.notifications) {
    if (filter.role === 'admin' && (!n.recipientRole || n.recipientRole === 'admin')) {
      if (!n.isRead) {
        n.isRead = true
        count++
      }
    } else if (
      filter.role === 'client' &&
      n.recipientRole === 'client' &&
      ((filter.userId && n.recipientUserId === filter.userId) ||
        (filter.email &&
          n.recipientEmail &&
          n.recipientEmail.toLowerCase() === filter.email.toLowerCase()) ||
        (filter.sessionId && n.sessionId === filter.sessionId))
    ) {
      if (!n.isRead) {
        n.isRead = true
        count++
      }
    } else if (filter.sessionId && n.recipientRole === 'client' && n.sessionId === filter.sessionId) {
      if (!n.isRead) {
        n.isRead = true
        count++
      }
    }
  }
  if (count > 0) saveDB(db)
  return count
}

export async function appendAdminReplyToChatOrTicket(params: {
  sessionId?: string
  ticketId?: string
  senderName: string
  replyText: string
}): Promise<void> {
  const db = loadDB()
  if (params.sessionId) {
    const conv = db.conversations.find((c) => c.sessionId === params.sessionId || c.id === params.sessionId)
    if (conv) {
      conv.messages.push({
        id: `msg-owner-${Date.now().toString(36)}`,
        sender: 'owner',
        senderName: params.senderName,
        text: params.replyText,
        timestamp: new Date().toISOString(),
      })
      conv.updatedAt = new Date().toISOString()
    }
  }
  if (params.ticketId) {
    const ticket = db.tickets.find((t) => t.id === params.ticketId || t.ticketNumber === params.ticketId)
    if (ticket) {
      ticket.messages.push({
        id: `tmsg-admin-${Date.now().toString(36)}`,
        senderId: 'admin',
        senderName: params.senderName,
        isAdmin: true,
        message: params.replyText,
        createdAt: new Date().toISOString(),
      })
      ticket.status = 'in_progress'
      ticket.updatedAt = new Date().toISOString()
    }
  }
  saveDB(db)
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
