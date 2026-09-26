import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getOrders, createOrder } from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Admins see all orders; clients only see their own
    const orders = user.role === 'admin' ? await getOrders() : await getOrders(user.id)
    return NextResponse.json({ success: true, orders })
  } catch (err: any) {
    console.error('[Orders GET API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to place an order.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { serviceId, serviceName, description, price, targetDate } = body

    if (!serviceName || typeof serviceName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Service name is required.' },
        { status: 400 }
      )
    }

    const parsedPrice = Number(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid price is required.' },
        { status: 400 }
      )
    }

    const order = await createOrder({
      userId: user.id,
      clientName: user.fullName,
      clientEmail: user.email,
      serviceId: serviceId || 'custom-contract',
      serviceName: serviceName.trim(),
      description: description?.trim() || 'Custom architecture and implementation order',
      price: parsedPrice,
      currency: 'USD',
      targetDate: targetDate || undefined,
    })

    // Notify BOTH owners: d.jacobwebpro@gmail.com and baronwebpro@gmail.com
    await notifyOwners({
      type: 'order_placed',
      subject: `New Order Placed: ${order.orderNumber} - ${order.serviceName} ($${order.price})`,
      clientName: user.fullName,
      clientEmail: user.email,
      priority: 'high',
      details: {
        'Order Number': order.orderNumber,
        'Service Name': order.serviceName,
        Amount: `$${order.price.toLocaleString()} USD`,
        'Client Name': user.fullName,
        'Client Email': user.email,
        Company: user.company || 'N/A',
        Status: order.status,
        Payment: order.paymentStatus,
      },
      actionLink: `/admin/orders?orderId=${order.id}`,
      actionLabel: 'View & Manage Order in Admin →',
    })

    // Send confirmation to client
    await sendClientEmail(
      user.email,
      `TSTACK Order Confirmed: ${order.orderNumber}`,
      `<h2>Order Received</h2><p>Your order <strong>${order.orderNumber}</strong> for <strong>${order.serviceName}</strong> has been initialized. You can view your project milestones and review invoices at https://tstack-ten.vercel.app/portal/orders/${order.id}.</p>`
    )

    return NextResponse.json({ success: true, order })
  } catch (err: any) {
    console.error('[Orders POST API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 })
  }
}
