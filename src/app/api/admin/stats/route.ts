import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getUsers,
  getOrders,
  getPayments,
  getContactInquiries,
  getConversations,
  getSupportTickets,
  getActivityNotifications,
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
      inquiries,
      conversations,
      tickets,
      notifications,
    ] = await Promise.all([
      getUsers(),
      getOrders(),
      getPayments(),
      getContactInquiries(),
      getConversations(),
      getSupportTickets(),
      getActivityNotifications(),
    ])

    const clients = users.filter((u) => u.role === 'client')
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.price, 0)
    const escalatedChats = conversations.filter((c) => c.isEscalated)
    const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress')

    return NextResponse.json({
      success: true,
      stats: {
        totalClients: clients.length,
        totalOrders: orders.length,
        activeOrders: orders.filter((o) => o.status === 'in_progress' || o.status === 'pending').length,
        completedOrders: orders.filter((o) => o.status === 'completed').length,
        totalRevenue,
        totalInquiries: inquiries.length,
        totalChats: conversations.length,
        escalatedChatsCount: escalatedChats.length,
        openTicketsCount: openTickets.length,
      },
      recentOrders: orders.slice(0, 8),
      recentInquiries: inquiries.slice(0, 8),
      recentPayments: payments.slice(0, 8),
      recentConversations: conversations.slice(0, 8),
      recentTickets: tickets.slice(0, 8),
      recentNotifications: notifications.slice(0, 12),
    })
  } catch (err: any) {
    console.error('[Admin Stats API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to retrieve dashboard stats' }, { status: 500 })
  }
}
