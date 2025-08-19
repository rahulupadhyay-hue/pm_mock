import { NextResponse } from 'next/server'

const TYPES = ["Product Design","Prioritization","Metrics","Guesstimate","Strategy","Execution","Leadership"]

interface QuestionResponse {
  question_type: string
  question: string
}

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    const t = TYPES[Math.floor(Math.random()*TYPES.length)]
    return NextResponse.json({ question_type: t, question: 'Pick a north star metric for a ride-hailing app and defend it.' })
  }

  const prompt = `You are a PM interviewer. Pick ONE type from: ${TYPES.join(", ")}.
Output JSON with fields "question_type" and "question".
Ask exactly one question, no preface, no explanations.`

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 160
    })
  })

  const data = await r.json()
  let obj: QuestionResponse | null
  try {
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}")
    obj = parsed as QuestionResponse
  } catch { obj = null }

  return NextResponse.json(obj || { question_type: 'Product Design', question: 'Design an MVP to improve retention in a meditation app.' })
}
