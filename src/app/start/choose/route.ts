import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/start', req.url))

  const form = await req.formData()
  const role = String(form.get('role') || '')

  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    target_role: role
  })

  return NextResponse.redirect(new URL('/practice', req.url))
}
