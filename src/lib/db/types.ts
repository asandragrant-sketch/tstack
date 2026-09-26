export type UserRole = 'client' | 'admin'

export interface User {
  id: string
  email: string
  passwordHash: string
  fullName: string
  company?: string
  phone?: string
  role: UserRole
  createdAt: string
  lastLoginAt?: string
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
  createdAt: string
}

export type OrderStatus =
  | 'pending'
  | 'escrow_locked'
  | 'in_progress'
  | 'qa_testing'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'paid' | 'escrow_held' | 'refunded' | 'failed'

export interface OrderMilestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  completedAt?: string
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
  targetDate?: string
  createdAt: string
  updatedAt: string
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

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant' | 'system'
  text: string
  timestamp: string
}

export interface ChatConversation {
  id: string
  sessionId: string
  userId?: string
  clientName?: string
  clientEmail?: string
  messages: ChatMessage[]
  isEscalated: boolean
  escalationReason?: string
  createdAt: string
  updatedAt: string
}

export interface SupportTicketMessage {
  id: string
  senderId: string
  senderName: string
  isAdmin: boolean
  message: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  ticketNumber: string
  userId: string
  clientName: string
  clientEmail: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved'
  messages: SupportTicketMessage[]
  createdAt: string
  updatedAt: string
}

export type ActivityEventType =
  | 'contact_submission'
  | 'client_registration'
  | 'order_placed'
  | 'order_updated'
  | 'payment_success'
  | 'payment_failed'
  | 'ai_escalation'
  | 'support_ticket'
  | 'client_message'
  | 'system_alert'

export interface ActivityNotification {
  id: string
  type: ActivityEventType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
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

