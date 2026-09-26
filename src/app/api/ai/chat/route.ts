import { NextRequest, NextResponse } from 'next/server'
import { processAIChatMessage } from '@/lib/ai/engine'
import { saveConversation, getConversationBySession } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, message, clientName, clientEmail, history = [] } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A message is required.' },
        { status: 400 }
      )
    }

    const currentSessionId =
      sessionId || `ses-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`

    // Process message with verified knowledge base & escalation rules
    const result = await processAIChatMessage({
      sessionId: currentSessionId,
      userMessage: message,
      clientName,
      clientEmail,
      conversationHistory: history,
    })

    // Construct full message log for persistence
    const updatedMessages = [
      ...history,
      { sender: 'user' as const, text: message },
      { sender: 'assistant' as const, text: result.reply },
    ]

    // Save to persistent database
    await saveConversation({
      sessionId: currentSessionId,
      clientName: clientName || undefined,
      clientEmail: clientEmail || undefined,
      messages: updatedMessages,
      isEscalated: result.shouldEscalate,
      escalationReason: result.escalationReason,
    })

    // If escalation triggered, dispatch alert to BOTH owners immediately
    if (result.shouldEscalate) {
      await notifyOwners({
        type: 'ai_escalation',
        subject: `[AI Escalation] Urgent Inquiry from ${clientName || 'Visitor'}`,
        clientName: clientName || 'Anonymous Visitor',
        clientEmail: clientEmail || 'Not provided',
        priority: 'urgent',
        details: {
          'Escalation Reason': result.escalationReason || 'Automatic AI safety trigger',
          'Client Inquiry': message,
          'Session ID': currentSessionId,
          'Transcript Length': `${updatedMessages.length} messages`,
        },
        actionLink: `/admin/messages?session=${currentSessionId}`,
        actionLabel: 'Review AI Transcript in Admin →',
      })
    }

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      reply: result.reply,
      shouldEscalate: result.shouldEscalate,
      escalationReason: result.escalationReason,
    })
  } catch (err: any) {
    console.error('[AI Chat API] Error:', err)
    return NextResponse.json(
      {
        success: false,
        reply:
          "I apologize, but our automated system encountered a temporary glitch. Please feel free to email our leadership directly at d.jacobwebpro@gmail.com and baronwebpro@gmail.com.",
      },
      { status: 500 }
    )
  }
}
