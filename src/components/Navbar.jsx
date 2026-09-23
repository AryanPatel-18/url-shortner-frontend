function Navbar({ email, onHome, onLogout }) {
  return (
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-brand/30"
          onClick={onHome}
          aria-label="Go to URLZS home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-black tracking-tight text-white">U</span>
          <span className="text-lg font-extrabold tracking-tight text-ink">URLZS</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-48 truncate text-sm text-slate-500 sm:block" title={email}>{email}</span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
