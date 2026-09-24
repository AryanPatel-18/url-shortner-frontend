import ThemeToggle from './ThemeToggle'

function Navbar({ email, onHome, onLogout }) {
  return (
    <header className="border-b border-slate-200/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-brand/30"
          onClick={onHome}
          aria-label="Go to URLZS home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink dark:bg-brand text-sm font-black tracking-tight text-white">U</span>
          <span className="text-lg font-extrabold tracking-tight text-ink dark:text-white">URLZS</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="hidden max-w-48 truncate text-sm text-slate-500 dark:text-slate-400 sm:block" title={email}>{email}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:text-ink dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
