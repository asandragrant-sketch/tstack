import { NextRequest, NextResponse } from 'next/server'
import { processAIChatMessage, AuthenticatedClientContext } from '@/lib/ai/engine'
import { getCurrentUser } from '@/lib/auth'
import {
  saveConversation,
  getConversationBySession,
  getOrders,
  getSupportTickets,
  getInvoices,
  upsertLead,
} from '@/lib/db'
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
      humanTakeover: conv ? Boolean(conv.humanTakeover) : false,
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

    const user = await getCurrentUser(req)
    const existingConv = await getConversationBySession(currentSessionId)

    // 1. Check if an Owner has taken over this conversation live
    if (existingConv?.humanTakeover) {
      const baseMessages = existingConv.messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }))
      const updatedMessages = [
        ...baseMessages,
        { sender: 'user' as const, text: message },
      ]

      await saveConversation({
        sessionId: currentSessionId,
        userId: user?.id || existingConv.userId,
        clientName: clientName || user?.fullName || existingConv.clientName,
        clientEmail: clientEmail || user?.email || existingConv.clientEmail,
        messages: updatedMessages,
        isEscalated: true,
        humanTakeover: true,
        escalationReason: existingConv.escalationReason || 'Live Owner Takeover Active',
      })

      await notifyOwners({
        type: 'client_message',
        subject: `[Live Takeover Chat] ${clientName || user?.fullName || 'Client'}: "${message.slice(0, 60)}"`,
        clientName: clientName || user?.fullName || 'Client',
        clientEmail: clientEmail || user?.email || existingConv.clientEmail,
        priority: 'urgent',
        details: {
          Message: message,
          'Session ID': currentSessionId,
          'Active Mode': 'Live Human Takeover',
        },
        actionLink: `/admin?tab=ai&session=${currentSessionId}`,
        actionLabel: 'Reply in Live Chat Console →',
      })

      return NextResponse.json({
        success: true,
        sessionId: currentSessionId,
        humanTakeover: true,
        reply:
          '✓ Delivered directly to the TSTACK Owner Console (Live Human Takeover is active). Daniel Kylan Jacob or Baron will reply to you right here.',
        shouldEscalate: false,
        actions: [],
        followUpPrompts: [],
      })
    }

    // 2. Build authenticated client context if the visitor is signed in
    let authenticatedClientContext: AuthenticatedClientContext | undefined
    if (user) {
      const [userOrders, userTickets, userInvoices] = await Promise.all([
        getOrders(user.id),
        getSupportTickets(user.id),
        getInvoices(user.id),
      ])
      authenticatedClientContext = {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        orders: userOrders.map((o) => {
          const completedMs = o.milestones.filter((m) => m.status === 'completed').length
          const progressPercent =
            o.status === 'completed'
              ? 100
              : Math.round((completedMs / Math.max(1, o.milestones.length)) * 100)
          return {
            orderNumber: o.orderNumber,
            serviceName: o.serviceName,
            price: o.price,
            status: o.status,
            paymentStatus: o.paymentStatus,
            progressPercent,
          }
        }),
        tickets: userTickets.map((t) => ({
          ticketNumber: t.ticketNumber,
          subject: t.subject,
          status: t.status,
          priority: t.priority,
        })),
        invoices: userInvoices.map((inv) => ({
          invoiceNumber: inv.invoiceNumber,
          amount: inv.amount,
          status: inv.paymentStatus,
        })),
      }
    }

    // 3. Process message with AI Engine 2.0
    const result = await processAIChatMessage({
      sessionId: currentSessionId,
      userMessage: message,
      clientName: clientName || user?.fullName,
      clientEmail: clientEmail || user?.email,
      conversationHistory: history,
      authenticatedClientContext,
    })

    // 4. Auto-upsert CRM Lead if email or authenticated user + project signals detected
    const resolvedEmail =
      result.extractedLead?.email || clientEmail || user?.email || existingConv?.clientEmail
    if (resolvedEmail && resolvedEmail.includes('@') && (result.extractedLead || result.shouldEscalate)) {
      await upsertLead({
        name: clientName || user?.fullName || existingConv?.clientName || 'AI Chat Prospect',
        email: resolvedEmail,
        serviceInterest: result.extractedLead?.serviceInterest || 'AI & Web Architecture',
        budget: result.extractedLead?.budget,
        timeline: result.extractedLead?.timeline,
        source: 'ai_assistant',
        noteText: `Captured from AI Chat (${currentSessionId}): "${message.slice(0, 160)}"`,
      })
    }

    const baseMessages = existingConv
      ? existingConv.messages.map((m) => ({ sender: m.sender, text: m.text }))
      : history

    const updatedMessages = [
      ...baseMessages,
      { sender: 'user' as const, text: message },
      { sender: 'assistant' as const, text: result.reply },
    ]

    await saveConversation({
      sessionId: currentSessionId,
      userId: user?.id || existingConv?.userId,
      clientName: clientName || user?.fullName || existingConv?.clientName,
      clientEmail: resolvedEmail,
      messages: updatedMessages,
      isEscalated: result.shouldEscalate || existingConv?.isEscalated,
      escalationReason: result.escalationReason || existingConv?.escalationReason,
    })

    if (result.shouldEscalate) {
      await notifyOwners({
        type: 'ai_escalation',
        subject: `[AI Assistant Inquiry] ${clientName || user?.fullName || 'Visitor'} asked: "${message.substring(0, 50)}"`,
        clientName: clientName || user?.fullName || 'Website Visitor',
        clientEmail: resolvedEmail || 'Pending contact info',
        priority: 'high',
        details: {
          'Visitor Message': message,
          'Escalation Context': result.escalationReason || 'Direct inquiry',
          'Session ID': currentSessionId,
        },
        actionLink: `/admin?tab=ai&session=${currentSessionId}`,
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
          "I apologize, our automated system encountered a momentary hiccup. You can click 'Contact Owner' above or reach our leadership directly at d.jacobwebpro@gmail.com and baronwebpro@gmail.com.",
      },
      { status: 500 }
    )
  }
}
