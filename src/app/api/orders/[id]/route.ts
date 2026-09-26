import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getOrderById, updateOrder } from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const order = await getOrderById(params.id)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Permission check: admin or order owner
    if (user.role !== 'admin' && order.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, order })
  } catch (err: any) {
    console.error('[Order Detail GET API] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const order = await getOrderById(params.id)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Only admin can change milestone statuses or order status
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only administrative owners can modify order delivery statuses.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status, paymentStatus, milestones, notes, assignedArchitect } = body

    const updated = await updateOrder(order.id, {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(milestones && { milestones }),
      ...(notes !== undefined && { notes }),
      ...(assignedArchitect && { assignedArchitect }),
    })

    // If order completed or updated, notify client (via Notification Bar + Email) and owners
    const { createActivityNotification } = await import('@/lib/db')
    await createActivityNotification({
      type: 'order_updated',
      title: `Order ${order.orderNumber} Updated: ${(status || order.status).toUpperCase()}`,
      message: `Daniel Kylan Jacob & Team updated your project "${order.serviceName}" to status: ${(status || order.status).replace('_', ' ')}${paymentStatus ? ` (${paymentStatus.toUpperCase()})` : ''}.`,
      recipientRole: 'client',
      recipientUserId: order.userId,
      recipientEmail: order.clientEmail,
      actionLink: `/portal/orders/${order.id}`,
    })

    if (status && status !== order.status) {
      await sendClientEmail(
        order.clientEmail,
        `Update on Order ${order.orderNumber}: Status Changed to ${status.toUpperCase()}`,
        `<h2>Order Status Update</h2><p>Your order <strong>${order.orderNumber}</strong> (${order.serviceName}) has been updated to <strong>${status}</strong>.</p><p>Check full progress: https://tstack-ten.vercel.app/portal/orders/${order.id}</p>`
      )

      await notifyOwners({
        type: 'system_alert',
        subject: `Order Status Updated: ${order.orderNumber} is now ${status.toUpperCase()}`,
        clientName: order.clientName,
        clientEmail: order.clientEmail,
        details: {
          'Order Number': order.orderNumber,
          'Old Status': order.status,
          'New Status': status,
          UpdatedBy: user.email,
        },
        actionLink: `/admin/orders?orderId=${order.id}`,
      })
    }

    return NextResponse.json({ success: true, order: updated })
  } catch (err: any) {
    console.error('[Order Detail PATCH API] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
