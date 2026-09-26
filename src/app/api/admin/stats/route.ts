import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getUsers,
  getOrders,
  getPayments,
  getInvoices,
  getContactInquiries,
  getLeads,
  getConversations,
  getSupportTickets,
  getAppointments,
  getReviews,
  getProjectFiles,
  getActivityNotifications,
  getAuditLogs,
  getEmailDeliveryLogs,
} from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const [
      users,
      orders,
      payments,
      invoices,
      inquiries,
      rawLeads,
      conversations,
      tickets,
      rawAppointments,
      reviews,
      rawProjectFiles,
      notifications,
      rawAuditLogs,
      emailDeliveryLogs,
    ] = await Promise.all([
      getUsers(),
      getOrders(),
      getPayments(),
      getInvoices(),
      getContactInquiries(),
      getLeads(),
      getConversations(),
      getSupportTickets(),
      getAppointments(),
      getReviews(false),
      getProjectFiles(),
      getActivityNotifications(),
      getAuditLogs(60),
      getEmailDeliveryLogs(60),
    ])

    const clients = users.filter((u) => u.role === 'client')
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid')
    const pendingPaymentOrders = orders.filter((o) => o.paymentStatus === 'unpaid')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.price, 0)
    const pendingRevenue = pendingPaymentOrders.reduce((sum, o) => sum + o.price, 0)
    const escalatedChats = conversations.filter((c) => c.isEscalated)
    const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress')
    const unreadNotifications = notifications.filter((n) => !n.isRead)
    const scheduledAppointments = rawAppointments.filter(
      (a) => a.status === 'requested' || a.status === 'confirmed'
    )
    const pendingReviews = reviews.filter((r) => r.status === 'pending_approval')

    const leads = rawLeads.map((l) => ({
      ...l,
      stage: l.status,
      notes: l.notes?.map((n) => n.text).join(' • ') || l.requirements || '',
    }))

    const appointments = rawAppointments.map((a) => ({
      ...a,
      serviceInterest: a.serviceTopic,
    }))

    const projectFiles = rawProjectFiles.map((f) => ({
      ...f,
      uploadedByRole: f.uploaderRole === 'admin' ? 'owner' : 'client',
      uploadedByName: f.uploaderName,
      dataUrl: f.contentBase64,
    }))

    const auditLogs = rawAuditLogs.map((al) => ({
      ...al,
      summary: `${al.action} (${al.resource})`,
    }))

    const safeClients = clients.map(({ passwordHash, ...rest }) => rest)

    return NextResponse.json({
      success: true,
      stats: {
        totalClients: clients.length,
        totalOrders: orders.length,
        activeOrders: orders.filter(
          (o) =>
            o.status === 'in_progress' ||
            o.status === 'pending' ||
            o.status === 'order_created' ||
            o.status === 'payment_pending' ||
            o.status === 'requirements_pending' ||
            o.status === 'review' ||
            o.status === 'revision'
        ).length,
        completedOrders: orders.filter((o) => o.status === 'completed').length,
        pendingPaymentsCount: pendingPaymentOrders.length,
        pendingRevenue,
        totalRevenue,
        totalInvoices: invoices.length,
        totalInquiries: inquiries.length,
        totalLeads: rawLeads.length,
        qualifiedLeadsCount: rawLeads.filter(
          (l) =>
            l.status === 'qualified' ||
            l.status === 'proposal' ||
            l.status === 'negotiation'
        ).length,
        wonLeadsCount: rawLeads.filter((l) => l.status === 'won').length,
        totalChats: conversations.length,
        escalatedChatsCount: escalatedChats.length,
        openTicketsCount: openTickets.length,
        unreadNotificationsCount: unreadNotifications.length,
        scheduledAppointmentsCount: scheduledAppointments.length,
        pendingReviewsCount: pendingReviews.length,
        totalProjectFiles: projectFiles.length,
      },
      clients: safeClients,
      recentOrders: orders.map((o) => ({
        ...o,
        requirements: o.requirements
          ? {
              ...o.requirements,
              projectTitle: o.requirements.businessName,
              featuresRequired: o.requirements.requiredFunctionality,
              deadlineGoals: o.requirements.requiredPages,
              domainHostingDetails: o.requirements.domainInfo,
            }
          : undefined,
      })),
      recentInquiries: inquiries,
      leads,
      recentPayments: payments,
      invoices,
      recentConversations: conversations,
      recentTickets: tickets,
      appointments,
      reviews,
      projectFiles,
      recentNotifications: notifications.slice(0, 25),
      auditLogs,
      emailDeliveryLogs,
    })
  } catch (err: any) {
    console.error('[Admin Stats API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to retrieve dashboard stats' }, { status: 500 })
  }
}
