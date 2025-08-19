'use client'

import { useEffect, useState } from 'react'

function Timer({ seconds=60, onDone }:{seconds?:number; onDone:()=>void}) {
  const [time, setTime] = useState(seconds)
  useEffect(() => {
    if (time <= 0) { onDone(); return }
    const id = setInterval(() => setTime(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [time, onDone])
  return <div className="text-5xl font-bold tabular-nums text-center">{time}s</div>
}

export default function InterviewPage() {
  const [question, setQuestion] = useState<string>('Loading question…')
  const [answer, setAnswer] = useState<string>('')
  const [locked, setLocked] = useState<boolean>(false)

  useEffect(() => {
    // fetch a question when page loads
    fetch('/api/question', { method: 'POST' })
      .then(r => r.json())
      .then(d => setQuestion(d.question || 'Design a product for commuters.'))
      .catch(() => setQuestion('Design a product for commuters.'))
  }, [])

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <h2 className="text-xl font-semibold">Question</h2>
        <p className="p-4 border rounded-lg bg-gray-50">{question}</p>

        <Timer seconds={60} onDone={() => setLocked(true)} />

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Your Answer</label>
          <textarea
            className="w-full h-40 p-3 border rounded-lg"
            placeholder="Type your answer here…"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={locked}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-lg px-4 py-2 border border-gray-300 disabled:opacity-50"
            disabled={!locked}
            onClick={() => alert('Submitted! (We’ll add saving/feedback later)')}
          >
            Submit
          </button>
          <button
            className="rounded-lg px-4 py-2 border border-gray-300"
            onClick={() => location.reload()}
          >
            New Question
          </button>
        </div>
      </div>
    </main>
  )
}
