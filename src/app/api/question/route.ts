import { NextResponse } from 'next/server'

const TYPES = ["Product Design","Prioritization","Metrics","Guesstimate","Strategy","Execution","Leadership"]

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    const t = TYPES[Math.floor(Math.random()*TYPES.length)]
    return NextResponse.json({ question_type: t, question: 'Pick a north star metric for a ride-hailing app and defend it.' })
  }

  const prompt = `You are a PM interviewer. Pick ONE type from: ${TYPES.join(", ")}.
Output JSON with fields "question_type" and "question".
Ask exactly one question, no preface, no explanations.`

  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: prompt,
      response_format: { type: 'json_object' },
      max_output_tokens: 160
    })
  })

  const data = await r.json()
  let obj: any
  try {
    obj = data?.output ? JSON.parse(data.output[0]?.content[0]?.text || "{}") : JSON.parse(data?.output_text || "{}")
  } catch { obj = null }

  return NextResponse.json(obj || { question_type: 'Product Design', question: 'Design an MVP to improve retention in a meditation app.' })
}
