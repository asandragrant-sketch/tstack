import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth'
import {
  getOrderById,
  updateOrder,
  createPaymentAndInvoice,
  createAuditLog,
} from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      orderId,
      transactionRef,
      provider = 'stripe',
      method = 'credit_card',
      submitReferenceOnly = false,
    } = body

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

    // Case 1: Client submits a Fiverr Escrow or Wire Transfer reference for Owner Verification
    if (user.role !== 'admin' && (submitReferenceOnly || provider === 'fiverr_escrow' || provider === 'manual_invoice')) {
      if (!transactionRef || String(transactionRef).trim().length < 4) {
        return NextResponse.json(
          {
            success: false,
            error: 'Please provide a valid Fiverr Order ID or Wire Transfer Reference (minimum 4 characters).',
          },
          { status: 400 }
        )
      }

      const updatedOrder = await updateOrder(
        order.id,
        {
          clientNotes: `${order.clientNotes ? order.clientNotes + '\n' : ''}[Payment Reference Submitted (${provider})]: ${transactionRef.trim()}`,
        },
        { name: user.fullName, email: user.email, role: user.role }
      )

      await createAuditLog({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'payment_reference_submitted',
        resource: 'order',
        resourceId: order.id,
        metadata: { provider, reference: transactionRef.trim() },
      })

      await notifyOwners({
        type: 'order_placed',
        subject: `Payment Verification Requested: ${order.orderNumber} (${provider.toUpperCase()})`,
        clientName: user.fullName,
        clientEmail: user.email,
        priority: 'high',
        details: {
          'Order Number': order.orderNumber,
          Service: order.serviceName,
          Amount: `$${order.price.toLocaleString()} ${order.currency || 'USD'}`,
          'Submitted Reference': transactionRef.trim(),
          Channel: provider.toUpperCase(),
          'Client Email': user.email,
        },
        actionLink: `/admin?tab=orders&orderId=${order.id}`,
        actionLabel: 'Verify & Mark Paid in Admin Console →',
      })

      return NextResponse.json({
        success: true,
        pendingVerification: true,
        message:
          'Your payment reference has been recorded and sent to the TSTACK owners for verification. Once verified in the Admin Console, your invoice will be issued automatically.',
        order: updatedOrder,
      })
    }

    // Case 2: Non-admin attempting direct Stripe confirmation -> MUST verify against live Stripe API
    let verifiedTransactionRef = transactionRef || `tx_admin_${Date.now().toString(36)}`
    if (user.role !== 'admin') {
      const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()
      if (!stripeSecretKey) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Direct card payment confirmation is disabled because STRIPE_SECRET_KEY is not configured. Orders cannot be marked paid without verified Stripe settlement or Owner verification.',
          },
          { status: 400 }
        )
      }

      if (!transactionRef || !String(transactionRef).startsWith('pi_')) {
        return NextResponse.json(
          {
            success: false,
            error: 'A valid Stripe PaymentIntent ID (pi_...) is required to verify payment.',
          },
          { status: 400 }
        )
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16' as any,
      })

      const intent = await stripe.paymentIntents.retrieve(String(transactionRef))
      if (intent.status !== 'succeeded') {
        return NextResponse.json(
          {
            success: false,
            error: `Stripe PaymentIntent status is "${intent.status}". Payment has not settled.`,
          },
          { status: 400 }
        )
      }
      if (intent.metadata?.orderId && intent.metadata.orderId !== order.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'PaymentIntent metadata does not match this order.',
          },
          { status: 400 }
        )
      }
      verifiedTransactionRef = intent.id
    }

    // Record verified payment AND generate Invoice (INV-YYYY-XXXX)
    const { payment, invoice } = await createPaymentAndInvoice({
      orderId: order.id,
      userId: order.userId,
      amount: order.price,
      currency: order.currency || 'USD',
      provider: ((provider === 'fiverr_escrow' ? 'fiverr' : provider === 'manual_invoice' ? 'wire' : provider) as any) || 'stripe',
      transactionRef: verifiedTransactionRef,
      status: 'succeeded',
      metadata: {
        method,
        verifiedBy: user.role === 'admin' ? user.email : 'stripe_api',
        verifiedAt: new Date().toISOString(),
      },
    })

    const invoiceNum = invoice?.invoiceNumber || 'INV-ISSUED'

    const nextStatus =
      order.status === 'pending' ||
      order.status === 'order_created' ||
      order.status === 'payment_pending'
        ? order.requirements
          ? 'in_progress'
          : 'requirements_pending'
        : order.status

    const updatedOrder = await updateOrder(
      order.id,
      {
        paymentStatus: 'paid',
        status: nextStatus as any,
      },
      { name: user.fullName, email: user.email, role: user.role }
    )

    // Dispatch payment success notification to BOTH owners
    await notifyOwners({
      type: 'payment_success',
      subject: `Payment Verified: $${order.price.toLocaleString()} USD for Order ${order.orderNumber} (${invoiceNum})`,
      clientName: order.clientName || user.fullName,
      clientEmail: order.clientEmail || user.email,
      priority: 'high',
      details: {
        'Order Number': order.orderNumber,
        'Invoice Number': invoiceNum,
        Service: order.serviceName,
        'Amount Paid': `$${order.price.toLocaleString()} ${order.currency || 'USD'}`,
        'Transaction ID': verifiedTransactionRef,
        Provider: String(provider).toUpperCase(),
        'Verified By': user.role === 'admin' ? `Owner (${user.email})` : 'Stripe Live API',
        Timestamp: new Date().toISOString(),
      },
      actionLink: `/admin?tab=payments&orderId=${order.id}`,
      actionLabel: 'Inspect Payment & Invoice in Admin Dashboard →',
    })

    // Send receipt email to client
    await sendClientEmail(
      order.clientEmail || user.email,
      `Invoice & Receipt ${invoiceNum}: Payment Confirmed for ${order.orderNumber} - TSTACK`,
      `<h2>Payment Confirmed &amp; Invoice Issued</h2><p>Thank you, ${order.clientName || user.fullName}. Your payment of <strong>$${order.price.toLocaleString()} ${order.currency || 'USD'}</strong> for order <strong>${order.orderNumber}</strong> (${order.serviceName}) has been verified.</p><p><strong>Invoice Number:</strong> ${invoiceNum}</p><p>Please complete your Project Requirements form in the Client Portal so Daniel Kylan Jacob and Baron can begin engineering your milestones.</p><p>View your project hub: https://tstack-ten.vercel.app/portal</p>`
    )

    return NextResponse.json({
      success: true,
      message: `Payment confirmed and Invoice ${invoiceNum} issued.`,
      order: updatedOrder,
      payment,
      invoice,
    })
  } catch (err: any) {
    console.error('[Payment Confirm API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Payment confirmation failed.' },
      { status: 500 }
    )
  }
}

