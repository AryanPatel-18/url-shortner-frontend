function ErrorBanner({ message, onDismiss, variant = 'error' }) {
  if (!message) return null

  const success = variant === 'success'

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}
      role={success ? 'status' : 'alert'}
    >
      <span className="mt-0.5 text-base" aria-hidden="true">{success ? '✓' : '!'}</span>
      <p className="min-w-0 flex-1 leading-6">{message}</p>
      {onDismiss && (
        <button
          type="button"
          className={`rounded-lg px-2 py-1 transition focus:outline-none focus:ring-2 ${success ? 'text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-500' : 'text-rose-700 hover:bg-rose-100 focus:ring-rose-500'}`}
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default ErrorBanner
