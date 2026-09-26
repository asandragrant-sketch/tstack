import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getSupportTickets, createSupportTicket } from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const tickets = user.role === 'admin' ? await getSupportTickets() : await getSupportTickets(user.id)
    return NextResponse.json({ success: true, tickets })
  } catch (err: any) {
    console.error('[Tickets GET API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to open a support ticket.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { subject, category, priority, message } = body

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'A clear ticket subject is required (minimum 3 characters).' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide ticket details (minimum 5 characters).' },
        { status: 400 }
      )
    }

    const ticket = await createSupportTicket({
      userId: user.id,
      clientName: user.fullName,
      clientEmail: user.email,
      subject: subject.trim(),
      category: category || 'General Architecture',
      priority: priority || 'medium',
      message: message.trim(),
    })

    // Notify BOTH owners: d.jacobwebpro@gmail.com and baronwebpro@gmail.com
    await notifyOwners({
      type: 'support_ticket',
      subject: `Support Ticket [${ticket.ticketNumber}]: ${ticket.subject}`,
      clientName: user.fullName,
      clientEmail: user.email,
      priority: ticket.priority === 'urgent' ? 'urgent' : ticket.priority === 'high' ? 'high' : 'normal',
      details: {
        'Ticket ID': ticket.ticketNumber,
        Category: ticket.category,
        Priority: ticket.priority.toUpperCase(),
        'Client Name': user.fullName,
        'Client Email': user.email,
        Message: ticket.messages[0]?.message || '',
      },
      actionLink: `/admin/messages?ticketId=${ticket.id}`,
      actionLabel: 'Respond to Ticket in Admin Dashboard →',
    })

    await sendClientEmail(
      user.email,
      `Support Request Received: ${ticket.ticketNumber}`,
      `<h2>Support Request [${ticket.ticketNumber}]</h2><p>Your support ticket has been received by Daniel Kylan Jacob and Baron. An architect will respond within standard SLA windows.</p>`
    )

    return NextResponse.json({ success: true, ticket })
  } catch (err: any) {
    console.error('[Tickets POST API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create support ticket' }, { status: 500 })
  }
}
