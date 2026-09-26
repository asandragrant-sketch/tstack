'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Bell,
  X,
  CheckCheck,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  recipientRole?: 'admin' | 'client'
  actionLink?: string
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [role, setRole] = useState<'admin' | 'client' | 'visitor'>('visitor')
  const [isOpen, setIsOpen] = useState(false)
  const [bannerDismissedId, setBannerDismissedId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const sessionId =
        typeof window !== 'undefined'
          ? localStorage.getItem('tstack_chat_session_id') || ''
          : ''
      const res = await fetch(
        `/api/notifications?sessionId=${encodeURIComponent(sessionId)}`,
        { cache: 'no-store' }
      )
      if (!res.ok) return
      const data = await res.json()
      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
        setRole(data.role || 'visitor')
      }
    } catch {
      // ignore transient network errors
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 7000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {}
  }

  const handleMarkAllRead = async () => {
    try {
      const sessionId =
        typeof window !== 'undefined'
          ? localStorage.getItem('tstack_chat_session_id') || ''
          : ''
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true, sessionId }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  const latestUnread = notifications.find((n) => !n.isRead)

  return (
    <>
      {/* Top Sticky Notification Alert Bar when Unread Messages Exist */}
      {latestUnread && bannerDismissedId !== latestUnread.id && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 text-white shadow-xl border-b border-white/20 px-4 py-2 animate-in slide-in-from-top duration-200">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 font-mono text-[10px] font-bold uppercase shrink-0">
                <Bell className="w-3 h-3 animate-bounce" />
                {role === 'admin' ? 'OWNER ALERT' : 'NEW MESSAGE'} ({unreadCount})
              </span>
              <span className="font-semibold truncate">{latestUnread.title}:</span>
              <span className="text-blue-100 truncate hidden sm:inline">
                {latestUnread.message}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={
                  latestUnread.actionLink ||
                  (role === 'admin' ? '/admin' : '/portal')
                }
                onClick={() => handleMarkRead(latestUnread.id)}
                className="px-2.5 py-1 rounded bg-white text-slate-950 font-semibold text-[11px] hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
              >
                <span>{role === 'admin' ? 'Open & Reply' : 'View Message'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleMarkRead(latestUnread.id)
                  setBannerDismissedId(latestUnread.id)
                }}
                aria-label="Dismiss notification bar"
                className="p-1 rounded hover:bg-white/20 text-white/90 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Notification Bell Button & Popover */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="View notifications and messages"
          className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Notifications & Messages"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-md animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">
                  {role === 'admin' ? 'Owner Alert Center' : 'Client Notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono text-[10px]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/70">
              {notifications.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <MessageSquare className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No notifications yet. When you receive a message or project update, it will appear here immediately.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-left transition-colors hover:bg-slate-850 ${
                      !item.isRead ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-white line-clamp-1">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <Link
                        href={
                          item.actionLink ||
                          (role === 'admin' ? '/admin' : '/portal')
                        }
                        onClick={() => {
                          handleMarkRead(item.id)
                          setIsOpen(false)
                        }}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                      >
                        <span>
                          {role === 'admin' ? 'Inspect & Reply →' : 'Open in Portal →'}
                        </span>
                      </Link>
                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(item.id)}
                          className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <Link
                href={role === 'admin' ? '/admin' : '/portal'}
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white font-medium"
              >
                {role === 'admin' ? 'Go to Owner Command Console →' : 'Go to Client Portal →'}
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 font-mono text-[10px]"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
