import { useEffect, useRef, useState } from 'react'
import { loginWithGoogle } from '../services/api'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function GoogleAuthButton({ onSuccess, onError }) {
  const googleButtonRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!googleClientId) return undefined

    let cancelled = false
    let retryTimer

    function renderGoogleButton() {
      if (cancelled) return

      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        retryTimer = window.setTimeout(renderGoogleButton, 100)
        return
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential || cancelled) {
            onError('Google sign-in did not return a valid credential. Please try again.')
            return
          }

          setSubmitting(true)
          try {
            const session = await loginWithGoogle(response.credential)
            onSuccess(session)
          } catch (requestError) {
            onError(requestError?.message || 'Google sign-in failed. Please try again.')
          } finally {
            setSubmitting(false)
          }
        },
      })

      googleButtonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 320,
      })
    }

    renderGoogleButton()

    return () => {
      cancelled = true
      window.clearTimeout(retryTimer)
    }
  }, [onError, onSuccess])

  if (!googleClientId) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className={`relative mt-5 flex min-h-10 justify-center ${submitting ? 'opacity-60' : ''}`} ref={googleButtonRef} aria-label="Continue with Google" />
      {submitting && <p className="mt-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Signing in with Google...</p>}
    </div>
  )
}

export default GoogleAuthButton
