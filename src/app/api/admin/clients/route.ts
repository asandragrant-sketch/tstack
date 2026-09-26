import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUsers, getOrders } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const allUsers = await getUsers()
    const allOrders = await getOrders()

    const clientsWithStats = allUsers
      .filter((u) => u.role !== 'admin')
      .map((u) => {
        const clientOrders = allOrders.filter((o) => o.userId === u.id)
        const totalSpent = clientOrders
          .filter((o) => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.price, 0)

        return {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          company: u.company || 'Not specified',
          phone: u.phone || 'Not specified',
          createdAt: u.createdAt,
          totalOrders: clientOrders.length,
          activeOrders: clientOrders.filter((o) => o.status === 'in_progress').length,
          totalSpent,
        }
      })

    return NextResponse.json({ success: true, clients: clientsWithStats })
  } catch (err: any) {
    console.error('[Admin Clients API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to retrieve clients' }, { status: 500 })
  }
}
