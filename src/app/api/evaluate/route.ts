import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'

interface EvaluationResult {
  overall: number
  structured_thinking: number
  metric_reasoning: number
  hypothesis_generation: number
  notes: string[]
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { question, question_type, answer, duration_seconds } = await req.json()

  const prompt = `
You are a senior PM interviewer. Evaluate the candidate on:
- Structured Thinking
- Metric Reasoning
- Hypothesis Generation

Each 0–10 (one decimal). Provide "overall" 0–10 weighted: structure 40%, metrics 35%, hypothesis 25%.
Return JSON:
{
  "overall": number,
  "structured_thinking": number,
  "metric_reasoning": number,
  "hypothesis_generation": number,
  "notes": [ "bullet", ... ]
}

Question: ${question}
Type: ${question_type}
Candidate Answer:
${answer}
`.trim()

  let result: EvaluationResult | null
  if (!process.env.OPENAI_API_KEY) {
    result = {
      overall: 6.7,
      structured_thinking: 7.0,
      metric_reasoning: 6.5,
      hypothesis_generation: 6.2,
      notes: [
        "Define user segments and goals up front.",
        "Tie metrics to outcomes (retention, revenue).",
        "State assumptions and testable hypotheses."
      ]
    }
  } else {
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt,
        response_format: { type: 'json_object' },
        max_output_tokens: 300
      })
    })
    const data = await r.json()
    try {
      const parsed = data?.output ? JSON.parse(data.output[0]?.content[0]?.text || "{}") : JSON.parse(data?.output_text || "{}")
      result = parsed as EvaluationResult
    } catch { result = null }
    if (!result || typeof result.overall !== 'number') {
      result = {
        overall: 6.5,
        structured_thinking: 6.5,
        metric_reasoning: 6.5,
        hypothesis_generation: 6.5,
        notes: ["Provide clearer structure and metrics."]
      }
    }
  }

  await supabase.from('attempts').insert({
    id: crypto.randomUUID(),
    user_id: user.id,
    question, question_type, answer,
    duration_seconds,
    scores: result
  })

  return NextResponse.json(result)
}
