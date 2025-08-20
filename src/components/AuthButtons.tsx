'use client'
import { createSupabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthButtons() {
  const supabase = createSupabaseBrowser()

  async function signInWithGoogle() {
    const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex gap-3">
      <button onClick={signInWithGoogle} className="rounded-lg px-4 py-2 border">Sign in with Google</button>
      <button onClick={signOut} className="rounded-lg px-4 py-2 border">Sign out</button>
    </div>
  )
}
