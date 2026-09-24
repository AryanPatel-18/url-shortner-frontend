import { useEffect, useState } from 'react'

function DeleteAccountModal({ isOpen, email, onConfirm, onCancel }) {
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape' && !submitting) onCancel()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel, submitting])

  if (!isOpen) return null

  const canDelete = confirmation === email && !submitting

  async function handleSubmit(event) {
    event.preventDefault()

    if (confirmation !== email) {
      setError('The confirmation text does not match your account email.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      await onConfirm()
    } catch (requestError) {
      setError(requestError?.message || 'The account could not be deleted. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="fixed inset-0 cursor-default bg-ink/50 backdrop-blur-sm dark:bg-black/70"
        onClick={() => { if (!submitting) onCancel() }}
        aria-label="Close account deletion dialog"
      />

      <div
        className="relative z-10 w-full max-w-lg rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl animate-[fadeIn_0.2s_ease-out] dark:border-rose-500/35 dark:bg-slate-900 dark:shadow-black/50 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        aria-describedby="delete-account-description"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" aria-hidden="true">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M5.5 20h13a1.5 1.5 0 001.3-2.25l-6.5-11.25a1.5 1.5 0 00-2.6 0L4.2 17.75A1.5 1.5 0 005.5 20z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Danger zone</p>
            <h2 id="delete-account-title" className="mt-1 text-xl font-black tracking-tight text-ink dark:text-white">Delete your account?</h2>
          </div>
        </div>

        <p id="delete-account-description" className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This permanently deletes your account and all of your shortened URLs. This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="delete-account-confirmation" className="block text-sm font-semibold text-ink dark:text-slate-200">
            Type <span className="font-black text-rose-700 dark:text-rose-300">{email}</span> to confirm
          </label>
          <input
            id="delete-account-confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value)
              if (error) setError('')
            }}
            autoComplete="off"
            autoFocus
            disabled={submitting}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
            placeholder={email}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'delete-account-error' : undefined}
          />
          {error && <p id="delete-account-error" className="mt-2 text-sm font-semibold text-rose-700 dark:text-rose-300" role="alert">{error}</p>}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canDelete}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Deleting account...' : 'Delete account permanently'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteAccountModal
