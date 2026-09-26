import { TSTACK_KNOWLEDGE_BASE, KnowledgeSection } from './knowledgeBase'

export interface ProcessChatParams {
  sessionId: string
  userMessage: string
  clientName?: string
  clientEmail?: string
  conversationHistory: { sender: 'user' | 'assistant' | 'system'; text: string }[]
}

export interface ProcessChatResult {
  reply: string
  shouldEscalate: boolean
  escalationReason?: string
  confidence: number
}

// Phrases that explicitly demand human escalation
const ESCALATION_TRIGGERS = [
  'speak to human',
  'talk to a person',
  'human agent',
  'daniel jacob',
  'speak with daniel',
  'speak with baron',
  'speak with alison',
  'talk to founder',
  'custom contract',
  'enterprise agreement',
  'nda',
  'hipaa',
  'lawsuit',
  'emergency',
  'urgent problem',
  'broken system',
  'refund my money',
  'dispute',
  'phone call',
  'schedule a call',
  'can we call',
]

/**
 * Searches the verified knowledge base and returns matching sections with relevance scores
 */
function searchKnowledge(query: string): { section: KnowledgeSection; score: number }[] {
  const normalizedQuery = query.toLowerCase()
  const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 2)

  const results = TSTACK_KNOWLEDGE_BASE.map((section) => {
    let score = 0

    // Exact topic match
    if (normalizedQuery.includes(section.topic.toLowerCase())) {
      score += 10
    }

    // Keyword hits
    for (const kw of section.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += 3
      }
      for (const w of words) {
        if (kw.includes(w) || w.includes(kw)) {
          score += 1.5
        }
      }
    }

    // Content substring occurrences
    for (const w of words) {
      if (section.content.toLowerCase().includes(w)) {
        score += 0.5
      }
    }

    return { section, score }
  })

  return results.filter((r) => r.score > 2).sort((a, b) => b.score - a.score)
}

/**
 * Core processing function for customer support queries
 */
export async function processAIChatMessage(
  params: ProcessChatParams
): Promise<ProcessChatResult> {
  const { userMessage } = params
  const cleanMessage = userMessage.trim().toLowerCase()

  // 1. Check for immediate explicit escalation
  for (const trigger of ESCALATION_TRIGGERS) {
    if (cleanMessage.includes(trigger)) {
      return {
        reply:
          "This request requires direct assistance from our lead solutions architect Daniel Kylan Jacob or operations lead Baron. I am ready to escalate your inquiry directly to their inboxes with our complete conversation so they can follow up with you personally.",
        shouldEscalate: true,
        escalationReason: `Client triggered human assistance keyword: "${trigger}"`,
        confidence: 1.0,
      }
    }
  }

  // 2. Search verified factual knowledge base
  const matches = searchKnowledge(userMessage)

  // 3. Optional: If OpenAI / LLM key is configured in env, synthesize response with strict guardrails
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey && matches.length > 0) {
    try {
      const systemPrompt = `You are the official TSTACK AI Customer Support Specialist.
You represent TSTACK, an engineering agency led by Daniel Kylan Jacob (Founder & Lead Architect), David Alison (AI Architecture), and Baron (Operations Lead).
RULES:
1. Ground your answers strictly on the verified knowledge provided below.
2. NEVER invent prices, delivery guarantees, or services that are not in the context.
3. If the user asks something you cannot verify, clearly state: "I don't have verified information on that in our documentation. I can escalate this directly to Daniel Kylan Jacob and Baron for you."
4. Be professional, direct, concise, and helpful.

VERIFIED CONTEXT:
${matches.map((m) => m.section.content).join('\n\n')}`

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...params.conversationHistory.slice(-6).map((m) => ({
              role: m.sender === 'assistant' ? 'assistant' : 'user',
              content: m.text,
            })),
            { role: 'user', content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 450,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const aiText = data.choices?.[0]?.message?.content
        if (aiText) {
          const lowerAi = aiText.toLowerCase()
          const needsEscalation =
            lowerAi.includes('escalate') || lowerAi.includes("don't have verified")

          return {
            reply: aiText,
            shouldEscalate: needsEscalation,
            escalationReason: needsEscalation ? 'AI signaled missing verified facts' : undefined,
            confidence: 0.95,
          }
        }
      }
    } catch (err) {
      console.warn('[AI] External LLM call failed, falling back to deterministic engine:', err)
    }
  }

  // 4. Deterministic Knowledge Matcher (Zero external dependencies, 100% reliable)
  if (matches.length > 0) {
    const topMatch = matches[0]

    // Formulate clean, contextual response
    if (cleanMessage.includes('price') || cleanMessage.includes('cost') || cleanMessage.includes('how much')) {
      return {
        reply: `${topMatch.section.content}\n\nWould you like to configure your requirements on our Interactive Project Estimator (/), or submit a brief via our Contact page (/contact) for Daniel Kylan Jacob to provide a formal scope review?`,
        shouldEscalate: false,
        confidence: 0.88,
      }
    }

    if (cleanMessage.includes('service') || cleanMessage.includes('capabilities') || cleanMessage.includes('what do you do')) {
      return {
        reply: `${topMatch.section.content}\n\nYou can explore full technical deliverables in our Services Catalog (/services) or initiate an order protected by milestone escrow on our verified Fiverr profile (https://www.fiverr.com/s/bkdlzbX).`,
        shouldEscalate: false,
        confidence: 0.92,
      }
    }

    return {
      reply: topMatch.section.content,
      shouldEscalate: false,
      confidence: 0.85,
    }
  }

  // 5. Unknown query -> Guardrail rejection with immediate escalation offer
  return {
    reply:
      "I do not have verified specifications in our production documentation regarding your exact question. Because TSTACK engineers mission-critical business software, our lead solutions architect Daniel Kylan Jacob and operations director Baron review custom architecture inquiries personally.\n\nWould you like me to submit an escalation ticket with your email so they can respond directly within 24 business hours?",
    shouldEscalate: true,
    escalationReason: `Unanswered domain query: "${userMessage}"`,
    confidence: 0.3,
  }
}
