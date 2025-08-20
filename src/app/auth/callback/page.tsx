'use client'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthCallback() {
  // For PKCE flow, the session is handled by supabase-js internally.
  // We can just send users to the next step.
  useEffect(() => {
    const next = sessionStorage.getItem('postAuthRedirect') || '/start'
    window.location.replace(next)
  }, [])

  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold">Signing you in…</h2>
      <p className="text-gray-600">One moment.</p>
    </main>
  )
}
