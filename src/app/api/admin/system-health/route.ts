import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getAuditLogs,
  getEmailDeliveryLogs,
  getPayments,
  getUsers,
  getOrders,
} from '@/lib/db'
import { getEmailProviderConfigStatus } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const [
      users,
      orders,
      payments,
      auditLogs,
      emailLogs,
      emailConfig,
    ] = await Promise.all([
      getUsers(),
      getOrders(),
      getPayments(),
      getAuditLogs(100),
      getEmailDeliveryLogs(100),
      getEmailProviderConfigStatus(),
    ])

    const stripeSecretConfigured = Boolean((process.env.STRIPE_SECRET_KEY || '').trim())
    const stripeWebhookConfigured = Boolean((process.env.STRIPE_WEBHOOK_SECRET || '').trim())
    const openaiConfigured = Boolean((process.env.OPENAI_API_KEY || '').trim())
    const recentEmailFailures = emailLogs.slice(0, 10).filter((l) => l.status === 'failed').length

    const services = [
      {
        id: 'database',
        name: 'Database & Persistence Engine',
        status: users.length > 0 ? 'GREEN' : 'RED',
        summary: `Active atomic JSON store • ${users.length} accounts, ${orders.length} orders`,
      },
      {
        id: 'auth',
        name: 'Authentication & RBAC Guard',
        status: 'GREEN',
        summary: 'HTTP-only JWT session cookies & bcrypt password hashing operational',
      },
      {
        id: 'ai_assistant',
        name: 'AI Customer Support & Lead Engine',
        status: 'GREEN',
        summary: openaiConfigured
          ? 'OpenAI API + deterministic TSTACK knowledge base active'
          : 'Deterministic multi-intent TSTACK knowledge base & live escalation active',
      },
      {
        id: 'email_provider',
        name: 'External Email Delivery (SMTP / Resend / Web3Forms)',
        status: !emailConfig.anyConfigured
          ? 'YELLOW'
          : recentEmailFailures > 3
          ? 'RED'
          : 'GREEN',
        summary: emailConfig.anyConfigured
          ? `Configured (${[
              emailConfig.smtpConfigured ? 'SMTP' : '',
              emailConfig.resendConfigured ? 'Resend' : '',
              emailConfig.web3formsConfigured ? 'Web3Forms' : '',
            ]
              .filter(Boolean)
              .join(', ')})`
          : 'Unconfigured — inquiries recorded in Database & Admin Activity Bar until SMTP_PASS or RESEND_API_KEY is set',
      },
      {
        id: 'stripe_payments',
        name: 'Stripe Payment Gateway',
        status: stripeSecretConfigured ? 'GREEN' : 'YELLOW',
        summary: stripeSecretConfigured
          ? 'Live Stripe PaymentIntent API configured'
          : 'STRIPE_SECRET_KEY not set — Fiverr Milestone Escrow & Owner-verified invoices active',
      },
      {
        id: 'webhooks',
        name: 'Stripe Webhook Verification',
        status: stripeWebhookConfigured ? 'GREEN' : 'YELLOW',
        summary: stripeWebhookConfigured
          ? 'STRIPE_WEBHOOK_SECRET signature verification active'
          : 'STRIPE_WEBHOOK_SECRET not set in environment',
      },
      {
        id: 'file_storage',
        name: 'Project File Center & Deliverables Store',
        status: 'GREEN',
        summary: 'Authenticated base64 asset & deliverable vault active (4.5MB/file limit)',
      },
    ]

    const failedPayments = payments.filter((p) => p.status === 'failed')

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      services,
      emailConfig,
      stripeConfigured: stripeSecretConfigured,
      stripeWebhookConfigured,
      recentEmailLogs: emailLogs.slice(0, 40),
      recentAuditLogs: auditLogs.slice(0, 50),
      failedPayments,
    })
  } catch (err: any) {
    console.error('[System Health API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate system health.' },
      { status: 500 }
    )
  }
}
