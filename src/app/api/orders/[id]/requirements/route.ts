import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getOrderById, submitOrderRequirements } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
    }

    const orderId = params.id
    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })
    }

    if (user.role !== 'admin' && order.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only submit requirements for your own orders.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      projectTitle,
      businessName,
      businessDescription,
      targetAudience,
      featuresRequired,
      requiredFunctionality,
      designPreferences,
      competitorExamples,
      deadlineGoals,
      domainHostingDetails,
      apiCredentialsOrNotes,
    } = body

    const resolvedBusinessName = String(businessName || projectTitle || order.serviceName).trim()
    const resolvedDescription = String(businessDescription || '').trim()
    const resolvedFeatures = String(featuresRequired || requiredFunctionality || '').trim()

    if (!resolvedBusinessName || !resolvedDescription || !resolvedFeatures) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project Title, Business Description, and Features Required are mandatory.',
        },
        { status: 400 }
      )
    }

    const updatedOrder = await submitOrderRequirements(
      order.id,
      {
        businessName: resolvedBusinessName,
        businessDescription: resolvedDescription,
        websiteType: order.serviceName,
        requiredPages: String(deadlineGoals || 'Standard Architecture').trim(),
        requiredFunctionality: resolvedFeatures,
        targetAudience: String(targetAudience || '').trim(),
        designPreferences: String(designPreferences || '').trim(),
        competitorWebsites: String(competitorExamples || '').trim(),
        domainInfo: String(domainHostingDetails || '').trim(),
        additionalRequirements: String(apiCredentialsOrNotes || '').trim(),
      },
      { id: user.id, name: user.fullName, email: user.email }
    )

    await notifyOwners({
      type: 'requirements_submitted',
      subject: `Project Requirements Submitted: ${order.orderNumber} (${resolvedBusinessName})`,
      clientName: user.fullName,
      clientEmail: user.email,
      priority: 'high',
      details: {
        'Order Number': order.orderNumber,
        'Project Title': resolvedBusinessName,
        Service: order.serviceName,
        'Features Required': resolvedFeatures.slice(0, 200),
        'Deadline Goals': deadlineGoals || 'Standard schedule',
        'Client Email': user.email,
      },
      actionLink: `/admin?tab=orders&orderId=${order.id}`,
      actionLabel: 'Review Requirements in Admin Console →',
    })

    return NextResponse.json({
      success: true,
      message: 'Project requirements saved and dispatched to Daniel Kylan Jacob and Baron.',
      order: updatedOrder,
    })
  } catch (err: any) {
    console.error('[Order Requirements API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit requirements.' },
      { status: 500 }
    )
  }
}
