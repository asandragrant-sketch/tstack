import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db'
import { signAuthToken, setAuthCookie } from '@/lib/auth'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, password, company, phone } = body

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required (minimum 2 characters).' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 409 }
      )
    }

    const user = await createUser({
      fullName,
      email,
      password,
      company,
      phone,
      role: 'client',
    })

    // Sign session token and set secure httpOnly cookie
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    })

    // Notify BOTH owners
    await notifyOwners({
      type: 'client_registration',
      subject: `New Client Registration: ${user.fullName} (${user.email})`,
      clientName: user.fullName,
      clientEmail: user.email,
      priority: 'normal',
      details: {
        'Client ID': user.id,
        'Full Name': user.fullName,
        'Email Address': user.email,
        Company: user.company || 'Not provided',
        'Registered At': user.createdAt,
      },
      actionLink: `/admin/clients?userId=${user.id}`,
      actionLabel: 'View Client in Admin Dashboard →',
    })

    // Send welcome confirmation email to client
    await sendClientEmail(
      user.email,
      'Welcome to TSTACK Client Portal',
      `<h2>Welcome to TSTACK, ${user.fullName}</h2><p>Your client account has been created. You can now track your project milestones, download invoices, and communicate directly with senior architects at https://tstack-ten.vercel.app/portal.</p>`
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        company: user.company,
        role: user.role,
      },
    })

    setAuthCookie(response, token)
    return response
  } catch (err: any) {
    console.error('[Register API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Registration failed.' },
      { status: 500 }
    )
  }
}
