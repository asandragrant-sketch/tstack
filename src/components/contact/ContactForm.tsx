'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/common/Button'
import {
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  ContactFormData,
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL,
  CONTACT_EMAILS
} from '@/types/contact'
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service')
  const preselectedBudget = searchParams.get('budget')
  const preselectedTimeline = searchParams.get('timeline')
  const preselectedModules = searchParams.get('modules')

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: preselectedService || 'AI Automation & Workflows',
    budget: preselectedBudget || '$5,000–$10,000',
    message: '',
    websiteBotHoneypot: '',
  })

  useEffect(() => {
    if (preselectedService && SERVICE_OPTIONS.includes(preselectedService as any)) {
      setFormData((prev) => ({ ...prev, service: preselectedService }))
    }
    if (preselectedBudget && BUDGET_OPTIONS.includes(preselectedBudget as any)) {
      setFormData((prev) => ({ ...prev, budget: preselectedBudget }))
    }
    if (preselectedTimeline || preselectedModules) {
      const summaryText = `[Configured Project Scope]\nTarget Timeline: ${preselectedTimeline || 'Flexible'}\nIncluded Modules: ${preselectedModules || 'Standard'}\n\nProject details & goals: `
      setFormData((prev) => ({
        ...prev,
        message: prev.message ? prev.message : summaryText,
      }))
    }
  }, [preselectedService, preselectedBudget, preselectedTimeline, preselectedModules])

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [gmailComposeUrl, setGmailComposeUrl] = useState('')

  const copyEmailToClipboard = (email: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2500)
    }
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (minimum 2 characters).'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'A valid email address is required.'
    }
    if (!formData.service) {
      errors.service = 'Please select a service needed.'
    }
    if (!formData.budget) {
      errors.budget = 'Please select an estimated budget range.'
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Please provide details about your project (minimum 5 characters).'
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setStatus('success')
        if (result.gmailComposeUrl) {
          setGmailComposeUrl(result.gmailComposeUrl)
          if (!result.externalEmailDelivered) {
            window.open(result.gmailComposeUrl, '_blank', 'noopener,noreferrer')
          }
        }
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          service: 'AI Automation & Workflows',
          budget: '$5,000–$10,000',
          message: '',
          websiteBotHoneypot: '',
        })
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to submit form. Please verify fields and try again.')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Network error occurred. Please verify your connection or order directly via Fiverr.')
    }
  }

  return (
    <div className="pro-card p-6 sm:p-8 shadow-sm relative">
      {/* Honeypot hidden input for spam protection */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="websiteBotHoneypot">Do not fill this field</label>
        <input
          type="text"
          id="websiteBotHoneypot"
          name="websiteBotHoneypot"
          value={formData.websiteBotHoneypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === 'success' ? (
        <div
          role="alert"
          className="p-6 rounded-lg bg-slate-900 border border-emerald-500/30 text-center space-y-5 my-2"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-white">
              Inquiry Successfully Received
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Thank you. Your message has been logged in the Owner Console and dispatched to <strong>d.jacobwebpro@gmail.com</strong> &amp; <strong>baronwebpro@gmail.com</strong>.
            </p>
            {gmailComposeUrl && (
              <div className="pt-2">
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Send Direct Copy via Gmail Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Option to Order Directly via Fiverr with Escrow */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-medium">
                Prefer Milestone &amp; Escrow Protection?
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can also initiate your contract and collaborate securely through our verified Fiverr gigs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href={FIVERR_GIG_AUTOMATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-between transition-colors"
              >
                <span>AI Automation Gig</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href={FIVERR_GIG_AGENTS_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-between transition-colors"
              >
                <span>AI Agents &amp; Web Gig</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            </div>
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium transition-colors shadow-sm"
            >
              <span>Main Fiverr Profile (All Services)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus('idle')}
            >
              Send Another Inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {status === 'error' && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span>{errorMessage}</span>
                <div className="mt-1">
                  <span>You can also reach us directly on Fiverr: </span>
                  <a
                    href={FIVERR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1dbf73] font-medium underline"
                  >
                    View Fiverr Profile →
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Full Name <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
                className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border ${
                  clientErrors.fullName ? 'border-red-500' : 'border-slate-800'
                } text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {clientErrors.fullName && (
                <p className="text-[11px] text-red-400 mt-1">{clientErrors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Business Email <span className="text-blue-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                required
                className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border ${
                  clientErrors.email ? 'border-red-500' : 'border-slate-800'
                } text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {clientErrors.email && (
                <p className="text-[11px] text-red-400 mt-1">{clientErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Phone Number <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Company / Organization <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service Selection */}
            <div>
              <label
                htmlFor="service"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Primary Service Needed <span className="text-blue-400">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                {SERVICE_OPTIONS.map((srv) => (
                  <option key={srv} value={srv} className="bg-slate-900 text-white">
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label
                htmlFor="budget"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Estimated Budget Range <span className="text-blue-400">*</span>
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-slate-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="message"
                className="block text-xs font-medium text-slate-300"
              >
                Project Overview &amp; Requirements <span className="text-blue-400">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {formData.message.length} chars
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about the business process you want to automate, tools you use, or web application goals..."
              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border ${
                clientErrors.message ? 'border-red-500' : 'border-slate-800'
              } text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors`}
            />
            {clientErrors.message && (
              <p className="text-[11px] text-red-400 mt-1">{clientErrors.message}</p>
            )}
          </div>

          {/* Quick Copy Direct Inquiries */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono text-[11px]">
                Prefer sending your PRD/brief directly via email?
              </span>
              {copiedEmail && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                  Copied to clipboard!
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
              {CONTACT_EMAILS.slice(0, 3).map((email) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => copyEmailToClipboard(email)}
                  title={`Click to copy ${email}`}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>{email}</span>
                  <span className="text-slate-500 text-[10px]">copy</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={status === 'loading'}
              className="w-full justify-center text-center font-medium text-xs sm:text-sm py-3"
            >
              Submit Project Inquiry
            </Button>

            {/* Direct Fiverr Order Button */}
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Prefer Escrow? Order Directly on Fiverr</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Direct Gig Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs pt-1">
              <span className="text-slate-500 font-mono text-[11px]">Direct Gigs:</span>
              <a
                href={FIVERR_GIG_AUTOMATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>AI Automation Gig</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              </a>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <a
                href={FIVERR_GIG_AGENTS_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>AI Agents &amp; Web Gig</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500 font-mono">
            <span>David Alison &amp; Daniel Kylan Jacob • TSTACK • 100% Confidential</span>
          </div>
        </form>
      )}
    </div>
  )
}
