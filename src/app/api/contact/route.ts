import { NextRequest, NextResponse } from 'next/server'
import {
  CONTACT_EMAILS,
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL
} from '@/types/contact'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      company,
      service,
      budget,
      message,
      websiteBotHoneypot,
    } = body

    // 1. Anti-spam honeypot validation
    if (websiteBotHoneypot) {
      return NextResponse.json(
        { success: true, message: 'Message received.' },
        { status: 200 }
      )
    }

    // 2. Server-side required field validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name (at least 2 characters).' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    if (!service || typeof service !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please select a service needed.' },
        { status: 400 }
      )
    }

    if (!budget || typeof budget !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please select an estimated budget range.' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide project details (at least 5 characters).' },
        { status: 400 }
      )
    }

    // Sanitize values
    const cleanPayload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : 'Not provided',
      company: company ? String(company).trim() : 'Not provided',
      service: String(service).trim(),
      budget: String(budget).trim(),
      message: message.trim(),
      recipients: CONTACT_EMAILS,
      fiverr: FIVERR_URL,
      fiverrAutomationGig: FIVERR_GIG_AUTOMATION_URL,
      fiverrAgentsWebGig: FIVERR_GIG_AGENTS_WEB_URL,
      timestamp: new Date().toISOString(),
    }

    // Server-side audit log
    console.log('=============================================')
    console.log('[TSTACK WEB] NEW PROJECT INQUIRY RECEIVED:')
    console.log('Timestamp:', cleanPayload.timestamp)
    console.log('From:', `${cleanPayload.fullName} <${cleanPayload.email}>`)
    console.log('Phone:', cleanPayload.phone)
    console.log('Company:', cleanPayload.company)
    console.log('Service:', cleanPayload.service)
    console.log('Budget:', cleanPayload.budget)
    console.log('Message:', cleanPayload.message)
    console.log('Recipients:', cleanPayload.recipients)
    console.log('Fiverr Link:', cleanPayload.fiverr)
    console.log('=============================================')

    // Optional: If Resend or Web3Forms key is configured in process.env, forward email
    let providerDispatched = false
    const web3formsKey = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY
    if (web3formsKey) {
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            from_name: cleanPayload.fullName,
            replyto: cleanPayload.email,
            subject: `New TSTACK WEB Project: ${cleanPayload.service} from ${cleanPayload.fullName}`,
            message: `Service: ${cleanPayload.service}\nBudget: ${cleanPayload.budget}\nCompany: ${cleanPayload.company}\nPhone: ${cleanPayload.phone}\n\nProject Details:\n${cleanPayload.message}`,
          }),
        })
        if (res.ok) providerDispatched = true
      } catch (err) {
        console.error('[TSTACK WEB] External forward failed:', err)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you. Your message has been received. We'll get back to you as soon as possible.",
        data: {
          routedTo: cleanPayload.recipients,
          fiverrUrl: cleanPayload.fiverr,
          status: providerDispatched ? 'Dispatched to inbox' : 'Logged and queued for immediate review',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[TSTACK WEB] Contact API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing your request. Please try again or reach out on Fiverr.',
      },
      { status: 500 }
    )
  }
}
