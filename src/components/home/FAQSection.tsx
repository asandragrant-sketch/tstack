'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle, ArrowUpRight, Mail } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { FIVERR_URL, CONTACT_EMAILS } from '@/types/contact'

interface FAQItem {
  question: string
  answer: string
  tag: string
}

const FAQS: FAQItem[] = [
  {
    question: 'How does milestone escrow protect my payment on Fiverr?',
    answer:
      'When you order through our verified Fiverr profile, your project budget is deposited into a secure escrow account managed by Fiverr. Funds are only released to us milestone-by-milestone after you have thoroughly reviewed, tested, and approved each deliverable. You retain full buyer protection at every step.',
    tag: 'Escrow & Safety',
  },
  {
    question: 'Can you integrate with our existing CRMs, ERPs, and custom databases?',
    answer:
      'Yes. We specialize in connecting legacy and modern systems. We regularly build high-reliability pipelines connecting HubSpot, Salesforce, Airtable, PostgreSQL, Supabase, Stripe, Google Workspace, Slack, and custom internal REST or GraphQL APIs.',
    tag: 'Integrations',
  },
  {
    question: 'Who owns the intellectual property and source code?',
    answer:
      'You own 100% of the intellectual property, proprietary data, configurations, and source code. Upon milestone completion, complete codebases are transferred directly to your private GitHub organization with zero vendor lock-in.',
    tag: 'IP & Ownership',
  },
  {
    question: 'What are typical project turnaround times?',
    answer:
      'Standard workflow automations and API sync pipelines are typically engineered and tested within 5 to 8 business days. Complex autonomous RAG agents and full-stack Next.js client portals generally take 10 to 14 business days, divided into weekly sprint reviews.',
    tag: 'Timelines',
  },
  {
    question: 'How do we communicate with Daniel Kylan Jacob and the engineering team?',
    answer:
      'You collaborate directly with senior technical architects (David Alison, Daniel Kylan Jacob, and Baron). There are zero junior hand-offs or non-technical account managers. We provide continuous updates via email dispatches, our dedicated client portal, and Fiverr order workspaces.',
    tag: 'Direct Access',
  },
  {
    question: 'Do you offer post-deployment maintenance and SLA support?',
    answer:
      'Yes. Every deployment includes post-launch testing and warranty support. For ongoing enterprise requirements, we provide monthly SLA retainers covering 24/7 webhook uptime monitoring, dependency patching, and rapid developer response.',
    tag: 'Maintenance',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 sm:py-28 border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Frequently Asked Questions"
          title="Clear answers."
          highlight="Zero sales fluff."
          description="Everything you need to know about our contracting standards, delivery milestones, and technical collaboration."
        />

        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-800 bg-slate-900/60 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                      {faq.tag}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-850/60"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 mx-auto">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white">
            Have a question specific to your architecture?
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Send your question directly to our senior engineering team, or discuss terms on Fiverr with full escrow protection.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAILS[0]}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Technical Leads</span>
            </a>
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium transition-colors"
            >
              <span>Ask via Fiverr</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
