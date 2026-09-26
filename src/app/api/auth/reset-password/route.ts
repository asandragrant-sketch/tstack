import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createPasswordResetToken, consumePasswordResetToken } from '@/lib/db'
import { sendClientEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action = 'request', email, token, newPassword } = body

    if (action === 'request') {
      if (!email || !String(email).includes('@')) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid email address.' },
          { status: 400 }
        )
      }

      const resetToken = await createPasswordResetToken(String(email).trim())
      if (resetToken) {
        await sendClientEmail(
          String(email).trim(),
          'Password Reset Token - TSTACK Client Portal',
          `<h2>Password Reset Requested</h2><p>Use the following verification code to reset your TSTACK password (expires in 1 hour):</p><div style="padding:12px 18px;background:#0F172A;color:#38BDF8;font-family:monospace;font-size:16px;font-weight:bold;border-radius:8px;display:inline-block;">${resetToken.token}</div>`
        )
      }

      return NextResponse.json({
        success: true,
        verificationToken: resetToken ? resetToken.token : undefined,
        message: resetToken
          ? 'Password reset token generated. Enter the token below with your new password.'
          : 'If an account exists for that email, a reset token has been issued.',
      })
    }

    if (action === 'confirm') {
      if (!token || !newPassword || String(newPassword).length < 6) {
        return NextResponse.json(
          { success: false, error: 'Valid reset token and a new password (min 6 chars) are required.' },
          { status: 400 }
        )
      }

      const newHash = await bcrypt.hash(String(newPassword), 10)
      const ok = await consumePasswordResetToken(String(token).trim(), newHash)
      if (!ok) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired reset token.' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Your password has been updated successfully. You may now sign in.',
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 })
  } catch (err: any) {
    console.error('[Reset Password API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request.' },
      { status: 500 }
    )
  }
}
