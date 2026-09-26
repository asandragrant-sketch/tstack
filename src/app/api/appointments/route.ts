import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
} from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const allAppointments = await getAppointments()

    const bookedSlots = allAppointments
      .filter((a) => a.status !== 'cancelled')
      .map((a) => ({ date: a.date, timeSlot: a.timeSlot }))

    if (!user) {
      return NextResponse.json({
        success: true,
        bookedSlots,
        appointments: [],
      })
    }

    const userAppointments = (
      user.role === 'admin'
        ? allAppointments
        : allAppointments.filter(
            (a) =>
              a.userId === user.id ||
              a.clientEmail.toLowerCase() === user.email.toLowerCase()
          )
    ).map((a) => ({
      ...a,
      serviceInterest: a.serviceTopic,
    }))

    return NextResponse.json({
      success: true,
      bookedSlots,
      appointments: userAppointments,
    })
  } catch (err: any) {
    console.error('[Appointments GET API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments.' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()
    const {
      clientName,
      clientEmail,
      company,
      serviceInterest,
      serviceTopic,
      date,
      timeSlot,
      timezone = 'UTC',
      notes,
    } = body

    const resolvedName = (clientName || user?.fullName || '').trim()
    const resolvedEmail = (clientEmail || user?.email || '').trim()
    const resolvedTopic = String(serviceInterest || serviceTopic || 'Architecture Consultation').trim()

    if (!resolvedName || !resolvedEmail || !resolvedEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid name and email address are required.' },
        { status: 400 }
      )
    }

    if (!date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: 'Please select a date and time slot.' },
        { status: 400 }
      )
    }

    const appointment = await createAppointment({
      userId: user?.id,
      clientName: resolvedName,
      clientEmail: resolvedEmail,
      company: company ? String(company).trim() : user?.company,
      serviceTopic: resolvedTopic,
      date: String(date).trim(),
      timeSlot: String(timeSlot).trim(),
      timezone: String(timezone).trim(),
      notes: notes ? String(notes).trim() : undefined,
    })

    const notifyResult = await notifyOwners({
      type: 'appointment_booked',
      subject: `Discovery Call Booked: ${resolvedName} on ${date} at ${timeSlot} (${timezone})`,
      clientName: resolvedName,
      clientEmail: resolvedEmail,
      priority: 'high',
      details: {
        'Client Name': resolvedName,
        'Client Email': resolvedEmail,
        Company: company || 'Not specified',
        Topic: resolvedTopic,
        'Date & Time': `${date} at ${timeSlot} (${timezone})`,
        Notes: notes || 'None',
      },
      actionLink: `/admin?tab=appointments`,
      actionLabel: 'Manage Discovery Calls in Admin Console →',
    })

    await sendClientEmail(
      resolvedEmail,
      `Discovery Call Confirmed: ${date} at ${timeSlot} - TSTACK`,
      `<h2>Discovery Call Scheduled</h2><p>Hello ${resolvedName},</p><p>Your technical discovery call with TSTACK (<strong>Daniel Kylan Jacob &amp; Baron</strong>) is scheduled for <strong>${date} at ${timeSlot} (${timezone})</strong> regarding <strong>${resolvedTopic}</strong>.</p><p>You can view your booking status in your Client Portal: https://tstack-ten.vercel.app/portal</p>`
    )

    return NextResponse.json({
      success: true,
      appointment: { ...appointment, serviceInterest: appointment.serviceTopic },
      externalEmailDelivered: notifyResult.externalEmailDelivered,
      message: notifyResult.externalEmailDelivered
        ? 'Your request has been sent to the TSTACK team.'
        : 'Your request has been recorded. The team will be notified through the available support channel.',
    })
  } catch (err: any) {
    console.error('[Appointments POST API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to schedule discovery call.' },
      { status: 400 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID and status are required.' },
        { status: 400 }
      )
    }

    const updated = await updateAppointmentStatus(id, status)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Appointment not found.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      appointment: { ...updated, serviceInterest: updated.serviceTopic },
    })
  } catch (err: any) {
    console.error('[Appointments PATCH API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment.' },
      { status: 500 }
    )
  }
}
