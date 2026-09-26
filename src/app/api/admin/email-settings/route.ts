import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getEmailSettings, saveEmailSettings } from '@/lib/db'
import { notifyOwners } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const settings = await getEmailSettings()
    return NextResponse.json({
      success: true,
      settings: {
        smtpHost: settings.smtpHost || 'smtp.gmail.com',
        smtpPort: settings.smtpPort || 465,
        smtpUser: settings.smtpUser || 'd.jacobwebpro@gmail.com',
        hasSmtpPass: Boolean(settings.smtpPass && settings.smtpPass.length > 0),
        hasResendKey: Boolean(settings.resendApiKey && settings.resendApiKey.length > 0),
        hasWeb3formsKey: Boolean(settings.web3formsKey && settings.web3formsKey.length > 0),
        updatedAt: settings.updatedAt,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Failed to load email settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { action, smtpUser, smtpPass, resendApiKey, web3formsKey } = body

    if (action === 'test_delivery') {
      const result = await notifyOwners({
        type: 'system_alert',
        subject: 'Live Gmail Delivery Verification Test',
        clientName: user.fullName,
        clientEmail: user.email,
        priority: 'high',
        details: {
          'Triggered By': `${user.fullName} (${user.email})`,
          'Primary Recipient': 'd.jacobwebpro@gmail.com',
          'Secondary Recipient': 'baronwebpro@gmail.com',
          'Test Status': 'Active Verification',
        },
        actionLink: '/admin',
        actionLabel: 'Return to Owner Console →',
      })

      return NextResponse.json({
        success: true,
        result,
      })
    }

    const current = await getEmailSettings()
    const updated = await saveEmailSettings({
      smtpHost: 'smtp.gmail.com',
      smtpPort: 465,
      smtpUser: smtpUser !== undefined ? smtpUser.trim() : current.smtpUser,
      smtpPass: smtpPass !== undefined && smtpPass.trim() !== '' ? smtpPass.trim() : current.smtpPass,
      resendApiKey:
        resendApiKey !== undefined && resendApiKey.trim() !== ''
          ? resendApiKey.trim()
          : current.resendApiKey,
      web3formsKey:
        web3formsKey !== undefined && web3formsKey.trim() !== ''
          ? web3formsKey.trim()
          : current.web3formsKey,
    })

    return NextResponse.json({
      success: true,
      message: 'Email delivery settings saved.',
      hasSmtpPass: Boolean(updated.smtpPass),
      hasResendKey: Boolean(updated.resendApiKey),
      hasWeb3formsKey: Boolean(updated.web3formsKey),
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save email settings' },
      { status: 500 }
    )
  }
}
