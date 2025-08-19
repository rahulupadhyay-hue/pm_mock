'use client'
import { useEffect, useState } from 'react'

type Scores = {
  overall: number
  structured_thinking: number
  metric_reasoning: number
  hypothesis_generation: number
  notes: string[]
}

export default function EvaluatePage() {
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Scores | null>(null)

  useEffect(() => {
    const payloadStr = sessionStorage.getItem('eval_payload')
    if (!payloadStr) { window.location.href = '/practice'; return }
    fetch('/api/evaluate', { method:'POST', headers:{'Content-Type':'application/json'}, body: payloadStr })
      .then(r=>r.json())
      .then(setScores)
      .finally(()=>setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="max-w-xl mx-auto p-6 text-center space-y-3">
        <h2 className="text-2xl font-semibold">Evaluating your responses, please be patient…</h2>
        <p className="text-gray-600">This usually takes a few seconds.</p>
      </main>
    )
  }

  if (!scores) {
    return (
      <main className="max-w-xl mx-auto p-6 text-center">
        <p>Something went wrong. Please try again.</p>
        <a href="/practice" className="underline">Back</a>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Your Results</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Metric label="Overall" value={scores.overall} />
        <Metric label="Structured Thinking" value={scores.structured_thinking} />
        <Metric label="Metric Reasoning" value={scores.metric_reasoning} />
        <Metric label="Hypothesis Generation" value={scores.hypothesis_generation} />
      </div>

      {scores.notes?.length ? (
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Improvement Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {scores.notes.map((n,i)=><li key={i}>{n}</li>)}
          </ul>
        </div>
      ): null}

      <a href="/practice" className="inline-block rounded-lg px-5 py-3 border hover:bg-gray-50">Do another case</a>
    </main>
  )
}

function Metric({label, value}:{label:string; value:number}) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-3xl font-bold">{value.toFixed(1)} <span className="text-gray-400 text-base">/ 10</span></div>
    </div>
  )
}
