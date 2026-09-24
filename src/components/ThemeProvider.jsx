import { createContext, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'urlzs.theme'
const ThemeContext = createContext(null)

function readPreference() {
  if (typeof window === 'undefined') return null
  const savedTheme = window.localStorage.getItem(THEME_KEY)
  return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null
}

function resolveDarkMode(preference) {
  if (preference) return preference === 'dark'
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#07111f' : '#f8fafc')
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference)
  const [isDark, setIsDark] = useState(() => resolveDarkMode(readPreference()))

  useEffect(() => {
    applyTheme(isDark)
  }, [isDark])

  useEffect(() => {
    if (preference) return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (event) => setIsDark(event.matches)
    mediaQuery.addEventListener?.('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener?.('change', handleSystemThemeChange)
  }, [preference])

  function toggleTheme() {
    setIsDark((current) => {
      const next = !current
      const nextPreference = next ? 'dark' : 'light'
      window.localStorage.setItem(THEME_KEY, nextPreference)
      setPreference(nextPreference)
      return next
    })
  }

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
