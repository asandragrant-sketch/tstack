import { TSTACK_KNOWLEDGE_BASE, KnowledgeSection } from './knowledgeBase'

export interface ChatAction {
  label: string
  type: 'escalate' | 'link' | 'prompt'
  value: string
}

export interface AuthenticatedClientContext {
  userId: string
  fullName: string
  email: string
  orders: {
    orderNumber: string
    serviceName: string
    price: number
    status: string
    paymentStatus: string
    progressPercent: number
  }[]
  tickets: {
    ticketNumber: string
    subject: string
    status: string
    priority: string
  }[]
  invoices: {
    invoiceNumber: string
    amount: number
    status: string
  }[]
}

export interface ProcessChatParams {
  sessionId: string
  userMessage: string
  clientName?: string
  clientEmail?: string
  conversationHistory: { sender: 'user' | 'assistant' | 'system' | 'owner'; text: string }[]
  authenticatedClientContext?: AuthenticatedClientContext
}

export interface ProcessChatResult {
  reply: string
  shouldEscalate: boolean
  escalationReason?: string
  confidence: number
  actions?: ChatAction[]
  followUpPrompts?: string[]
  extractedLead?: {
    email?: string
    serviceInterest?: string
    budget?: string
    timeline?: string
  }
}

/**
 * Normalizes and scores knowledge sections with support for short tokens (e.g. "ai", "ui", "db")
 */
function searchKnowledge(query: string): { section: KnowledgeSection; score: number }[] {
  const normalizedQuery = query.toLowerCase().trim()
  const words = normalizedQuery
    .replace(/[^\w\s$]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2)

  const results = TSTACK_KNOWLEDGE_BASE.map((section) => {
    let score = 0

    if (normalizedQuery.includes(section.topic.toLowerCase())) {
      score += 12
    }

    for (const kw of section.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += 4
      }
      for (const w of words) {
        if (kw === w) {
          score += 3
        } else if (w.length >= 3 && (kw.includes(w) || w.includes(kw))) {
          score += 1.5
        }
      }
    }

    for (const w of words) {
      if (w.length >= 3 && section.content.toLowerCase().includes(w)) {
        score += 0.6
      }
    }

    return { section, score }
  })

  return results.filter((r) => r.score >= 2).sort((a, b) => b.score - a.score)
}

/**
 * Extracts potential lead qualification signals (email, budget, timeline, service) from user message
 */
function extractLeadSignals(message: string) {
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  const budgetMatch = message.match(/(\$\s?\d[\d,]*(?:\s?k)?|\d+\s?k\s?(?:usd|budget)?)/i)
  const timelineMatch = message.match(/(\d+\s*(?:day|week|month)s?|asap|urgent|this month|next month)/i)

  let serviceInterest: string | undefined
  if (/(agent|chatbot|rag|llm|openai|gpt)/i.test(message)) {
    serviceInterest = 'Custom AI Agents & RAG Systems'
  } else if (/(automation|workflow|zapier|make|n8n|crm)/i.test(message)) {
    serviceInterest = 'AI Workflow Automation'
  } else if (/(ecommerce|shop|stripe|store)/i.test(message)) {
    serviceInterest = 'E-Commerce & Payment Platform'
  } else if (/(website|nextjs|web app|portal|saas|dashboard)/i.test(message)) {
    serviceInterest = 'Full-Stack Web Application'
  }

  if (emailMatch || budgetMatch || timelineMatch || serviceInterest) {
    return {
      email: emailMatch ? emailMatch[0] : undefined,
      budget: budgetMatch ? budgetMatch[0] : undefined,
      timeline: timelineMatch ? timelineMatch[0] : undefined,
      serviceInterest,
    }
  }
  return undefined
}

/**
 * Conversational & Grounded AI Engine 2.0 for TSTACK
 */
export async function processAIChatMessage(
  params: ProcessChatParams
): Promise<ProcessChatResult> {
  const { userMessage, authenticatedClientContext } = params
  const clean = userMessage.trim().toLowerCase()
  const extractedLead = extractLeadSignals(userMessage)

  // 0. AUTHENTICATED CLIENT ORDER / TICKET / INVOICE STATUS LOOKUP
  if (
    /(my order|order status|my project|my ticket|support ticket|my invoice|track order|where is my order|project progress)/i.test(
      clean
    )
  ) {
    if (!authenticatedClientContext) {
      return {
        reply:
          "For your security, I only look up order statuses, support tickets, and invoices for **authenticated clients**.\n\nPlease sign in to your **Client Portal (`/portal`)** using your account email and password. Once signed in, you can ask me here or view your live order timeline, project requirements form, file center, and downloadable invoices (`INV-YYYY-XXXX`).",
        shouldEscalate: false,
        confidence: 1.0,
        extractedLead,
        actions: [
          { label: 'Sign In to Client Portal', type: 'link', value: '/portal' },
          { label: 'Message Daniel & Baron', type: 'escalate', value: 'Order Status Inquiry' },
        ],
        followUpPrompts: [
          'How do I submit project requirements?',
          'How can I contact Daniel & Baron directly?',
        ],
      }
    }

    const { fullName, orders, tickets, invoices } = authenticatedClientContext
    const orderSummary =
      orders.length > 0
        ? orders
            .slice(0, 4)
            .map(
              (o) =>
                `• **${o.orderNumber}** (${o.serviceName}): Status \`${o.status.toUpperCase()}\` • Payment \`${o.paymentStatus.toUpperCase()}\` • Progress **${o.progressPercent}%** ($${o.price.toLocaleString()})`
            )
            .join('\n')
        : '• You currently have no active orders under your account.'

    const ticketSummary =
      tickets.length > 0
        ? tickets
            .slice(0, 3)
            .map((t) => `• **${t.ticketNumber}** (${t.subject}): \`${t.status.toUpperCase()}\``)
            .join('\n')
        : '• No open support tickets.'

    const invoiceSummary =
      invoices.length > 0
        ? invoices
            .slice(0, 3)
            .map((inv) => `• **${inv.invoiceNumber}**: $${inv.amount.toLocaleString()} (\`${inv.status.toUpperCase()}\`)`)
            .join('\n')
        : '• No issued invoices yet.'

    return {
      reply: `Hello **${fullName}**! Here is the real-time status of your authenticated TSTACK workspace:\n\n**Your Project Orders:**\n${orderSummary}\n\n**Your Support Tickets:**\n${ticketSummary}\n\n**Your Invoices:**\n${invoiceSummary}\n\nYou can upload files, submit project requirements, or download invoices directly inside your **Client Portal**.`,
      shouldEscalate: false,
      confidence: 1.0,
      extractedLead,
      actions: [
        { label: 'Open My Client Portal', type: 'link', value: '/portal' },
        { label: 'Message Project Architects', type: 'escalate', value: 'Authenticated Client Support' },
      ],
      followUpPrompts: [
        'How do I upload project files?',
        'Can I schedule a discovery call?',
      ],
    }
  }

  // 0.5 APPOINTMENT / DISCOVERY CALL BOOKING INTENT
  if (/(book a call|discovery call|schedule a call|schedule meeting|appointment|zoom|google meet|calendar)/i.test(clean)) {
    return {
      reply:
        "You can schedule a **1-on-1 Technical Discovery Call** directly with **Daniel Kylan Jacob** (Founder & Lead Solutions Architect) and **Baron** (Operations Lead)!\n\nIn our Client Portal under the **Discovery Calls** tab, you can pick your preferred date, time slot, timezone, and topic. Once booked, both owners are notified immediately and your meeting link is issued.",
      shouldEscalate: false,
      confidence: 0.98,
      extractedLead,
      actions: [
        { label: '📅 Book Discovery Call in Portal', type: 'link', value: '/portal?tab=appointments' },
        { label: '📩 Leave Email / WhatsApp Instead', type: 'escalate', value: 'Discovery Call Request' },
      ],
      followUpPrompts: [
        'What are your services and prices?',
        'How does project onboarding work?',
      ],
    }
  }

  // 1. GREETINGS & CONVERSATIONAL OPENERS
  if (
    /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|yo|sup|howdy|start|help|are you there|is anyone there|how are you)/i.test(
      clean
    ) &&
    clean.length < 40
  ) {
    return {
      reply:
        "Hello! Welcome to **TSTACK**. I'm your AI Solutions Architect.\n\nI can help you right away with:\n• **Web & Software Engineering** (Next.js platforms, E-Commerce, SaaS portals)\n• **AI Automation & Custom Agents** (CRM pipelines, RAG knowledge bots)\n• **Verified Pricing, Order Statuses & Discovery Call Booking**\n• **Direct Contact / WhatsApp** with our founder **Daniel Kylan Jacob** and operations lead **Baron**\n\nWhat kind of project or question can I help you with today?",
      shouldEscalate: false,
      confidence: 1.0,
      extractedLead,
      actions: [
        { label: 'View Services & Pricing', type: 'prompt', value: 'What are your services and prices?' },
        { label: '📅 Book Discovery Call', type: 'link', value: '/portal?tab=appointments' },
        { label: 'Message Daniel & Baron', type: 'escalate', value: 'Direct Architect Contact' },
      ],
      followUpPrompts: [
        'How much does a custom website or web app cost?',
        'What is my order status?',
        'How can I contact you on WhatsApp or Gmail?',
      ],
    }
  }

  // 2. GRATITUDE / CLOSINGS
  if (/^(thank|thanks|thx|appreciate|awesome|great|ok|okay|cool|got it|perfect)/i.test(clean) && clean.length < 35) {
    return {
      reply:
        "You're very welcome! If you're ready to start a project, you can configure an order directly in our **Client Portal (/portal)**, order with 100% escrow on **Fiverr**, or click **Connect with Daniel & Baron** below to leave your email or WhatsApp number.",
      shouldEscalate: false,
      confidence: 1.0,
      actions: [
        { label: 'Connect with Daniel & Baron', type: 'escalate', value: 'Project Follow-up' },
        { label: 'Enter Client Portal', type: 'link', value: '/portal' },
        { label: 'Start Project Brief', type: 'link', value: '/contact' },
      ],
      followUpPrompts: [
        'What are typical delivery timelines?',
        'How does Fiverr milestone escrow work?',
      ],
    }
  }

  // 3. WHATSAPP / PHONE / DIRECT HUMAN CONTACT / OWNER ESCALATION
  if (
    /(whatsapp|whats app|phone|call|number|telegram|reach out|contact|gmail|email|speak|talk|human|person|agent|owner|founder|daniel|kylan|jacob|baron|alison)/i.test(
      clean
    )
  ) {
    return {
      reply:
        "You can reach our leadership team directly through our verified executive channels:\n\n• **Daniel Kylan Jacob (Founder & Lead Architect)**: `d.jacobwebpro@gmail.com`\n• **Baron (Operations & Project Delivery)**: `baronwebpro@gmail.com`\n• **David Alison (AI Architecture)**: `davidalisonwebpro@gmail.com`\n• **Verified Fiverr Direct Messenger**: https://www.fiverr.com/s/bkdlzbX\n\n**Want us to message you on WhatsApp or Gmail right now?**\nClick the **Send Direct Message / WhatsApp Request** button below and enter your WhatsApp number or email—it dispatches an instant alert to both **Daniel Kylan Jacob** and **Baron**!",
      shouldEscalate: true,
      escalationReason: `Visitor requested direct contact / WhatsApp ("${userMessage}")`,
      confidence: 0.98,
      actions: [
        { label: '📩 Send WhatsApp / Email to Daniel & Baron', type: 'escalate', value: 'WhatsApp & Direct Contact Request' },
        { label: 'Open Direct Contact Form', type: 'link', value: '/contact' },
        { label: 'Message on Fiverr', type: 'link', value: 'https://www.fiverr.com/s/bkdlzbX' },
      ],
      followUpPrompts: [
        'What services & packages do you offer?',
        'How does payment and escrow work?',
      ],
    }
  }

  // 4. PRICING, COST, PACKAGES & BUDGETS
  if (/(price|pricing|cost|how much|budget|package|rate|quote|charge|fee|\$|dollar|afford)/i.test(clean)) {
    return {
      reply:
        "Here are **TSTACK's verified engineering packages** (all backed by milestone gates and 100% code ownership):\n\n1. **AI Automation & Workflows** — **$1,250 USD** *(5–8 business days)*\n   Webhook orchestration, API pipelines & CRM data sync.\n2. **CRM & Revenue Operations Architecture** — **$1,850 USD** *(7–10 business days)*\n   Lead routing, attribution pipelines & executive telemetry.\n3. **Custom AI Agents & RAG Knowledge Systems** — **$2,850 USD** *(8–12 business days)*\n   Autonomous support/research agents grounded on your business data.\n4. **Full-Stack Next.js Web Platform & Client Portal** — **$3,900 USD** *(10–14 business days)*\n   Custom web application, authentication, dashboard & Stripe checkout.\n5. **Bespoke Enterprise Sprint** — **$5,000+ USD**\n\nYou can commission any package in our **Client Portal (/portal)**, request a custom quote on **/contact**, or fund via **Fiverr Escrow**.",
      shouldEscalate: false,
      confidence: 0.96,
      actions: [
        { label: 'Commission in Client Portal', type: 'link', value: '/portal' },
        { label: 'Request Custom Quote', type: 'escalate', value: 'Custom Pricing Quote' },
        { label: 'Order via Fiverr Escrow', type: 'link', value: 'https://www.fiverr.com/s/bkdlzbX' },
      ],
      followUpPrompts: [
        'How does milestone payment work?',
        'Can I talk to Daniel Kylan Jacob about a custom scope?',
        'How fast can you deliver my project?',
      ],
    }
  }

  // 5. WEBSITE, WEB APP, E-COMMERCE, SAAS & UI/UX DEVELOPMENT
  if (
    /(website|web app|webapp|e-commerce|ecommerce|store|shop|shopify|wordpress|landing page|nextjs|react|frontend|backend|fullstack|full-stack|portal|dashboard|design|ui|ux|saas|software|build|develop)/i.test(
      clean
    ) &&
    !/(ai agent|rag|automation only)/i.test(clean)
  ) {
    return {
      reply:
        "Yes! **TSTACK** specializes in high-conversion, production-grade **Web Applications, Custom Business Websites, E-Commerce Platforms, and Client Portals**.\n\n**What we engineer for you:**\n• **Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS, Node.js, PostgreSQL, and Stripe/PayPal/Escrow payment integrations.\n• **Features**: Custom client & admin dashboards, real-time notifications, SEO architecture, sub-second page speeds, and mobile-first responsive UI.\n• **Turnaround**: **10 to 14 business days** structured into 3 verifiable sprint milestones.\n• **Ownership**: You receive 100% of the GitHub source code upon completion.\n\nWould you like to configure your web project in our **Client Portal** or discuss your requirements directly with **Daniel Kylan Jacob**?",
      shouldEscalate: false,
      confidence: 0.95,
      actions: [
        { label: 'Configure Web Project in Portal', type: 'link', value: '/portal' },
        { label: 'Discuss Project with Daniel & Baron', type: 'escalate', value: 'Web Development Inquiry' },
        { label: 'View Web & AI Fiverr Gig', type: 'link', value: 'https://www.fiverr.com/s/432kmGk' },
      ],
      followUpPrompts: [
        'How much does a full-stack website cost?',
        'Can you integrate AI and Stripe into my website?',
        'How do I get started?',
      ],
    }
  }

  // 6. AI AUTOMATION, WORKFLOWS, CHATBOTS & RAG AGENTS
  if (/(ai|automation|workflow|agent|rag|bot|chatbot|llm|openai|gpt|pipeline|webhook|crm|hubspot|salesforce|airtable|zapier|make|n8n)/i.test(clean)) {
    return {
      reply:
        "**TSTACK** builds production **AI Automation Pipelines** and **Autonomous AI Agents** grounded strictly on your company's data:\n\n1. **AI Workflow Automation ($1,250 | 5–8 Business Days)**:\n   Automated webhook ingestion, CRM synchronization (HubSpot, Salesforce, Airtable), lead routing, and document data extraction.\n2. **Custom AI Agents & RAG Systems ($2,850 | 8–12 Business Days)**:\n   24/7 customer support assistants, lead qualification bots, and private vector knowledge bases with human escalation pipelines.\n\nYou can launch an AI sprint directly in our **Client Portal (/portal)** or order on our verified **Fiverr AI Gigs**!",
      shouldEscalate: false,
      confidence: 0.95,
      actions: [
        { label: 'AI Automation Fiverr Gig', type: 'link', value: 'https://www.fiverr.com/s/qbD3WD5' },
        { label: 'AI Agents & Web Fiverr Gig', type: 'link', value: 'https://www.fiverr.com/s/432kmGk' },
        { label: 'Speak with AI Architect', type: 'escalate', value: 'AI Architecture Consultation' },
      ],
      followUpPrompts: [
        'How long does an AI agent take to build?',
        'Do I own 100% of the source code?',
        'Contact Daniel Kylan Jacob & Baron',
      ],
    }
  }

  // 7. PAYMENTS, STRIPE & ESCROW
  if (/(pay|payment|stripe|credit card|escrow|fiverr|paypal|wire|invoice|safe|refund|guarantee)/i.test(clean)) {
    return {
      reply:
        "We provide **100% verified, milestone-protected payment options**:\n\n• **Stripe Direct Card Checkout (`/portal`)**: Register a free Client Account in `/portal`, select your service package, and pay securely via 256-bit TLS Stripe checkout with instant invoice receipts.\n• **Verified Fiverr Milestone Escrow**: Prefer neutral third-party escrow? Order on our official Fiverr Pro Gigs (`https://www.fiverr.com/s/bkdlzbX`) where funds are only released after you test and approve each milestone.\n• **Corporate Bank Wire / ACH**: Available for enterprise contracts.",
      shouldEscalate: false,
      confidence: 0.95,
      actions: [
        { label: 'Open Client Portal Checkout', type: 'link', value: '/portal' },
        { label: 'Order via Fiverr Escrow', type: 'link', value: 'https://www.fiverr.com/s/bkdlzbX' },
      ],
      followUpPrompts: [
        'What are the milestone gates?',
        'What are your service package prices?',
      ],
    }
  }

  // 8. SEARCH KNOWLEDGE BASE FOR OTHER QUERIES (Timelines, IP Ownership, Team, Portal)
  const matches = searchKnowledge(userMessage)
  if (matches.length > 0) {
    const topMatch = matches[0]
    return {
      reply: `${topMatch.section.content}\n\nNeed a custom architecture review? Click **Connect with Daniel & Baron** below and we will follow up with you personally.`,
      shouldEscalate: false,
      confidence: 0.88,
      actions: [
        { label: 'Connect with Daniel & Baron', type: 'escalate', value: topMatch.section.topic },
        { label: 'Explore Services', type: 'link', value: '/services' },
        { label: 'Open Client Portal', type: 'link', value: '/portal' },
      ],
      followUpPrompts: [
        'What are your pricing packages?',
        'How can I contact you on WhatsApp or Gmail?',
      ],
    }
  }

  // 9. FALLBACK FOR BESPOKE / CUSTOM QUESTIONS (Without hijacking the chat screen!)
  return {
    reply:
      "That sounds like a custom requirement! Here is how **TSTACK** can help:\n\n• **Custom Web, SaaS & E-Commerce Platforms** (Next.js / React / Node.js)\n• **Bespoke AI Agents & Workflow Automations**\n• **Direct Architect Consultation** with **Daniel Kylan Jacob** (`d.jacobwebpro@gmail.com`) and **Baron** (`baronwebpro@gmail.com`)\n\nClick **📩 Send Direct Message to Daniel & Baron** below to share your email or WhatsApp number so our lead architects can reply to you directly!",
    shouldEscalate: true,
    escalationReason: `Custom project inquiry: "${userMessage}"`,
    confidence: 0.75,
    actions: [
      { label: '📩 Send Direct Message to Daniel & Baron', type: 'escalate', value: userMessage },
      { label: 'Submit Project Brief (/contact)', type: 'link', value: '/contact' },
      { label: 'Commission in Portal (/portal)', type: 'link', value: '/portal' },
    ],
    followUpPrompts: [
      'Show me your pricing packages',
      'What is your WhatsApp / direct email?',
      'How does Fiverr escrow work?',
    ],
  }
}
