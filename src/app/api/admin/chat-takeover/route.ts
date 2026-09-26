import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  toggleConversationTakeover,
  getConversationBySession,
  saveConversation,
} from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const body = await req.json()
    const { sessionId, action = 'toggle', humanTakeover, replyText } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID is required.' }, { status: 400 })
    }

    if (action === 'reply' && replyText) {
      const existing = await getConversationBySession(sessionId)
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Conversation not found.' }, { status: 404 })
      }

      const updatedMessages = [
        ...existing.messages.map((m) => ({
          sender: m.sender,
          senderName: m.senderName,
          text: m.text,
        })),
        {
          sender: 'owner' as const,
          senderName: user.fullName || 'Daniel Kylan Jacob (Owner)',
          text: `[Owner Live Reply — ${user.fullName}]: ${String(replyText).trim()}`,
        },
      ]

      const updated = await saveConversation({
        sessionId: existing.sessionId,
        userId: existing.userId,
        clientName: existing.clientName,
        clientEmail: existing.clientEmail,
        messages: updatedMessages,
        isEscalated: existing.isEscalated,
        humanTakeover: existing.humanTakeover,
        escalationReason: existing.escalationReason,
      })

      return NextResponse.json({
        success: true,
        conversation: updated,
      })
    }

    const updated = await toggleConversationTakeover(
      sessionId,
      Boolean(humanTakeover)
    )

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Conversation not found.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      conversation: updated,
    })
  } catch (err: any) {
    console.error('[Admin Chat Takeover API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update conversation takeover state.' },
      { status: 500 }
    )
  }
}
