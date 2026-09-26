import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getActivityNotifications,
  createActivityNotification,
  markNotificationRead,
  markAllNotificationsRead,
  appendAdminReplyToChatOrTicket,
} from '@/lib/db'
import { sendClientEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const sessionId = req.nextUrl.searchParams.get('sessionId') || undefined

    let notifications = []

    if (user && user.role === 'admin') {
      notifications = await getActivityNotifications({ role: 'admin' })
    } else if (user && user.role === 'client') {
      notifications = await getActivityNotifications({
        role: 'client',
        userId: user.id,
        email: user.email,
        sessionId,
      })
    } else if (sessionId) {
      notifications = await getActivityNotifications({
        sessionId,
      })
    } else {
      return NextResponse.json({
        success: true,
        role: 'visitor',
        notifications: [],
        unreadCount: 0,
      })
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return NextResponse.json({
      success: true,
      role: user?.role || 'visitor',
      userEmail: user?.email,
      notifications: notifications.slice(0, 25),
      unreadCount,
    })
  } catch (err: any) {
    console.error('[Notifications GET API] Error:', err)
    return NextResponse.json({
      success: false,
      notifications: [],
      unreadCount: 0,
    })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()
    const { id, markAll, sessionId } = body

    if (id) {
      await markNotificationRead(id)
      return NextResponse.json({ success: true })
    }

    if (markAll) {
      if (user?.role === 'admin') {
        await markAllNotificationsRead({ role: 'admin' })
      } else if (user?.role === 'client') {
        await markAllNotificationsRead({
          role: 'client',
          userId: user.id,
          email: user.email,
          sessionId,
        })
      } else if (sessionId) {
        await markAllNotificationsRead({ sessionId })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const {
      recipientUserId,
      recipientEmail,
      sessionId,
      ticketId,
      clientName,
      subject,
      message,
    } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Reply message is required.' },
        { status: 400 }
      )
    }

    // 1. Append reply to the client's AI chat session or Support Ticket
    await appendAdminReplyToChatOrTicket({
      sessionId,
      ticketId,
      senderName: user.fullName || 'Daniel Kylan Jacob (TSTACK Lead Architect)',
      replyText: message.trim(),
    })

    // 2. Create live notification for the client's Notification Bar & Portal Bell
    const clientNotification = await createActivityNotification({
      type: 'client_message',
      title: subject || `New Message from ${user.fullName} (TSTACK)`,
      message: message.trim(),
      recipientRole: 'client',
      recipientUserId: recipientUserId || undefined,
      recipientEmail: recipientEmail || undefined,
      sessionId: sessionId || undefined,
      actionLink: ticketId ? '/portal' : '/portal',
      data: {
        senderName: user.fullName,
        senderEmail: user.email,
        clientName,
      },
    })

    // 3. Send email to the client if email is provided
    if (recipientEmail && recipientEmail.includes('@')) {
      await sendClientEmail(
        recipientEmail,
        subject || `Reply from ${user.fullName} — TSTACK Engineering`,
        `<div style="font-family:sans-serif;padding:20px;background:#0A0D14;color:#F8FAFC;border-radius:10px;">
          <h2 style="color:#3B82F6;margin-top:0;">Message from ${user.fullName} (TSTACK)</h2>
          <p style="font-size:14px;line-height:1.6;color:#E2E8F0;background:#101522;padding:16px;border-radius:8px;border:1px solid #1E293B;">
            ${message.trim().replace(/\n/g, '<br/>')}
          </p>
          <p style="font-size:12px;color:#94A3B8;">
            View and reply in your Client Portal: <a href="https://tstack-ten.vercel.app/portal" style="color:#60A5FA;">https://tstack-ten.vercel.app/portal</a>
          </p>
        </div>`
      )
    }

    return NextResponse.json({
      success: true,
      notification: clientNotification,
    })
  } catch (err: any) {
    console.error('[Notifications POST API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send reply' }, { status: 500 })
  }
}
