import { useEffect, useState, useRef } from 'react'
import { API_BASE_URL } from '../services/api'

export default function RedirectPage({ shortCode }) {
  const [error, setError] = useState(null)
  const redirectStarted = useRef(false)

  useEffect(() => {
    if (redirectStarted.current) return
    redirectStarted.current = true

    let mounted = true

    async function doRedirect() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/redirect/${encodeURIComponent(shortCode)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            redirect: 'manual',
          }
        )

        if (response.status === 404) {
          if (mounted) setError('This link does not exist.')
          return
        }

        if (response.status === 410) {
          if (mounted) setError('This link is no longer active.')
          return
        }

        if (!response.ok && response.type !== 'opaqueredirect') {
          if (mounted) setError('This link could not be loaded.')
          return
        }

        let data
        try {
          data = await response.json()
        } catch {
          if (mounted) setError('Invalid response from server.')
          return
        }

        if (!data?.originalUrl) {
          if (mounted) setError('Invalid response from server.')
          return
        }

        // Validate URL before redirecting
        try {
          const parsed = new URL(data.originalUrl)
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            if (mounted) setError('This URL is invalid.')
            return
          }
        } catch {
          if (mounted) setError('This URL is invalid.')
          return
        }

        // Redirect — don't update state after this
        window.location.replace(data.originalUrl)
      } catch {
        if (mounted) setError('This link could not be loaded. Please try again later.')
      }
    }

    void doRedirect()

    return () => {
      mounted = false
    }
  }, [shortCode])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white/70 p-8 text-center shadow-sm backdrop-blur dark:bg-slate-900/70">
          <svg className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-xl font-bold text-ink dark:text-white">Link Unavailable</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-6 py-4 shadow-sm backdrop-blur dark:bg-slate-900/70">
        <svg className="h-5 w-5 animate-spin text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Redirecting...</span>
      </div>
    </div>
  )
}
