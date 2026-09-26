import nodemailer from 'nodemailer'
import { createActivityNotification, createEmailDeliveryLog, getEmailSettings } from '../db'
import { ActivityEventType } from '../db/types'

export const OWNER_EMAILS = [
  'd.jacobwebpro@gmail.com',
  'baronwebpro@gmail.com',
]

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tstack-ten.vercel.app'
const DEFAULT_SENDER_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || 'd.jacobwebpro@gmail.com'

export interface OwnerNotificationPayload {
  type:
    | 'contact_submission'
    | 'client_registration'
    | 'order_placed'
    | 'payment_success'
    | 'payment_failed'
    | 'ai_escalation'
    | 'support_ticket'
    | 'client_message'
    | 'appointment_booked'
    | 'requirements_submitted'
    | 'file_uploaded'
    | 'review_submitted'
    | 'system_alert'
  subject: string
  clientName?: string
  clientEmail?: string
  details: Record<string, string | number | boolean | undefined>
  actionLink?: string
  actionLabel?: string
  priority?: 'normal' | 'high' | 'urgent'
}

export interface NotifyOwnersResult {
  success: boolean
  dispatchedChannels: string[]
  externalEmailDelivered: boolean
  emailStatus: 'delivered' | 'failed' | 'unconfigured'
  providerUsed: 'smtp' | 'resend' | 'web3forms' | 'none'
  errorMessage?: string
  formsubmitNeedsActivation: boolean
  gmailComposeUrl: string
  mailtoUrl: string
}

/**
 * Configure Nodemailer transport using env vars or saved Admin Console settings
 */
async function getTransporter() {
  const settings = await getEmailSettings()
  const host = process.env.SMTP_HOST || settings.smtpHost || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || settings.smtpPort) || 465
  const user = process.env.SMTP_USER || settings.smtpUser || 'd.jacobwebpro@gmail.com'
  const pass = (process.env.SMTP_PASS || settings.smtpPass || '').trim()

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  }
  return null
}

/**
 * Check whether any real server-side email provider is configured
 */
export async function getEmailProviderConfigStatus() {
  const settings = await getEmailSettings()
  const smtpPass = (process.env.SMTP_PASS || settings.smtpPass || '').trim()
  const resendKey = (process.env.RESEND_API_KEY || settings.resendApiKey || '').trim()
  const web3formsKey = (
    process.env.WEB3FORMS_KEY ||
    process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
    settings.web3formsKey ||
    ''
  ).trim()

  return {
    smtpConfigured: Boolean(smtpPass),
    resendConfigured: Boolean(resendKey),
    web3formsConfigured: Boolean(web3formsKey),
    anyConfigured: Boolean(smtpPass || resendKey || web3formsKey),
  }
}

/**
 * Clean, professional responsive HTML template for owner alerts
 */
function buildOwnerAlertHtml(payload: OwnerNotificationPayload): string {
  const priorityColor =
    payload.priority === 'urgent'
      ? '#EF4444'
      : payload.priority === 'high'
      ? '#F59E0B'
      : '#3B82F6'

  const detailsRows = Object.entries(payload.details)
    .filter(([_, v]) => v !== undefined && v !== '')
    .map(
      ([key, val]) => `
      <tr>
        <td style="padding: 9px 14px; border-bottom: 1px solid #1E293B; font-family: monospace; font-size: 12px; color: #94A3B8; text-transform: uppercase; width: 35%;">${key.replace(/([A-Z])/g, ' $1')}</td>
        <td style="padding: 9px 14px; border-bottom: 1px solid #1E293B; font-family: sans-serif; font-size: 13px; color: #F8FAFC; font-weight: 500;">${String(val)}</td>
      </tr>`
    )
    .join('')

  const buttonHtml = payload.actionLink
    ? `
    <div style="padding-top: 24px; text-align: center;">
      <a href="${payload.actionLink.startsWith('http') ? payload.actionLink : `${APP_URL}${payload.actionLink}`}" 
         style="display: inline-block; background-color: #2563EB; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;">
        ${payload.actionLabel || 'Inspect in Admin Dashboard →'}
      </a>
    </div>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${payload.subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #0A0D14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F8FAFC;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #101522; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);">
    <div style="padding: 20px 24px; border-bottom: 1px solid #1E293B; background-color: #0D121F; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <span style="font-size: 16px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase;">TSTACK</span>
        <span style="font-size: 11px; font-family: monospace; color: #64748B; margin-left: 8px;">• SYSTEM DISPATCH</span>
      </div>
      <div style="margin-top: 4px;">
        <span style="display: inline-block; background-color: ${priorityColor}20; color: ${priorityColor}; border: 1px solid ${priorityColor}60; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-family: monospace; font-weight: 700; text-transform: uppercase;">
          ${payload.priority || 'NORMAL'}
        </span>
      </div>
    </div>

    <div style="padding: 24px 24px 12px 24px;">
      <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #ffffff; font-weight: 600; line-height: 1.3;">
        ${payload.subject}
      </h2>
      <p style="margin: 0; font-size: 13px; color: #94A3B8; line-height: 1.5;">
        A verified event was logged on the TSTACK production platform for <strong>d.jacobwebpro@gmail.com</strong> and <strong>baronwebpro@gmail.com</strong>.
      </p>
    </div>

    <div style="padding: 12px 24px 24px 24px;">
      <table style="width: 100%; border-collapse: collapse; background-color: #0A0D14; border-radius: 8px; overflow: hidden; border: 1px solid #1E293B;">
        <tbody>
          ${detailsRows}
          <tr>
            <td style="padding: 9px 14px; font-family: monospace; font-size: 12px; color: #94A3B8; text-transform: uppercase;">TIMESTAMP</td>
            <td style="padding: 9px 14px; font-family: monospace; font-size: 12px; color: #CBD5E1;">${new Date().toUTCString()}</td>
          </tr>
        </tbody>
      </table>

      ${buttonHtml}
    </div>

    <div style="padding: 16px 24px; border-top: 1px solid #1E293B; background-color: #0D121F; text-align: center; font-size: 11px; color: #64748B;">
      TSTACK Platform Automation • Delivered to Authorized Owners (${OWNER_EMAILS.join(', ')})
    </div>
  </div>
</body>
</html>`
}

/**
 * Dispatches notification to BOTH owners across all active delivery channels
 * Logs every delivery attempt into EmailDeliveryLog without faking external delivery
 */
export async function notifyOwners(payload: OwnerNotificationPayload): Promise<NotifyOwnersResult> {
  const dispatchedChannels: string[] = []
  let externalEmailDelivered = false
  let providerUsed: 'smtp' | 'resend' | 'web3forms' | 'none' = 'none'
  let lastErrorMessage: string | undefined

  const settings = await getEmailSettings()
  const configStatus = await getEmailProviderConfigStatus()

  const plainTextLines = [
    `TSTACK PLATFORM ALERT: ${payload.subject}`,
    `--------------------------------------------------`,
    ...Object.entries(payload.details)
      .filter(([_, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k}: ${v}`),
    `Timestamp: ${new Date().toUTCString()}`,
    payload.actionLink ? `Dashboard Link: ${APP_URL}${payload.actionLink}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const encodedTo = encodeURIComponent(OWNER_EMAILS.join(','))
  const encodedSubject = encodeURIComponent(`[TSTACK] ${payload.subject}`)
  const encodedBody = encodeURIComponent(plainTextLines)

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`
  const mailtoUrl = `mailto:${OWNER_EMAILS.join(',')}?subject=${encodedSubject}&body=${encodedBody}`

  // 1. Record in Activity Notification Feed for Owner Dashboard (/admin)
  try {
    await createActivityNotification({
      type: payload.type as ActivityEventType,
      title: payload.subject,
      message: `${payload.clientName || 'Visitor'} (${payload.clientEmail || 'no email'}): ${Object.values(payload.details)[0] || 'Event logged'}`,
      data: payload.details,
    })
    dispatchedChannels.push('activity_feed')
  } catch (err) {
    console.error('[Notify] Failed to record in activity feed:', err)
  }

  dispatchedChannels.push('system_audit_log')
  const htmlContent = buildOwnerAlertHtml(payload)

  // 2. Direct SMTP Delivery (Gmail App Password or Custom SMTP)
  const transporter = await getTransporter()
  if (transporter) {
    try {
      const fromUser = process.env.SMTP_USER || settings.smtpUser || DEFAULT_SENDER_EMAIL
      await transporter.sendMail({
        from: `"TSTACK Notification" <${fromUser}>`,
        to: OWNER_EMAILS.join(', '),
        replyTo: payload.clientEmail || OWNER_EMAILS[0],
        subject: `[TSTACK] ${payload.subject}`,
        text: plainTextLines,
        html: htmlContent,
      })
      dispatchedChannels.push('smtp_email')
      externalEmailDelivered = true
      providerUsed = 'smtp'
    } catch (err: any) {
      lastErrorMessage = err?.message || 'SMTP delivery failed'
      console.error('[Notify] SMTP dispatch failed:', lastErrorMessage)
    }
  }

  // 3. Resend API if configured
  const resendKey = (process.env.RESEND_API_KEY || settings.resendApiKey || '').trim()
  if (resendKey && !externalEmailDelivered) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `TSTACK System <onboarding@resend.dev>`,
          to: OWNER_EMAILS,
          reply_to: payload.clientEmail || OWNER_EMAILS[0],
          subject: `[TSTACK] ${payload.subject}`,
          html: htmlContent,
        }),
      })
      if (res.ok) {
        dispatchedChannels.push('resend_api')
        externalEmailDelivered = true
        providerUsed = 'resend'
      } else {
        const errBody = await res.text().catch(() => '')
        lastErrorMessage = `Resend HTTP ${res.status}: ${errBody.slice(0, 140)}`
      }
    } catch (err: any) {
      lastErrorMessage = err?.message || 'Resend dispatch error'
      console.error('[Notify] Resend API dispatch failed:', lastErrorMessage)
    }
  }

  // 4. Web3Forms webhook if configured
  const web3formsKey = (
    process.env.WEB3FORMS_KEY ||
    process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
    settings.web3formsKey ||
    ''
  ).trim()

  if (web3formsKey && !externalEmailDelivered) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          from_name: 'TSTACK Platform',
          replyto: payload.clientEmail || OWNER_EMAILS[0],
          subject: `[TSTACK] ${payload.subject}`,
          message: plainTextLines,
        }),
      })
      if (res.ok) {
        dispatchedChannels.push('web3forms_webhook')
        externalEmailDelivered = true
        providerUsed = 'web3forms'
      } else {
        lastErrorMessage = `Web3Forms HTTP ${res.status}`
      }
    } catch (err: any) {
      lastErrorMessage = err?.message || 'Web3Forms dispatch error'
      console.error('[Notify] Web3Forms dispatch failed:', lastErrorMessage)
    }
  }

  const emailStatus: 'delivered' | 'failed' | 'unconfigured' = externalEmailDelivered
    ? 'delivered'
    : configStatus.anyConfigured
    ? 'failed'
    : 'unconfigured'

  try {
    await createEmailDeliveryLog({
      eventType: payload.type,
      recipient: OWNER_EMAILS.join(', '),
      subject: `[TSTACK] ${payload.subject}`,
      provider: providerUsed,
      status: emailStatus,
      errorMessage:
        emailStatus === 'unconfigured'
          ? 'No external SMTP, Resend, or Web3Forms API credentials configured. Recorded in Admin Activity Feed.'
          : lastErrorMessage,
    })
  } catch (err) {
    console.error('[Notify] Failed to write EmailDeliveryLog:', err)
  }

  return {
    success: true,
    dispatchedChannels,
    externalEmailDelivered,
    emailStatus,
    providerUsed,
    errorMessage: lastErrorMessage,
    formsubmitNeedsActivation: !externalEmailDelivered,
    gmailComposeUrl,
    mailtoUrl,
  }
}

/**
 * Sends transactional email to client (e.g. registration, order confirmation, invoice)
 * Reports truthful boolean status and records in EmailDeliveryLog
 */
export async function sendClientEmail(
  recipientEmail: string,
  subject: string,
  htmlBody: string
): Promise<boolean> {
  const settings = await getEmailSettings()
  const configStatus = await getEmailProviderConfigStatus()
  let delivered = false
  let providerUsed: 'smtp' | 'resend' | 'none' = 'none'
  let lastError: string | undefined

  const transporter = await getTransporter()
  if (transporter) {
    try {
      const fromUser = process.env.SMTP_USER || settings.smtpUser || DEFAULT_SENDER_EMAIL
      await transporter.sendMail({
        from: `"TSTACK Engineering" <${fromUser}>`,
        to: recipientEmail,
        subject,
        html: htmlBody,
      })
      delivered = true
      providerUsed = 'smtp'
    } catch (err: any) {
      lastError = err?.message || 'Client SMTP failed'
    }
  }

  const resendKey = (process.env.RESEND_API_KEY || settings.resendApiKey || '').trim()
  if (!delivered && resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `TSTACK Engineering <onboarding@resend.dev>`,
          to: [recipientEmail],
          subject,
          html: htmlBody,
        }),
      })
      if (res.ok) {
        delivered = true
        providerUsed = 'resend'
      } else {
        lastError = `Resend HTTP ${res.status}`
      }
    } catch (err: any) {
      lastError = err?.message || 'Client Resend failed'
    }
  }

  try {
    await createEmailDeliveryLog({
      eventType: 'client_transactional_email',
      recipient: recipientEmail,
      subject,
      provider: providerUsed,
      status: delivered ? 'delivered' : configStatus.anyConfigured ? 'failed' : 'unconfigured',
      errorMessage: delivered
        ? undefined
        : lastError || 'No external email provider configured for transactional email.',
    })
  } catch {
    // ignore
  }

  return delivered
}

