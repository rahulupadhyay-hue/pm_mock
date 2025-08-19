import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ attempts: 0, avgScore: 0, streak: 0 })

  const { data, error } = await supabase
    .from('attempts')
    .select('scores, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error || !data) return NextResponse.json({ attempts: 0, avgScore: 0, streak: 0 })

  const attempts = data.length
  const avgScore = attempts
    ? data.reduce((sum: number, a: { scores: { overall?: number } | null }) => sum + (a.scores?.overall ?? 0), 0) / attempts
    : 0

  // naive streak placeholder
  const today = new Date().toDateString()
  const days = new Set(data.map((d: { created_at: string }) => new Date(d.created_at).toDateString()))
  const streak = days.has(today) ? 1 : 0

  return NextResponse.json({ attempts, avgScore, streak })
}
