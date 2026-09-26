import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getReviews,
  createReview,
  updateReviewStatus,
  getOrders,
} from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true'

    if (all && user?.role === 'admin') {
      const reviews = await getReviews(false)
      return NextResponse.json({ success: true, reviews })
    }

    const reviews = await getReviews(true)
    return NextResponse.json({ success: true, reviews })
  } catch (err: any) {
    console.error('[Reviews GET API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load reviews.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Only authenticated clients can submit reviews.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { orderId, rating, comment, roleOrCompany } = body

    if (!rating || Number(rating) < 1 || Number(rating) > 5 || !comment || String(comment).trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a rating (1–5) and a detailed review comment.' },
        { status: 400 }
      )
    }

    const userOrders = await getOrders(user.id)
    const matchedOrder = userOrders.find((o) => o.id === orderId) || userOrders[0]
    if (!matchedOrder && user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Verified reviews require at least one project order associated with your account.',
        },
        { status: 403 }
      )
    }

    const resolvedOrderId = matchedOrder?.id || orderId || 'general_project'
    const resolvedOrderNumber = matchedOrder?.orderNumber || 'ORD-VERIFIED'
    const resolvedServiceName = matchedOrder?.serviceName || 'Enterprise AI & Web Engineering'

    const review = await createReview({
      userId: user.id,
      orderId: resolvedOrderId,
      orderNumber: resolvedOrderNumber,
      clientName: user.fullName,
      clientCompany: roleOrCompany || user.company || 'Verified Client',
      serviceName: resolvedServiceName,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: String(comment).trim(),
    })

    await notifyOwners({
      type: 'review_submitted',
      subject: `New Verified Client Review (${review.rating}★) from ${user.fullName}`,
      clientName: user.fullName,
      clientEmail: user.email,
      priority: 'normal',
      details: {
        Client: user.fullName,
        Service: resolvedServiceName,
        Rating: `${review.rating} / 5 Stars`,
        Comment: review.comment,
        Status: 'Pending Admin Moderation',
      },
      actionLink: `/admin?tab=appointments`,
      actionLabel: 'Approve Review in Admin Console →',
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted and is pending moderation by the TSTACK team.',
      review,
    })
  } catch (err: any) {
    console.error('[Reviews POST API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit review.' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const body = await req.json()
    const { id, status } = body

    const normalizedStatus = status === 'pending' ? 'pending_approval' : status
    if (!id || !['approved', 'rejected', 'pending_approval'].includes(normalizedStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid review ID or status.' }, { status: 400 })
    }

    const updated = await updateReviewStatus(id, normalizedStatus)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Review not found.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      review: updated,
    })
  } catch (err: any) {
    console.error('[Reviews PATCH API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to moderate review.' }, { status: 500 })
  }
}
