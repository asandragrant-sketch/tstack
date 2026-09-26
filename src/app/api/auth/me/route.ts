import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({
        success: false,
        user: null,
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        company: user.company,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (err: any) {
    console.error('[Auth Me API] Error:', err)
    return NextResponse.json({
      success: false,
      user: null,
    })
  }
}
