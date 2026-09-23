'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/common/Button'
import {
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  ContactFormData,
  FIVERR_URL,
  CONTACT_EMAILS
} from '@/types/contact'
import { CheckCircle2, AlertCircle, Send, Mail } from 'lucide-react'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service')

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: preselectedService || 'Website Development',
    budget: '$5,000–$10,000',
    message: '',
    websiteBotHoneypot: '',
  })

  const [lastSubmitted, setLastSubmitted] = useState<ContactFormData | null>(null)

  useEffect(() => {
    if (preselectedService && SERVICE_OPTIONS.includes(preselectedService as any)) {
      setFormData((prev) => ({ ...prev, service: preselectedService }))
    }
  }, [preselectedService])

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

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
      errors.message = 'Please provide details about your project.'
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
      setClientErrors((prev) => ({ ...prev, [name]: '' }))
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setLastSubmitted({ ...formData })
        setStatus('success')
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          service: 'Website Development',
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
      setErrorMessage('Network connection failure. Please check your connection or order directly via Fiverr.')
    }
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800 shadow-2xl shadow-black/80 relative">
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
          className="p-8 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-6 my-4 animate-heroFadeIn"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Inquiry Successfully Received
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Thank you. Your message has been received. We&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Order Directly via Fiverr with Buyer Protection */}
          <div className="p-5 rounded-2xl bg-[#1dbf73]/10 border border-[#1dbf73]/30 text-left space-y-3">
            <div className="flex items-center gap-2 text-[#1dbf73] text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
              <span>Prefer Escrow &amp; Milestone Protection?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You can also initiate your contract and collaborate securely through our verified Fiverr profile:
            </p>
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm transition-all shadow-lg shadow-[#1dbf73]/20"
            >
              <span>Order Directly on Fiverr (Verified Pro) →</span>
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
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {status === 'error' && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span>{errorMessage}</span>
                <div className="mt-2 text-xs">
                  <span>You can also order directly via our Fiverr profile: </span>
                  <a
                    href={FIVERR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1dbf73] font-bold underline ml-1"
                  >
                    View Fiverr Profile →
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Full Name <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                  clientErrors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              {clientErrors.fullName && (
                <p className="text-xs text-red-400 mt-1">{clientErrors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Email Address <span className="text-blue-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                  clientErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              {clientErrors.email && (
                <p className="text-xs text-red-400 mt-1">{clientErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Phone Number <span className="text-slate-500 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Company / Organization */}
            <div>
              <label
                htmlFor="company"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Company / Organization <span className="text-slate-500 font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Service Needed */}
            <div>
              <label
                htmlFor="service"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Service Needed <span className="text-blue-400">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-950 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label
                htmlFor="budget"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Budget Range <span className="text-blue-400">*</span>
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-950 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Project Details <span className="text-blue-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project, target audience, timeline, or key technical requirements..."
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                clientErrors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
              } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            {clientErrors.message && (
              <p className="text-xs text-red-400 mt-1">{clientErrors.message}</p>
            )}
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="glow"
              size="lg"
              loading={status === 'loading'}
              className="w-full justify-center text-center font-bold tracking-wider uppercase text-sm py-4 shadow-blue-500/25"
            >
              Submit Project Inquiry
            </Button>

            {/* Direct Fiverr Order Button */}
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#1dbf73]/25 hover:shadow-[#1dbf73]/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#1dbf73]"
            >
              <span>Prefer Fiverr? Order Directly on Fiverr</span>
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
            <span>Daniel Jacob • TSTACK WEB</span>
            <span>•</span>
            <span>100% Confidential</span>
          </div>
        </form>
      )}
    </div>
  )
}
