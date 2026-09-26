import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getInvoices } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const invoices =
      user.role === 'admin' ? await getInvoices() : await getInvoices(user.id)

    return NextResponse.json({
      success: true,
      invoices,
    })
  } catch (err: any) {
    console.error('[Invoices API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to load invoices.' },
      { status: 500 }
    )
  }
}
