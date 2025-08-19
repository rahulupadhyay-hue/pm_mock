'use client'
import { useEffect, useState } from 'react'

type Stats = { attempts: number; avgScore: number; streak: number }

export default function PracticePage() {
  const [stats, setStats] = useState<Stats>({ attempts: 0, avgScore: 0, streak: 0 })

  useEffect(() => {
    fetch('/api/stats').then(r=>r.json()).then(setStats).catch(()=>{})
  }, [])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <aside className="border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold">Your Dashboard</h3>
          <div className="text-sm text-gray-600">Cases Completed: <b>{stats.attempts}</b></div>
          <div className="text-sm text-gray-600">Overall Score: <b>{stats.avgScore.toFixed(1)}</b> / 10</div>
          <div className="text-sm text-gray-600">Streak: <b>{stats.streak}</b> days</div>
        </aside>

        <section className="border rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Ready to start your first case?</h2>
          <p className="text-gray-600">You’ll get a timed case in a chat-style interface.</p>
          <a href="/case" className="inline-block rounded-lg px-5 py-3 border hover:bg-gray-50">Start</a>
        </section>
      </div>
    </main>
  )
}
