import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth'
import { getOrderById } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required for payment creation.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required.' },
        { status: 400 }
      )
    }

    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      )
    }

    if (user.role !== 'admin' && order.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this order.' },
        { status: 403 }
      )
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, error: 'This order is already marked as paid.' },
        { status: 400 }
      )
    }

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()
    const amountInCents = Math.round(order.price * 100)

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          success: false,
          stripeConfigured: false,
          mode: 'stripe_unconfigured',
          error:
            'Direct Stripe card checkout is currently unavailable because STRIPE_SECRET_KEY is not configured in the server environment. You can fund this order via Verified Fiverr Milestone Escrow or submit your Fiverr/Wire transaction reference for Owner Verification.',
          fiverrEscrowUrl: 'https://www.fiverr.com/s/bkdlzbX',
        },
        { status: 503 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: (order.currency || 'USD').toLowerCase(),
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: user.id,
        clientEmail: user.email,
      },
      receipt_email: user.email,
      description: `TSTACK Payment for ${order.serviceName} (${order.orderNumber})`,
    })

    return NextResponse.json({
      success: true,
      stripeConfigured: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.price,
      currency: order.currency,
      mode: 'stripe_live',
    })
  } catch (err: any) {
    console.error('[Create Payment Intent API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Payment initiation failed.' },
      { status: 500 }
    )
  }
}

