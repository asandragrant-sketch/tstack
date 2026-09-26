import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getConversations } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const conversations = await getConversations()
    return NextResponse.json({ success: true, conversations })
  } catch (err: any) {
    console.error('[Admin Conversations API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve conversations' },
      { status: 500 }
    )
  }
}
