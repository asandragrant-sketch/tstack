'use client'

import React, { useState, useEffect, useRef } from 'react'
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
} from 'lucide-react'

interface ChatMsg {
  sender: 'user' | 'assistant' | 'system'
  text: string
  timestamp?: string
}

const QUICK_PROMPTS = [
  'What services does TSTACK offer?',
  'How does payment & Fiverr escrow work?',
  'What are typical delivery timelines?',
  'Speak with Daniel Kylan Jacob',
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'assistant',
      text: "Hello! I am the TSTACK AI Solutions Assistant. Ask me anything about our AI automation workflows, custom LLM agents, Next.js web applications, pricing, or escrow milestones—or ask to speak directly with Daniel Kylan Jacob and Baron.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEscalationModal, setShowEscalationModal] = useState(false)
  const [escalationName, setEscalationName] = useState('')
  const [escalationEmail, setEscalationEmail] = useState('')
  const [escalationNote, setEscalationNote] = useState('')
  const [escalationStatus, setEscalationStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [escalationError, setEscalationError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize or restore session ID
    const savedSession = localStorage.getItem('tstack_chat_session_id')
    if (savedSession) {
      setSessionId(savedSession)
    } else {
      const newId = `ses-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
      localStorage.setItem('tstack_chat_session_id', newId)
      setSessionId(newId)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, showEscalationModal])

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim()
    if (!query || isLoading) return

    const nextMessages: ChatMsg[] = [...messages, { sender: 'user', text: query }]
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
          history: messages,
        }),
      })

      const data = await res.json()
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId)
        localStorage.setItem('tstack_chat_session_id', data.sessionId)
      }

      const replyText =
        data.reply ||
        'I can connect you directly with Daniel Kylan Jacob and Baron to address this specific requirement.'

      setMessages((prev) => [...prev, { sender: 'assistant', text: replyText }])

      if (data.shouldEscalate) {
        setShowEscalationModal(true)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Connection momentarily interrupted. You can escalate below or reach us at d.jacobwebpro@gmail.com and baronwebpro@gmail.com.',
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
          reason: 'Direct client escalation from AI Assistant',
          extraNote: escalationNote.trim(),
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setEscalationStatus('sent')
        setMessages((prev) => [
          ...prev,
          {
            sender: 'system',
            text: `Escalation confirmed! Your conversation transcript and contact details (${escalationEmail}) have been delivered to Daniel Kylan Jacob (d.jacobwebpro@gmail.com) and Baron (baronwebpro@gmail.com).`,
          },
        ])
        setTimeout(() => {
          setShowEscalationModal(false)
          setEscalationStatus('idle')
        }, 2200)
      } else {
        setEscalationStatus('error')
        setEscalationError(data.error || 'Failed to escalate.')
      }
    } catch {
      setEscalationStatus('error')
      setEscalationError('Network error submitting escalation.')
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[350px] sm:w-[395px] h-[540px] max-h-[82vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">
                    TSTACK AI Support
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Grounded Knowledge • Live Architect Escalation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowEscalationModal(!showEscalationModal)}
                title="Escalate to Human Architect"
                className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/40 text-[10px] font-mono text-slate-300 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-blue-400" />
                <span>Human</span>
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

          {/* Escalation Drawer Overlay */}
          {showEscalationModal ? (
            <div className="flex-1 p-5 bg-slate-950 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                    <UserCheck className="w-4 h-4" />
                    <span>Direct Architect Escalation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEscalationModal(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Chat
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Your conversation history and inquiry will be dispatched immediately to{' '}
                  <strong className="text-white">Daniel Kylan Jacob</strong> and{' '}
                  <strong className="text-white">Baron</strong> for personal follow-up.
                </p>

                {escalationStatus === 'sent' ? (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2 my-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-semibold text-white">Escalation Dispatched</h4>
                    <p className="text-xs text-slate-300">
                      Both owners have been notified. We will respond to your email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEscalateSubmit} className="space-y-3">
                    {escalationError && (
                      <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                        <span>{escalationError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Your Name
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
                        Specific Question or Project Context
                      </label>
                      <textarea
                        rows={3}
                        value={escalationNote}
                        onChange={(e) => setEscalationNote(e.target.value)}
                        placeholder="Any specific details for Daniel Kylan Jacob & Baron..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={escalationStatus === 'submitting'}
                      className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      {escalationStatus === 'submitting'
                        ? 'Dispatching to Owners...'
                        : 'Send Urgent Alert to Owners →'}
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
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.sender === 'user'
                        ? 'justify-end'
                        : m.sender === 'system'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    {m.sender === 'system' ? (
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 text-center max-w-[90%]">
                        {m.text}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-bl-none px-3.5 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length <= 2 && (
                <div className="px-3.5 py-2 bg-slate-950 border-t border-slate-900 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

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
                  placeholder="Ask about services, timelines, escrow..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
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
            <span>Close Assistant</span>
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
