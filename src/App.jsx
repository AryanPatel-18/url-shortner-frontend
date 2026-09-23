import { useState } from 'react'
import ErrorBanner from './components/ErrorBanner'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const SESSION_KEY = 'urlzs.session'

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
    userId: session.userId,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
  return normalized
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

function App() {
  const initialSession = readSession()
  const [auth, setAuth] = useState(initialSession)
  const [page, setPage] = useState(initialSession ? 'dashboard' : 'landing')
  const [flash, setFlash] = useState('')
  const [flashKind, setFlashKind] = useState('error')

  function handleLogin(session) {
    const savedSession = saveSession(session)
    setAuth(savedSession)
    setFlash('')
    setFlashKind('error')
    setPage('dashboard')
  }

  function handleLogout() {
    clearSession()
    setAuth(null)
    setFlash('')
    setFlashKind('error')
    setPage('landing')
  }

  function handleUnauthorized() {
    clearSession()
    setAuth(null)
    setPage('login')
    setFlashKind('error')
    setFlash('Your session has expired. Please sign in again.')
  }

  function handleRegistration(email) {
    setFlashKind('success')
    setFlash(`Account created for ${email}. Sign in to continue.`)
    setPage('login')
  }

  function navigate(nextPage) {
    setFlash('')
    setFlashKind('error')
    setPage(nextPage)
  }

  let content

  if (auth) {
    content = (
      <DashboardPage
        auth={auth}
        onLogout={handleLogout}
        onHome={() => navigate('dashboard')}
        onUnauthorized={handleUnauthorized}
      />
    )
  } else if (page === 'login') {
    content = (
      <>
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
          <ErrorBanner message={flash} variant={flashKind} onDismiss={() => setFlash('')} />
        </div>
        <LoginPage onLogin={handleLogin} onRegister={() => navigate('register')} onBack={() => navigate('landing')} />
      </>
    )
  } else if (page === 'register') {
    content = (
      <>
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
          <ErrorBanner message={flash} variant={flashKind} onDismiss={() => setFlash('')} />
        </div>
        <RegisterPage onRegistered={handleRegistration} onLogin={() => navigate('login')} onBack={() => navigate('landing')} />
      </>
    )
  } else {
    content = (
      <>
        <header className="relative z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button type="button" onClick={() => navigate('landing')} className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="URLZS home">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-black tracking-tight text-white">U</span>
              <span className="text-lg font-extrabold tracking-tight text-ink">URLZS</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => navigate('login')} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30">Sign in</button>
              <button type="button" onClick={() => navigate('register')} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-ink/20">Get started</button>
            </div>
          </div>
        </header>
        <LandingPage onLogin={() => navigate('login')} onRegister={() => navigate('register')} />
      </>
    )
  }

  return <div className="min-h-screen bg-surface text-ink">{content}</div>
}

export default App
