import { useState } from 'react'
import ErrorBanner from '../components/ErrorBanner'
import ThemeToggle from '../components/ThemeToggle'
import { loginUser } from '../services/api'

function LoginPage({ onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter both your email and password.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const session = await loginUser({ email: email.trim(), password })
      onLogin(session)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 sm:right-6 lg:right-8"><ThemeToggle /></div>
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(23,32,51,0.28)] dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-ink p-10 text-white dark:bg-slate-950 lg:block">
          <button type="button" onClick={onBack} className="text-left text-lg font-black tracking-tight focus:outline-none focus:ring-2 focus:ring-white/60">URLZS</button>
          <div className="mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Welcome back</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em]">Your links are waiting.</h1>
            <p className="mt-5 text-sm leading-7 text-slate-300">Sign in to create, manage, and share the URLs in your personal library.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <button type="button" onClick={onBack} className="mb-8 text-sm font-semibold text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white lg:hidden">← Back to home</button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Sign in</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Use your account to access your URL library.</p>

          <div className="mt-6"><ErrorBanner message={error} onDismiss={() => setError('')} /></div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">Email</label>
              <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900" placeholder="you@example.com" disabled={submitting} />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">Password</label>
              <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900" placeholder="Your password" disabled={submitting} />
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in...' : 'Sign in'}</button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">Need an account? <button type="button" onClick={onRegister} className="font-bold text-brand hover:underline">Create one</button></p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
