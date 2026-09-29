import { useEffect, useState } from 'react'
import ErrorBanner from './components/ErrorBanner'
import ThemeToggle from './components/ThemeToggle'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RedirectPage from './pages/RedirectPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const SESSION_KEY = 'urlzs.session'
const ROUTES = new Set(['/', '/home', '/login', '/register', '/forgot-password', '/reset-password', '/dashboard'])

function isShortCodePath(path) {
  return /^\/[a-zA-Z0-9_-]+$/.test(path)
}

function readLoginRedirect() {
  const params = new URLSearchParams(window.location.search)

  if (params.get('verified') === 'true') {
    return {
      kind: 'success',
      message: 'Your email has been verified. You can now sign in.',
    }
  }

  const error = params.get('error')
  return error ? { kind: 'error', message: error } : null
}

function readResetToken() {
  return new URLSearchParams(window.location.search).get('token') || ''
}

function readSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null

    const session = JSON.parse(stored)
    if (!session?.token || !session?.email || !session?.userId) return null
    return session
  } catch {
    return null
  }
}

function saveSession(session) {
  const normalized = {
    token: session.token,
    email: session.email,
    userId: session.userId ?? session.id,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
  return normalized
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

function currentPath() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (ROUTES.has(path) || isShortCodePath(path)) {
    return path
  }
  return '/'
}

function App() {
  const initialSession = readSession()
  const initialRedirect = currentPath() === '/login' ? readLoginRedirect() : null
  const [auth, setAuth] = useState(initialSession)
  const [route, setRoute] = useState(currentPath)
  const [flash, setFlash] = useState(initialRedirect?.message || '')
  const [flashKind, setFlashKind] = useState(initialRedirect?.kind || 'error')
  const [emailHint, setEmailHint] = useState('')
  const [dashboardNotice, setDashboardNotice] = useState('')
  const resetToken = route === '/reset-password' ? readResetToken() : ''

  useEffect(() => {
    function handlePopState() {
      setRoute(currentPath())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const isShortCode = !ROUTES.has(route) && isShortCodePath(route)

  const resolvedRoute = isShortCode 
    ? route
    : route === '/' || !ROUTES.has(route)
      ? (auth ? '/dashboard' : '/home')
      : !auth && route === '/dashboard'
        ? '/login'
        : auth && (route === '/home' || route === '/login' || route === '/register')
          ? '/dashboard'
          : route

  useEffect(() => {
    if (resolvedRoute !== route) {
      window.history.replaceState({}, '', resolvedRoute)
      // oxlint-disable-next-line react/set-state-in-effect
      setRoute(resolvedRoute)
    }
  }, [resolvedRoute, route])

  function navigate(path, { replace = false } = {}) {
    const nextPath = ROUTES.has(path) || isShortCodePath(path) ? path : '/'
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath)
    setRoute(nextPath)
    setFlash('')
    setFlashKind('error')
  }

  function handleLogin(session, { notice = '' } = {}) {
    const savedSession = saveSession(session)
    setAuth(savedSession)
    setEmailHint('')
    setDashboardNotice(notice)
    setFlash('')
    setFlashKind('error')
    navigate('/dashboard', { replace: true })
  }

  function handleLogout() {
    clearSession()
    setAuth(null)
    setEmailHint('')
    setFlash('')
    setFlashKind('error')
    navigate('/login', { replace: true })
  }

  function handleUnauthorized() {
    clearSession()
    setAuth(null)
    navigate('/login', { replace: true })
    setFlashKind('error')
    setFlash('Your session has expired. Please sign in again.')
  }

  function handleRegistration(session) {
    handleLogin(session, {
      notice: 'Welcome! Please check your email to verify your account.',
    })
  }

  function handleForgotPassword(email = '') {
    setEmailHint(email.trim())
    navigate('/forgot-password')
  }

  function handleAccountDeleted() {
    clearSession()
    setAuth(null)
    setEmailHint('')
    navigate('/login', { replace: true })
    setFlashKind('success')
    setFlash('Your account and shortened URLs were permanently deleted.')
  }

  let content

  if (isShortCode) {
    content = <RedirectPage shortCode={resolvedRoute.slice(1)} />
  } else if (auth && resolvedRoute === '/dashboard') {
    content = (
      <DashboardPage
        auth={auth}
        initialNotice={dashboardNotice}
        onLogout={handleLogout}
        onHome={() => navigate('/dashboard')}
        onUnauthorized={handleUnauthorized}
        onAccountDeleted={handleAccountDeleted}
      />
    )
  } else if (resolvedRoute === '/login') {
    content = (
      <>
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
          <ErrorBanner message={flash} variant={flashKind} onDismiss={() => setFlash('')} />
        </div>
        <LoginPage initialEmail={emailHint} onLogin={handleLogin} onRegister={() => navigate('/register')} onForgotPassword={handleForgotPassword} onBack={() => navigate('/home')} />
      </>
    )
  } else if (resolvedRoute === '/forgot-password') {
    content = <ForgotPasswordPage initialEmail={emailHint} onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} onBack={() => navigate('/home')} />
  } else if (resolvedRoute === '/reset-password') {
    content = <ResetPasswordPage token={resetToken} onAuthenticated={handleLogin} onLogin={() => navigate('/login')} onBack={() => navigate('/home')} />
  } else if (resolvedRoute === '/register') {
    content = (
      <>
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
          <ErrorBanner message={flash} variant={flashKind} onDismiss={() => setFlash('')} />
        </div>
        <RegisterPage onRegistered={handleRegistration} onGoogleRegistered={handleLogin} onLogin={() => navigate('/login')} onBack={() => navigate('/home')} />
      </>
    )
  } else {
    content = (
      <>
        <header className="relative z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800/80 dark:bg-night/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button type="button" onClick={() => navigate('/home')} className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="URLZS home">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-black tracking-tight text-white dark:bg-brand">U</span>
              <span className="text-lg font-extrabold tracking-tight text-ink dark:text-white">URLZS</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <button type="button" onClick={() => navigate('/login')} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 dark:text-slate-300 dark:hover:text-white">Sign in</button>
              <button type="button" onClick={() => navigate('/register')} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-ink/20 dark:bg-brand dark:hover:bg-blue-500">Get started</button>
            </div>
          </div>
        </header>
        <LandingPage onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
      </>
    )
  }

  return <div className="min-h-screen animated-bg text-ink dark:text-slate-100">{content}</div>
}

export default App
