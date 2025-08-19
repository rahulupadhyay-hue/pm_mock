export default function Home() {
  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Master Your PM Interviews</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Practice product management interviews with AI-powered feedback. Track your progress, improve your answers, and land your dream PM role with confidence.
        </p>
        <a
          href="/start"
          className="inline-block rounded-lg px-6 py-3 border border-gray-300 hover:bg-gray-50"
        >
          Start Practicing
        </a>
      </div>
    </main>
  )
}
