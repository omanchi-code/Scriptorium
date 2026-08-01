export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          The AI Publishing Operating System
        </p>

        <h1 className="mt-6 text-6xl font-extrabold tracking-tight">
          Scriptorium
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-700">
          One Manuscript. Infinite Expressions.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600">
          Transform a single manuscript into books, articles, evidence
          libraries, videos, podcasts, newsletters, social media,
          websites, and complete digital experiences—all from one source
          of truth.
        </p>

        <div className="mt-12 flex gap-4">
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Launch Studio
          </button>

          <button className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100">
            Explore Platform
          </button>
        </div>
      </section>
    </main>
  );
}