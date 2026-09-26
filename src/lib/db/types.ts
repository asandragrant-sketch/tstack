export type UserRole = 'client' | 'admin'

export interface User {
  id: string
  email: string
  passwordHash: string
  fullName: string
  company?: string
  phone?: string
  emailVerified?: boolean
  role: UserRole
  createdAt: string
  lastLoginAt?: string
}

export interface PasswordResetToken {
  token: string
  userId: string
  email: string
  expiresAt: string
  used: boolean
  createdAt: string
}

export type InquiryStatus = 'new' | 'reviewed' | 'responded' | 'archived'

export interface ContactInquiry {
  id: string
  fullName: string
  email: string
  phone?: string
  company?: string
  service: string
  budget: string
  message: string
  status: InquiryStatus
  leadId?: string
  createdAt: string
}

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export interface LeadNote {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source: 'contact_form' | 'ai_assistant' | 'registration' | 'manual' | 'appointment'
  serviceInterest: string
  budget?: string
  timeline?: string
  requirements?: string
  conversationSessionId?: string
  notes: LeadNote[]
  assignedOwner: string
  status: LeadStage
  createdAt: string
  lastActivityAt: string
}

export type OrderStatus =
  | 'order_created'
  | 'payment_pending'
  | 'requirements_pending'
  | 'in_progress'
  | 'review'
  | 'revision'
  | 'completed'
  | 'cancelled'
  | 'pending'
  | 'escrow_locked'
  | 'qa_testing'

export type PaymentStatus = 'unpaid' | 'paid' | 'escrow_held' | 'refunded' | 'failed'

export interface OrderMilestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  completedAt?: string
}

export interface OrderRequirements {
  businessName: string
  businessDescription: string
  websiteType: string
  requiredPages: string
  requiredFunctionality: string
  targetAudience: string
  designPreferences?: string
  brandColors?: string
  competitorWebsites?: string
  domainInfo?: string
  hostingInfo?: string
  contentNotes?: string
  logoUrl?: string
  additionalRequirements?: string
  submittedAt: string
  updatedAt: string
}

export interface OrderActivityItem {
  id: string
  actorName: string
  actorRole: 'client' | 'admin' | 'system'
  action: string
  timestamp: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  clientName: string
  clientEmail: string
  serviceId: string
  serviceName: string
  description: string
  price: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: 'stripe' | 'paypal' | 'fiverr' | 'wire'
  paymentRef?: string
  assignedArchitect: string
  milestones: OrderMilestone[]
  requirements?: OrderRequirements
  ownerNotes?: string
  clientNotes?: string
  activityHistory?: OrderActivityItem[]
  targetDate?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFile {
  id: string
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
  createdAt: string
}

export interface PaymentTransaction {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: string
  provider: 'stripe' | 'paypal' | 'fiverr' | 'wire'
  transactionRef: string
  status: 'succeeded' | 'failed' | 'refunded'
  errorMessage?: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  orderNumber: string
  userId: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  serviceName: string
  amount: number
  currency: string
  paymentStatus: 'paid' | 'unpaid' | 'refunded'
  paymentMethod: string
  transactionRef: string
  issuedAt: string
  paidAt?: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant' | 'system' | 'owner'
  senderName?: string
  text: string
  attachmentName?: string
  attachmentDataUrl?: string
  readByAdmin?: boolean
  readByClient?: boolean
  timestamp: string
}

export interface ChatConversation {
  id: string
  sessionId: string
  userId?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  messages: ChatMessage[]
  isEscalated: boolean
  escalationReason?: string
  humanTakeover?: boolean
  leadId?: string
  unreadByAdmin?: number
  unreadByClient?: number
  createdAt: string
  updatedAt: string
}

export interface SupportTicketMessage {
  id: string
  senderId: string
  senderName: string
  isAdmin: boolean
  message: string
  attachmentName?: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  ticketNumber: string
  userId: string
  clientName: string
  clientEmail: string
  orderId?: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved'
  messages: SupportTicketMessage[]
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  userId?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  company?: string
  serviceTopic: string
  date: string
  timeSlot: string
  timezone: string
  notes?: string
  status: 'requested' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  userId: string
  orderId: string
  orderNumber: string
  clientName: string
  clientCompany?: string
  serviceName: string
  rating: number
  comment: string
  status: 'pending_approval' | 'approved' | 'rejected'
  createdAt: string
}

export type ActivityEventType =
  | 'contact_submission'
  | 'client_registration'
  | 'new_lead'
  | 'order_placed'
  | 'order_updated'
  | 'requirements_submitted'
  | 'file_uploaded'
  | 'payment_success'
  | 'payment_failed'
  | 'ai_escalation'
  | 'support_ticket'
  | 'ticket_response'
  | 'client_message'
  | 'appointment_booked'
  | 'review_submitted'
  | 'security_event'
  | 'system_alert'

export interface ActivityNotification {
  id: string
  type: ActivityEventType
  title: string
  message: string
  priority?: 'normal' | 'high' | 'urgent'
  recipientRole?: 'admin' | 'client'
  recipientUserId?: string
  recipientEmail?: string
  sessionId?: string
  actionLink?: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
}

export interface AuditLogEntry {
  id: string
  actorId: string
  actorEmail: string
  actorRole: 'client' | 'admin' | 'system' | 'visitor'
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  timestamp: string
}

export interface EmailDeliveryLog {
  id: string
  recipient: string
  subject: string
  eventType: string
  provider: string
  status: 'delivered' | 'failed' | 'unconfigured'
  errorMessage?: string
  timestamp: string
}

export interface AnalyticsEvent {
  id: string
  eventType:
    | 'page_view'
    | 'contact_submit'
    | 'ai_chat_start'
    | 'ai_escalation'
    | 'lead_qualified'
    | 'order_created'
    | 'payment_succeeded'
    | 'appointment_booked'
  path?: string
  sessionId?: string
  userId?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface EmailSettings {
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPass?: string
  resendApiKey?: string
  web3formsKey?: string
  updatedAt?: string
}
