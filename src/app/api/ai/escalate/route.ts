import { NextRequest, NextResponse } from 'next/server'
import { getConversationBySession, saveConversation } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, clientName, clientEmail, reason, extraNote } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required.' },
        { status: 400 }
      )
    }

    if (!clientEmail || !clientEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required so our team can reply to you.' },
        { status: 400 }
      )
    }

    const conv = await getConversationBySession(sessionId)
    const existingMessages = conv
      ? conv.messages.map((m) => ({ sender: m.sender, text: m.text }))
      : []

    if (extraNote) {
      existingMessages.push({
        sender: 'user',
        text: `[Client Request for Human Lead]: ${extraNote}`,
      })
    }

    await saveConversation({
      sessionId,
      clientName,
      clientEmail,
      messages: existingMessages,
      isEscalated: true,
      escalationReason:
        reason || 'Client requested direct contact with Daniel Kylan Jacob or Baron',
    })

    const transcriptText = existingMessages
      .slice(-6)
      .map((m) => `[${m.sender.toUpperCase()}]: ${m.text}`)
      .join(' | ')

    // Dispatch urgent notification to BOTH owners: d.jacobwebpro@gmail.com and baronwebpro@gmail.com
    const notifyResult = await notifyOwners({
      type: 'ai_escalation',
      subject: `[HUMAN ESCALATION] ${clientName || 'Client'} (${clientEmail}) requested direct architect assistance`,
      clientName: clientName || 'Client',
      clientEmail,
      priority: 'urgent',
      details: {
        'Client Name': clientName || 'Not specified',
        'Client Email': clientEmail,
        'Escalation Reason': reason || 'Client requested direct assistance',
        'Client Note': extraNote || 'No additional note provided',
        'Recent Transcript': transcriptText || 'Direct escalation',
        'Session ID': sessionId,
      },
      actionLink: `/admin/messages?session=${sessionId}`,
      actionLabel: 'Open Conversation in Dashboard →',
    })

    return NextResponse.json({
      success: true,
      message:
        'Your inquiry has been logged in the Owner Dashboard and dispatched to Daniel Kylan Jacob (d.jacobwebpro@gmail.com) and Baron (baronwebpro@gmail.com).',
      externalEmailDelivered: notifyResult.externalEmailDelivered,
      formsubmitNeedsActivation: notifyResult.formsubmitNeedsActivation,
      gmailComposeUrl: notifyResult.gmailComposeUrl,
      mailtoUrl: notifyResult.mailtoUrl,
      dispatchedChannels: notifyResult.dispatchedChannels,
    })
  } catch (err: any) {
    console.error('[AI Escalate API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to submit escalation request.' },
      { status: 500 }
    )
  }
}
