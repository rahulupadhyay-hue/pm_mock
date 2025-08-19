'use client'
import { useEffect, useRef, useState } from 'react'

type Question = { question: string; question_type: string }
type Message = { role: 'assistant'|'user'; content: string }

function Countdown({ minutes=30, onEnd }:{minutes?:number; onEnd:()=>void}) {
  const [sec, setSec] = useState(minutes*60)
  useEffect(() => {
    if (sec <= 0) { onEnd(); return }
    const id = setInterval(()=>setSec(s=>s-1), 1000)
    return () => clearInterval(id)
  }, [sec, onEnd])
  const m = String(Math.floor(sec/60)).padStart(2,'0')
  const s = String(sec%60).padStart(2,'0')
  return <div className="text-xl font-semibold tabular-nums">{m}:{s}</div>
}

export default function CasePage() {
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState<Question | null>(null)
  const [msgs, setMsgs] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [ended, setEnded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/question', { method:'POST' })
      .then(r=>r.json())
      .then(d => {
        const question = d.question || 'Design an MVP for commuters.'
        const question_type = d.question_type || 'Product Design'
        setQ({ question, question_type })
        setMsgs([{ role:'assistant', content:`[${question_type}] ${question}` }])
      })
      .finally(()=>setLoading(false))
  }, [])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  function send() {
    if (!input.trim()) return
    setMsgs(m => [...m, { role:'user', content: input.trim() }])
    setInput('')
  }

  function endCase() {
    setEnded(true)
    const payload = {
      question: q?.question,
      question_type: q?.question_type,
      answer: msgs.filter(m=>m.role==='user').map(m=>m.content).join('\n\n'),
      duration_seconds: 1800
    }
    sessionStorage.setItem('eval_payload', JSON.stringify(payload))
    window.location.href = '/evaluate'
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">{q && <>Type: <b>{q.question_type}</b></>}</div>
        <div className="flex items-center gap-4">
          <Countdown minutes={30} onEnd={endCase} />
          <button onClick={endCase} className="rounded-lg px-4 py-2 border hover:bg-gray-50">End Case</button>
        </div>
      </div>

      <div className="border rounded-xl p-4 h-[60vh] overflow-y-auto bg-gray-50">
        {loading && <div>Loading case…</div>}
        {!loading && msgs.map((m,i)=>(
          <div key={i} className={`mb-3 ${m.role==='user'?'text-right':'text-left'}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${m.role==='user'?'bg-white border':'bg-blue-50 border border-blue-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <textarea
          className="flex-1 border rounded-lg p-3 h-28"
          placeholder="Type your answer here…"
          value={input}
          onChange={e=>setInput(e.target.value)}
          disabled={ended}
        />
        <button onClick={send} disabled={ended} className="h-28 w-32 rounded-lg border hover:bg-gray-50">Send</button>
      </div>
    </main>
  )
}
