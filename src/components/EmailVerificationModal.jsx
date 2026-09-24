import { useState } from 'react'

function EmailVerificationModal({ isOpen, email, onResend, onCheck, onVerified, onCancel }) {
  const [resending, setResending] = useState(false)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState('Verify your email address before continuing to your dashboard.')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  if (!isOpen) return null

  async function handleResend() {
    setError('')
    setResending(true)
    try {
      const response = await onResend()
      setSent(true)
      setMessage(response || 'A new verification email has been sent. Check your inbox.')
    } catch (requestError) {
      setError(requestError?.message || 'The verification email could not be sent.')
    } finally {
      setResending(false)
    }
  }

  async function handleCheck() {
    setError('')
    setChecking(true)
    try {
      const verified = await onCheck()
      if (!verified) {
        setMessage('Your email is still waiting for verification. Click the link in your email, then check again.')
        return
      }

      setMessage('Email verified. Signing you in...')
      await onVerified()
    } catch (requestError) {
      setError(requestError?.message || 'Verification could not be checked. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button type="button" className="fixed inset-0 cursor-default bg-ink/50 backdrop-blur-sm dark:bg-black/70" onClick={onCancel} aria-label="Close email verification dialog" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-blue-200 bg-white p-6 shadow-2xl animate-[fadeIn_0.2s_ease-out] dark:border-blue-400/30 dark:bg-slate-900 dark:shadow-black/50 sm:p-7" role="dialog" aria-modal="true" aria-labelledby="verification-modal-title" aria-describedby="verification-modal-description">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-brand dark:bg-blue-500/15 dark:text-blue-300" aria-hidden="true">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.75A1.75 1.75 0 015.75 5h12.5A1.75 1.75 0 0120 6.75v10.5A1.75 1.75 0 0118.25 19H5.75A1.75 1.75 0 014 17.25V6.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l7 5 7-5" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Almost there</p>
            <h2 id="verification-modal-title" className="mt-1 text-xl font-black tracking-tight text-ink dark:text-white">Verify your email</h2>
          </div>
        </div>

        <p id="verification-modal-description" className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          We found an unverified account for <span className="font-bold text-ink dark:text-white">{email}</span>. Send a verification link, open it, and then continue here.
        </p>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900 dark:border-blue-400/25 dark:bg-blue-500/10 dark:text-blue-100" role="status" aria-live="polite">
          {message}
        </div>

        {error && <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold leading-6 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200" role="alert">{error}</p>}

        <div className="mt-6 space-y-3">
          <button type="button" onClick={handleResend} disabled={resending || checking} className="w-full rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60">
            {resending ? 'Sending verification email...' : sent ? 'Send again' : 'Send verification email'}
          </button>
          <button type="button" onClick={handleCheck} disabled={resending || checking} className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700">
            {checking ? 'Checking verification...' : 'I have verified my email'}
          </button>
          <button type="button" onClick={onCancel} disabled={resending || checking} className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-white">
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationModal
