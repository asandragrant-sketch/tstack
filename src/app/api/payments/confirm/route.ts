import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getOrderById, updateOrder, createPayment } from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, transactionRef, provider = 'stripe', method = 'credit_card' } = body

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 })
    }

    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })
    }

    if (user.role !== 'admin' && order.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const ref = transactionRef || `tx_pay_${Date.now().toString(36)}`

    // Record verified payment
    const payment = await createPayment({
      orderId: order.id,
      userId: user.id,
      amount: order.price,
      currency: order.currency || 'USD',
      provider: provider as any,
      transactionRef: ref,
      status: 'succeeded',
      metadata: { method, verifiedAt: new Date().toISOString() },
    })

    // Update order status
    const updatedOrder = await updateOrder(order.id, {
      paymentStatus: 'paid',
      status: order.status === 'pending' ? 'in_progress' : order.status,
    })

    // Disptach payment success notification to BOTH owners: d.jacobwebpro@gmail.com and baronwebpro@gmail.com
    await notifyOwners({
      type: 'payment_success',
      subject: `Payment Received: $${order.price.toLocaleString()} USD for Order ${order.orderNumber}`,
      clientName: user.fullName,
      clientEmail: user.email,
      priority: 'high',
      details: {
        'Order Number': order.orderNumber,
        Service: order.serviceName,
        'Amount Paid': `$${order.price.toLocaleString()} ${order.currency || 'USD'}`,
        'Transaction ID': ref,
        Provider: provider.toUpperCase(),
        'Client Name': user.fullName,
        'Client Email': user.email,
        Timestamp: new Date().toISOString(),
      },
      actionLink: `/admin/payments?orderId=${order.id}`,
      actionLabel: 'Inspect Payment in Admin Dashboard →',
    })

    // Send receipt email to client
    await sendClientEmail(
      user.email,
      `Receipt: Payment Received for ${order.orderNumber} - TSTACK`,
      `<h2>Payment Received</h2><p>Thank you, ${user.fullName}. We have received your payment of <strong>$${order.price.toLocaleString()} ${order.currency || 'USD'}</strong> for order <strong>${order.orderNumber}</strong> (${order.serviceName}).</p><p>Lead architect Daniel Kylan Jacob and the engineering team are now actively progressing your milestones.</p><p>View your project hub: https://tstack-ten.vercel.app/portal/orders/${order.id}</p>`
    )

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully.',
      order: updatedOrder,
      payment,
    })
  } catch (err: any) {
    console.error('[Payment Confirm API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Payment confirmation failed.' },
      { status: 500 }
    )
  }
}
