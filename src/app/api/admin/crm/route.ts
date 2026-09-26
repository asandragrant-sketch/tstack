import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getLeads, upsertLead, updateLead } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const rawLeads = await getLeads()
    const leads = rawLeads.map((l) => ({
      ...l,
      stage: l.status,
      notes: l.notes?.map((n) => n.text).join(' • ') || l.requirements || '',
    }))
    return NextResponse.json({
      success: true,
      leads,
    })
  } catch (err: any) {
    console.error('[Admin CRM GET API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch CRM leads.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, phone, company, serviceInterest, budget, timeline, stage, notes } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Lead name and email are required.' },
        { status: 400 }
      )
    }

    const lead = await upsertLead({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      company: company ? String(company).trim() : undefined,
      serviceInterest: serviceInterest || 'Enterprise AI & Web Engineering',
      budget: budget ? String(budget).trim() : undefined,
      timeline: timeline ? String(timeline).trim() : undefined,
      source: 'manual',
      status: stage || 'new',
      noteText: notes ? String(notes).trim() : undefined,
    })

    return NextResponse.json({
      success: true,
      lead: { ...lead, stage: lead.status },
    })
  } catch (err: any) {
    console.error('[Admin CRM POST API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create CRM lead.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin access required.' }, { status: 403 })
    }

    const body = await req.json()
    const { id, stage, status, assignedOwner, notes, budget, timeline, serviceInterest } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID required.' }, { status: 400 })
    }

    const updated = await updateLead(id, {
      ...(stage || status ? { status: stage || status } : {}),
      ...(assignedOwner !== undefined ? { assignedOwner } : {}),
      ...(notes !== undefined ? { noteText: notes, noteAuthor: user.fullName } : {}),
      ...(budget !== undefined ? { budget } : {}),
      ...(timeline !== undefined ? { timeline } : {}),
      ...(serviceInterest !== undefined ? { serviceInterest } : {}),
    })

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      lead: { ...updated, stage: updated.status },
    })
  } catch (err: any) {
    console.error('[Admin CRM PATCH API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update CRM lead.' }, { status: 500 })
  }
}
