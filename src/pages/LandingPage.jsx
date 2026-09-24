function LandingPage({ onLogin, onRegister }) {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand dark:border-blue-400/25 dark:bg-blue-500/10 dark:text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            Simple links, ready to share
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-ink dark:text-white sm:text-6xl lg:text-7xl">
            Shorten the link. <span className="text-brand">Keep the focus.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            URLZS turns long URLs into clean, shareable links with a focused dashboard to manage every one.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onRegister} className="rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-brand/20">Create an account</button>
            <button type="button" onClick={onLogin} className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800">Sign in</button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_-32px_rgba(23,32,51,0.35)] dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Your workspace</p>
                <p className="mt-1 text-lg font-bold text-ink dark:text-white">Link overview</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-brand dark:bg-blue-500/10 dark:text-blue-300" aria-hidden="true">↗</span>
            </div>
            <div className="space-y-3">
              {[
                ['docs.example.com/guide', 'urlzs.xyz/Ab3dE91xQ', '1,284 clicks'],
                ['portfolio.example.com/work', 'urlzs.xyz/Qp8kL20mZ', '342 clicks'],
                ['example.com/launch', 'urlzs.xyz/rT4nB76sA', '86 clicks'],
              ].map(([original, short, clicks]) => (
                <div key={short} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{original}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-bold text-brand">{short}</p>
                    <p className="shrink-0 text-xs font-semibold text-slate-400 dark:text-slate-500">{clicks}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Protected with JWT authentication
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30 sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Built for clarity</p>
            <p className="mt-1 text-sm font-bold text-ink dark:text-white">Fast. Focused. Yours.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ['01', 'Fast URL shortening', 'Create a clean short link in one focused step.'],
            ['02', 'JWT authentication', 'Your URL library stays scoped to your account.'],
            ['03', 'Redis-powered backend', 'Caching, click tracking, and rate limiting work behind the scenes.'],
          ].map(([number, title, copy]) => (
            <div key={number} className="flex gap-4">
              <span className="text-xs font-black text-brand">{number}</span>
              <div>
                <h2 className="text-sm font-bold text-ink dark:text-white">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default LandingPage
