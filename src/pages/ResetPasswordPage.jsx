import { useState } from 'react'
import ErrorBanner from '../components/ErrorBanner'
import ThemeToggle from '../components/ThemeToggle'
import { resetPassword } from '../services/api'

function ResetPasswordPage({ token = '', onAuthenticated, onLogin, onBack }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(token ? '' : 'This password reset link is missing its token.')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!token) {
      setError('This password reset link is missing its token.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,100}$/.test(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const session = await resetPassword({ token, newPassword: password })
      onAuthenticated(session)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 sm:right-6 lg:right-8"><ThemeToggle /></div>
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(23,32,51,0.28)] dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] sm:p-10">
        <button type="button" onClick={onBack} className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 dark:text-slate-400 dark:hover:text-white">← Back to home</button>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">New password</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">Set a new password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Choose a strong password for your URLZS account.</p>

        <div className="mt-6"><ErrorBanner message={error} onDismiss={() => setError('')} /></div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="reset-password" className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">New password</label>
            <input id="reset-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900" placeholder="Create a strong password" disabled={!token || submitting} autoFocus />
          </div>
          <div>
            <label htmlFor="reset-password-confirm" className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">Confirm password</label>
            <input id="reset-password-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900" placeholder="Enter it again" disabled={!token || submitting} />
          </div>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Use 8–100 characters with uppercase, lowercase, a number, and a special character.</p>
          <button type="submit" disabled={!token || submitting} className="w-full rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Updating password...' : 'Update password'}</button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">Ready to sign in? <button type="button" onClick={onLogin} className="font-bold text-brand hover:underline">Go to login</button></p>
      </div>
    </main>
  )
}

export default ResetPasswordPage
