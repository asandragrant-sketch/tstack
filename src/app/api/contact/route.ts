import { NextRequest, NextResponse } from 'next/server'
import { createContactInquiry } from '@/lib/db'
import { notifyOwners } from '@/lib/email'
import {
  FIVERR_URL,
  FIVERR_GIG_AUTOMATION_URL,
  FIVERR_GIG_AGENTS_WEB_URL,
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

    // 3. Persist inquiry into database
    const newInquiry = await createContactInquiry({
      fullName,
      email,
      phone,
      company,
      service,
      budget,
      message,
    })

    // 4. Dispatch notification to BOTH owner emails (d.jacobwebpro@gmail.com & baronwebpro@gmail.com)
    await notifyOwners({
      type: 'contact_submission',
      subject: `New Project Inquiry: ${service} from ${fullName}`,
      clientName: fullName,
      clientEmail: email,
      priority: 'high',
      details: {
        'Client Name': fullName,
        'Client Email': email,
        Company: company || 'Not specified',
        Phone: phone || 'Not provided',
        'Requested Service': service,
        'Estimated Budget': budget,
        'Project Requirements': message,
        'Inquiry ID': newInquiry.id,
      },
      actionLink: `/admin/messages?inquiryId=${newInquiry.id}`,
      actionLabel: 'View in Admin Dashboard →',
    })

    return NextResponse.json(
      {
        success: true,
        inquiryId: newInquiry.id,
        message:
          'Thank you. Your project brief has been securely processed and dispatched to our lead solutions architects.',
        data: {
          inquiryId: newInquiry.id,
          fiverrUrl: FIVERR_URL,
          fiverrAutomationGig: FIVERR_GIG_AUTOMATION_URL,
          fiverrAgentsWebGig: FIVERR_GIG_AGENTS_WEB_URL,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          'An unexpected error occurred while processing your request. Please try again or reach out on Fiverr.',
      },
      { status: 500 }
    )
  }
}
