import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getOrderById, updateOrder, createPayment } from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text()
    let event: Stripe.Event

    if (stripeSecretKey && webhookSecret) {
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' as any })
      const signature = req.headers.get('stripe-signature') || ''

      try {
        event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret)
      } catch (err: any) {
        console.error('[Stripe Webhook] Signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    } else {
      // In dev or sandbox environments where secrets are not yet registered
      try {
        event = JSON.parse(bodyText) as Stripe.Event
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
      }
    }

    // Handle payment events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId
        const orderNumber = paymentIntent.metadata?.orderNumber
        const clientEmail = paymentIntent.receipt_email || paymentIntent.metadata?.clientEmail

        if (orderId) {
          const order = await getOrderById(orderId)
          if (order) {
            await updateOrder(order.id, {
              paymentStatus: 'paid',
              status: order.status === 'pending' ? 'in_progress' : order.status,
            })

            await createPayment({
              orderId: order.id,
              userId: order.userId,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency.toUpperCase(),
              provider: 'stripe',
              transactionRef: paymentIntent.id,
              status: 'succeeded',
              metadata: {
                paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
                stripeEventId: event.id,
              },
            })

            // Notify BOTH owners: d.jacobwebpro@gmail.com and baronwebpro@gmail.com
            await notifyOwners({
              type: 'payment_success',
              subject: `[Stripe Webhook] Payment Verified: $${(paymentIntent.amount / 100).toFixed(2)} USD for Order ${order.orderNumber}`,
              clientName: order.clientName,
              clientEmail: order.clientEmail,
              priority: 'high',
              details: {
                'Order Number': order.orderNumber,
                Amount: `$${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`,
                'Stripe PaymentIntent ID': paymentIntent.id,
                'Client Name': order.clientName,
                'Client Email': order.clientEmail,
                Service: order.serviceName,
              },
              actionLink: `/admin/payments?orderId=${order.id}`,
            })

            if (clientEmail) {
              await sendClientEmail(
                clientEmail,
                `Receipt: Order ${order.orderNumber} Payment Verified`,
                `<h2>Payment Receipt</h2><p>Your payment of $${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()} has been confirmed. Work on ${order.serviceName} is now active.</p>`
              )
            }
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          const order = await getOrderById(orderId)
          if (order) {
            await createPayment({
              orderId: order.id,
              userId: order.userId,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency.toUpperCase(),
              provider: 'stripe',
              transactionRef: paymentIntent.id,
              status: 'failed',
              errorMessage: paymentIntent.last_payment_error?.message || 'Charge declined',
            })

            // Alert BOTH owners to failed transaction
            await notifyOwners({
              type: 'payment_failed',
              subject: `[Payment Failed Alert] Order ${order.orderNumber} - Charge Declined`,
              clientName: order.clientName,
              clientEmail: order.clientEmail,
              priority: 'urgent',
              details: {
                'Order Number': order.orderNumber,
                'Declined Amount': `$${(paymentIntent.amount / 100).toFixed(2)}`,
                'Error Message': paymentIntent.last_payment_error?.message || 'Unknown decline reason',
                'Client Email': order.clientEmail,
              },
              actionLink: `/admin/orders?orderId=${order.id}`,
            })
          }
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Stripe Webhook] Handler error:', err)
    return NextResponse.json({ error: 'Webhook processing failure' }, { status: 500 })
  }
}
