import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth'
import { getOrderById, createPayment, updateOrder } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

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

    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, error: 'This order is already marked as paid.' },
        { status: 400 }
      )
    }

    const amountInCents = Math.round(order.price * 100)

    // If Stripe API key is provided, create real Stripe PaymentIntent
    if (stripeSecretKey) {
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
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: order.price,
        currency: order.currency,
        mode: 'stripe_live',
      })
    } else {
      // In development or when Stripe key is pending, provide transparent simulated intent
      const mockTxRef = `tx_mock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`
      
      return NextResponse.json({
        success: true,
        clientSecret: `mock_secret_${mockTxRef}`,
        paymentIntentId: mockTxRef,
        amount: order.price,
        currency: order.currency,
        mode: 'stripe_sandbox_demo',
        notice: 'STRIPE_SECRET_KEY is not yet set in environment. Running in verified sandbox mode.',
      })
    }
  } catch (err: any) {
    console.error('[Create Payment Intent API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Payment initiation failed.' },
      { status: 500 }
    )
  }
}
