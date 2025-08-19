import { createSupabaseServer } from '@/lib/supabaseServer'
import AuthButtons from '@/components/AuthButtons'

export default async function StartPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
        <p className="text-gray-600 mb-6">Please sign in with Google to continue.</p>
        <AuthButtons />
      </main>
    )
  }

  const roles = ["Associate Product Manager","Product Manager","Senior Product Manager","Product Analyst"]
  return (
    <main className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">What is your target role?</h2>
      <p className="text-gray-600 mb-6">Pick one to personalize your practice.</p>
      <div className="grid gap-3">
        {roles.map(role => (
          <form action="/start/choose" method="POST" key={role}>
            <input type="hidden" name="role" value={role} />
            <button className="w-full text-left rounded-lg px-5 py-3 border hover:bg-gray-50" type="submit">
              {role}
            </button>
          </form>
        ))}
      </div>
    </main>
  )
}
