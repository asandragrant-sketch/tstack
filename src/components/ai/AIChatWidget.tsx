'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  Mail,
  ArrowUpRight,
  RotateCcw,
  Phone,
} from 'lucide-react'

interface ChatAction {
  label: string
  type: 'escalate' | 'link' | 'prompt'
  value: string
}

interface ChatMsg {
  id?: string
  sender: 'user' | 'assistant' | 'system'
  text: string
  timestamp?: string
  actions?: ChatAction[]
}

const INITIAL_MESSAGE: ChatMsg = {
  sender: 'assistant',
  text: "Hello! I'm the **TSTACK AI Solutions Architect**.\n\nAsk me anything about:\n• **Custom Websites, Web Apps & SaaS Portals**\n• **AI Workflow Automation & Custom Agents**\n• **Pricing Packages & Delivery Timelines**\n• **WhatsApp / Direct Contact** with **Daniel Kylan Jacob** & **Baron**",
  actions: [
    { label: 'View Pricing & Packages', type: 'prompt', value: 'What are your pricing packages?' },
    { label: 'WhatsApp / Contact Owners', type: 'escalate', value: 'WhatsApp & Direct Contact' },
    { label: 'Open Client Portal', type: 'link', value: '/portal' },
  ],
}

const DEFAULT_PROMPTS = [
  'How much does a website or web app cost?',
  'Do you have WhatsApp or direct email?',
  'Tell me about AI workflow automation',
  'How does payment & Fiverr escrow work?',
]

/**
 * Simple helper to render **bold** and `code` text cleanly inside chat bubbles
 */
function renderFormattedText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g)
    return (
      <span key={lineIdx} className="block min-h-[1rem]">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            )
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={i}
                className="px-1 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-[11px]"
              >
                {part.slice(1, -1)}
              </code>
            )
          }
          return <React.Fragment key={i}>{part}</React.Fragment>
        })}
      </span>
    )
  })
}

export default function AIChatWidget() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MESSAGE])
  const [followUpPrompts, setFollowUpPrompts] = useState<string[]>(DEFAULT_PROMPTS)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Inline Escalation Drawer state (only opened when user explicitly clicks "Human" or an escalate action button)
  const [showEscalationModal, setShowEscalationModal] = useState(false)
  const [escalationTopic, setEscalationTopic] = useState('')
  const [escalationName, setEscalationName] = useState('')
  const [escalationEmail, setEscalationEmail] = useState('')
  const [escalationNote, setEscalationNote] = useState('')
  const [escalationStatus, setEscalationStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [escalationError, setEscalationError] = useState('')
  const [gmailComposeUrl, setGmailComposeUrl] = useState('')
  const [mailtoUrl, setMailtoUrl] = useState('')
  const [externalDelivered, setExternalDelivered] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedSession = localStorage.getItem('tstack_chat_session_id')
    if (savedSession) {
      setSessionId(savedSession)
    } else {
      const newId = `ses-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
      localStorage.setItem('tstack_chat_session_id', newId)
      setSessionId(newId)
    }
  }, [])

  // Live poll for Owner replies from /admin while widget is open
  useEffect(() => {
    if (!isOpen || !sessionId) return

    const syncServerMessages = async () => {
      try {
        const res = await fetch(`/api/ai/chat?sessionId=${encodeURIComponent(sessionId)}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages((prev) => {
            if (data.messages.length > prev.length) {
              return [INITIAL_MESSAGE, ...data.messages]
            }
            return prev
          })
        }
      } catch {
        // ignore transient errors
      }
    }

    const timer = setInterval(syncServerMessages, 6000)
    return () => clearInterval(timer)
  }, [isOpen, sessionId])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, showEscalationModal])

  const handleResetChat = () => {
    const newId = `ses-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
    localStorage.setItem('tstack_chat_session_id', newId)
    setSessionId(newId)
    setMessages([INITIAL_MESSAGE])
    setFollowUpPrompts(DEFAULT_PROMPTS)
    setShowEscalationModal(false)
    setEscalationStatus('idle')
  }

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'prompt') {
      sendMessage(action.value)
    } else if (action.type === 'link') {
      if (action.value.startsWith('http')) {
        window.open(action.value, '_blank', 'noopener,noreferrer')
      } else {
        router.push(action.value)
      }
    } else if (action.type === 'escalate') {
      setEscalationTopic(action.value)
      setEscalationStatus('idle')
      setShowEscalationModal(true)
    }
  }

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim()
    if (!query || isLoading) return

    const userMsg: ChatMsg = { sender: 'user', text: query }
    const nextMessages: ChatMsg[] = [...messages, userMsg]
    setMessages(nextMessages)
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: query,
          clientName: escalationName || undefined,
          clientEmail: escalationEmail || undefined,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      })

      const data = await res.json()
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId)
        localStorage.setItem('tstack_chat_session_id', data.sessionId)
      }

      const replyText =
        data.reply ||
        'I can connect you directly with Daniel Kylan Jacob and Baron to address this requirement.'

      const assistantMsg: ChatMsg = {
        sender: 'assistant',
        text: replyText,
        actions: data.actions || [
          { label: '📩 Message Daniel & Baron', type: 'escalate', value: query },
        ],
      }

      setMessages((prev) => [...prev, assistantMsg])

      if (Array.isArray(data.followUpPrompts) && data.followUpPrompts.length > 0) {
        setFollowUpPrompts(data.followUpPrompts)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Connection momentarily interrupted. Click below to message Daniel Kylan Jacob (d.jacobwebpro@gmail.com) and Baron (baronwebpro@gmail.com) directly.',
          actions: [
            { label: '📩 Direct Message Owners', type: 'escalate', value: 'Direct Inquiry' },
          ],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!escalationEmail.includes('@')) {
      setEscalationError('Please enter a valid email address so our architects can reply.')
      return
    }

    setEscalationStatus('submitting')
    setEscalationError('')

    try {
      const res = await fetch('/api/ai/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          clientName: escalationName.trim() || 'Website Visitor',
          clientEmail: escalationEmail.trim(),
          reason: escalationTopic || 'Direct client escalation from AI Assistant',
          extraNote: escalationNote.trim(),
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setEscalationStatus('sent')
        setGmailComposeUrl(data.gmailComposeUrl || '')
        setMailtoUrl(data.mailtoUrl || '')
        setExternalDelivered(Boolean(data.externalEmailDelivered))

        const confirmationText =
          data.message ||
          (data.externalEmailDelivered
            ? 'Your request has been sent to the TSTACK team.'
            : 'Your request has been recorded. The team will be notified through the available support channel.')

        setMessages((prev) => [
          ...prev,
          {
            sender: 'system',
            text: `✓ ${confirmationText}`,
          },
        ])
      } else {
        setEscalationStatus('error')
        setEscalationError(data.error || 'Failed to send.')
      }
    } catch {
      setEscalationStatus('error')
      setEscalationError('Network error submitting request.')
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[355px] sm:w-[415px] h-[580px] max-h-[84vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">
                    TSTACK AI Architect
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Instant Answers • Live Owner Escalation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowEscalationModal(!showEscalationModal)
                  setEscalationStatus('idle')
                }}
                title="Send WhatsApp / Direct Email to Daniel & Baron"
                className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-[10px] font-mono font-semibold text-blue-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-blue-400" />
                <span>Contact Owner</span>
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close support chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Escalation Drawer Overlay (Only shown when user clicks "Contact Owner" or an Escalate action button) */}
          {showEscalationModal ? (
            <div className="flex-1 p-5 bg-slate-950 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                    <Phone className="w-4 h-4" />
                    <span>Direct WhatsApp &amp; Gmail Escalation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEscalationModal(false)
                      setEscalationStatus('idle')
                    }}
                    className="text-xs text-slate-400 hover:text-white font-medium"
                  >
                    ← Back to AI Chat
                  </button>
                </div>

                {escalationStatus === 'sent' ? (
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3.5 my-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <h4 className="text-sm font-semibold text-white">
                        {externalDelivered ? 'Sent to the TSTACK Team' : 'Request Recorded'}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {externalDelivered
                        ? 'Your request has been sent to the TSTACK team.'
                        : 'Your request has been recorded. The team will be notified through the available support channel.'}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Logged in the <strong className="text-white">Owner Notification Bar (/admin)</strong> and CRM pipeline for Daniel Kylan Jacob &amp; Baron. When an owner replies, it appears live inside this chat window.
                    </p>

                    <div className="space-y-2 pt-1">
                      {gmailComposeUrl && (
                        <a
                          href={gmailComposeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Direct Copy via Gmail Now</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowEscalationModal(false)
                          setEscalationStatus('idle')
                        }}
                        className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
                      >
                        ← Return to AI Chat Conversation
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEscalateSubmit} className="space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Leave your <strong className="text-white">Email</strong> and{' '}
                      <strong className="text-white">WhatsApp Number / Question</strong> below. It triggers an instant alert bar notification and email to{' '}
                      <strong className="text-white">Daniel Kylan Jacob</strong> &amp;{' '}
                      <strong className="text-white">Baron</strong>.
                    </p>

                    {escalationError && (
                      <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                        <span>{escalationError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Your Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={escalationName}
                        onChange={(e) => setEscalationName(e.target.value)}
                        placeholder="Jane Smith"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Your Business Email <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={escalationEmail}
                        onChange={(e) => setEscalationEmail(e.target.value)}
                        placeholder="jane@company.com"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Your WhatsApp Number &amp; Project Details
                      </label>
                      <textarea
                        rows={3}
                        value={escalationNote}
                        onChange={(e) => setEscalationNote(e.target.value)}
                        placeholder="e.g. My WhatsApp is +1 (555) 000-0000. I want to build..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={escalationStatus === 'submitting'}
                      className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      {escalationStatus === 'submitting'
                        ? 'Dispatching to Daniel & Baron...'
                        : 'Send to Daniel Kylan Jacob & Baron →'}
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Delivered to d.jacobwebpro &amp; baronwebpro
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Container */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-950/95">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      m.sender === 'user'
                        ? 'items-end'
                        : m.sender === 'system'
                        ? 'items-center'
                        : 'items-start'
                    }`}
                  >
                    {m.sender === 'system' ? (
                      <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-[11px] text-emerald-300 text-center max-w-[92%]">
                        {m.text}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-1.5 ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <div>{renderFormattedText(m.text)}</div>

                        {/* Interactive Action Buttons inside AI bubble */}
                        {m.sender === 'assistant' && m.actions && m.actions.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800/80 mt-2">
                            {m.actions.map((act, actIdx) => (
                              <button
                                key={actIdx}
                                type="button"
                                onClick={() => handleActionClick(act)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center gap-1 ${
                                  act.type === 'escalate'
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                                }`}
                              >
                                <span>{act.label}</span>
                                {act.type === 'link' && <ArrowUpRight className="w-3 h-3" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Contextual Quick Prompt Chips (Always available so user can tap next questions) */}
              <div className="px-3 py-2 bg-slate-950 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {followUpPrompts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about websites, AI, pricing, WhatsApp..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI customer support assistant"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all hover:scale-[1.02]"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            <span>Close AI Assistant</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" />
            <span>Ask TSTACK AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          </>
        )}
      </button>
    </div>
  )
}
