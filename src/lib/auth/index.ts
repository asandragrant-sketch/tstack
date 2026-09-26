import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { findUserById } from '../db'
import { User } from '../db/types'

const JWT_SECRET = process.env.JWT_SECRET || 'tstack-secret-key-production-2026-auth-token-gate'
const TOKEN_COOKIE_NAME = 'tstack_session_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface AuthSessionPayload {
  userId: string
  email: string
  role: 'client' | 'admin'
  fullName: string
}

export function signAuthToken(payload: AuthSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyAuthToken(token: string): AuthSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSessionPayload
  } catch (err) {
    return null
  }
}

/**
 * Server-side helper to read the current authenticated user from cookies or Authorization header
 */
export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  let token: string | undefined

  if (req) {
    const authHeader = req.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = req.cookies.get(TOKEN_COOKIE_NAME)?.value
    }
  } else {
    try {
      const cookieStore = cookies()
      token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
    } catch {
      return null
    }
  }

  if (!token) return null

  const payload = verifyAuthToken(token)
  if (!payload) return null

  const user = await findUserById(payload.userId)
  return user || null
}

/**
 * Apply session cookie to an outgoing NextResponse
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production'
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

/**
 * Clear session cookie on logout
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
