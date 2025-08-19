'use client'

import { createSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthButtons() {
  const supabase = createSupabaseBrowser()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={signInWithGoogle}
        className="rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50"
      >
        Sign in with Google
      </button>
      <button
        onClick={signOut}
        className="rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50"
      >
        Sign out
      </button>
    </div>
  )
}
