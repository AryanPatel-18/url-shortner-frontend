import { useState } from 'react'

function validateUrl(value) {
  if (!value.trim()) return 'Enter a URL to shorten.'

  try {
    const parsed = new URL(value.trim())
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Use a URL beginning with http:// or https://.'
    }
  } catch {
    return 'Enter a complete, valid URL.'
  }

  return ''
}

function UrlForm({ onSubmit, submitting }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = value.trim()
    const validationError = validateUrl(trimmed)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    const created = await onSubmit(trimmed)
    if (created) setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Create a short link</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">Turn a long URL into something shareable.</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <label htmlFor="original-url" className="sr-only">Original URL</label>
          <input
            id="original-url"
            type="url"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) setError('')
            }}
            placeholder="https://example.com/your-long-link"
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-brand/10 ${error ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-brand'}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'url-form-error' : undefined}
            disabled={submitting}
          />
          {error && <p id="url-form-error" className="mt-2 text-xs text-rose-700">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32"
        >
          {submitting ? 'Shortening...' : 'Shorten URL'}
        </button>
      </div>
    </form>
  )
}

export default UrlForm
