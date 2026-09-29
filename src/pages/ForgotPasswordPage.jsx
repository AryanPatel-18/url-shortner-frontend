import { useState } from 'react'
import ErrorBanner from '../components/ErrorBanner'
import ThemeToggle from '../components/ThemeToggle'
import { requestPasswordReset } from '../services/api'

function ForgotPasswordPage({ initialEmail = '', onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState('')
  const [accountNotFound, setAccountNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setError('Enter the email address linked to your account.')
      return
    }

    setError('')
    setAccountNotFound(false)
    setSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      setSubmitted(true)
    } catch (requestError) {
      if (requestError?.status === 404) {
        setError('No account found for this email. Please create an account.')
        setAccountNotFound(true)
      } else {
        setError(requestError.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 sm:right-6 lg:right-8"><ThemeToggle /></div>
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(23,32,51,0.28)] dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] sm:p-10">
        <button type="button" onClick={onBack} className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 dark:text-slate-400 dark:hover:text-white">← Back to home</button>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-brand dark:bg-blue-400/10">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
            <path d="m5 7 7 5 7-5" />
          </svg>
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-brand">Account recovery</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">Forgot your password?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Enter your email and we’ll send you a secure link to choose a new password.</p>

        {submitted ? (
          <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200" role="status">
            If an account exists for <strong>{email.trim()}</strong>, a password reset link is on its way. Check your inbox and spam folder.
          </div>
        ) : (
          <>
            <div className="mt-6">
              <ErrorBanner
                message={error}
                onDismiss={() => {
                  setError('')
                  setAccountNotFound(false)
                }}
              />
              {accountNotFound && (
                <button type="button" onClick={onRegister} className="mt-3 w-full rounded-2xl border border-brand/30 bg-blue-50 px-4 py-3 text-sm font-bold text-brand transition hover:border-brand/50 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20">Create an account</button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="forgot-email" className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">Email</label>
                <input id="forgot-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900" placeholder="you@example.com" disabled={submitting} autoFocus />
              </div>
              <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Sending link...' : 'Send reset link'}</button>
            </form>
          </>
        )}

        <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">Remembered your password? <button type="button" onClick={onLogin} className="font-bold text-brand hover:underline">Back to sign in</button></p>
      </div>
    </main>
  )
}

export default ForgotPasswordPage
