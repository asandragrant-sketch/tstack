import { NextRequest, NextResponse } from 'next/server'
import { createAuditLog, getConversationBySession, saveConversation, upsertLead } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, clientName, clientEmail, reason, extraNote, budget, timeline } = body

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

    // Automatically upsert CRM Lead so the inquiry appears in the Owner CRM Pipeline
    const lead = await upsertLead({
      name: clientName || 'AI Chat Visitor',
      email: clientEmail,
      serviceInterest: reason || 'Architecture Consultation',
      budget: budget || undefined,
      timeline: timeline || undefined,
      source: 'ai_assistant',
      status: 'qualified',
      noteText: extraNote || `Escalated from AI session ${sessionId}`,
    })

    await createAuditLog({
      actorId: clientEmail,
      actorEmail: clientEmail,
      actorRole: 'client',
      action: 'ai_chat_escalated',
      resource: 'conversation',
      resourceId: sessionId,
      metadata: { reason: reason || 'Consultation' },
    })

    const transcriptText = existingMessages
      .slice(-6)
      .map((m) => `[${m.sender.toUpperCase()}]: ${m.text}`)
      .join(' | ')

    // Dispatch notification to BOTH owners: d.jacobwebpro@gmail.com and baronwebpro@gmail.com
    const notifyResult = await notifyOwners({
      type: 'ai_escalation',
      subject: `[HUMAN ESCALATION] ${clientName || 'Client'} (${clientEmail}) requested direct architect assistance`,
      clientName: clientName || 'Client',
      clientEmail,
      priority: 'urgent',
      details: {
        'Client Name': clientName || 'Not specified',
        'Client Email': clientEmail,
        'CRM Lead ID': lead.id,
        'Escalation Reason': reason || 'Client requested direct assistance',
        'Client Note': extraNote || 'No additional note provided',
        'Recent Transcript': transcriptText || 'Direct escalation',
        'Session ID': sessionId,
      },
      actionLink: `/admin?tab=ai&session=${sessionId}`,
      actionLabel: 'Open Conversation in Dashboard →',
    })

    const userFacingMessage = notifyResult.externalEmailDelivered
      ? 'Your request has been sent to the TSTACK team.'
      : 'Your request has been recorded. The team will be notified through the available support channel.'

    return NextResponse.json({
      success: true,
      message: userFacingMessage,
      leadId: lead.id,
      externalEmailDelivered: notifyResult.externalEmailDelivered,
      emailStatus: notifyResult.emailStatus,
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

