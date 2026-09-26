import { NextRequest, NextResponse } from 'next/server'
import { processAIChatMessage } from '@/lib/ai/engine'
import { saveConversation, getConversationBySession } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId')
    if (!sessionId) {
      return NextResponse.json({ success: false, messages: [] })
    }

    const conv = await getConversationBySession(sessionId)
    return NextResponse.json({
      success: true,
      messages: conv ? conv.messages : [],
      isEscalated: conv ? conv.isEscalated : false,
    })
  } catch {
    return NextResponse.json({ success: false, messages: [] })
  }
}

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

    // Process message with revamped conversational engine
    const result = await processAIChatMessage({
      sessionId: currentSessionId,
      userMessage: message,
      clientName,
      clientEmail,
      conversationHistory: history,
    })

    // Merge with any existing server messages (e.g. if admin replied in the meantime)
    const existingConv = await getConversationBySession(currentSessionId)
    const baseMessages = existingConv
      ? existingConv.messages.map((m) => ({ sender: m.sender, text: m.text }))
      : history

    const updatedMessages = [
      ...baseMessages,
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

    // If escalation triggered, log notification for BOTH owners in the Notification Bar & Admin Console
    if (result.shouldEscalate) {
      await notifyOwners({
        type: 'ai_escalation',
        subject: `[AI Assistant Inquiry] ${clientName || 'Visitor'} asked: "${message.substring(0, 50)}"`,
        clientName: clientName || 'Website Visitor',
        clientEmail: clientEmail || 'Pending contact info',
        priority: 'high',
        details: {
          'Visitor Message': message,
          'Escalation Context': result.escalationReason || 'Direct inquiry',
          'Session ID': currentSessionId,
        },
        actionLink: `/admin/messages?session=${currentSessionId}`,
        actionLabel: 'Reply to Visitor in Admin Console →',
      })
    }

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      reply: result.reply,
      shouldEscalate: result.shouldEscalate,
      escalationReason: result.escalationReason,
      actions: result.actions || [],
      followUpPrompts: result.followUpPrompts || [],
    })
  } catch (err: any) {
    console.error('[AI Chat API] Error:', err)
    return NextResponse.json(
      {
        success: false,
        reply:
          "I apologize, our automated system encountered a momentary hiccup. You can click 'Human' above or reach our leadership directly at d.jacobwebpro@gmail.com and baronwebpro@gmail.com.",
      },
      { status: 500 }
    )
  }
}
