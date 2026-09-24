import { useCallback, useEffect, useState } from 'react'
import CopyButton from '../components/CopyButton'
import ErrorBanner from '../components/ErrorBanner'
import Navbar from '../components/Navbar'
import UrlForm from '../components/UrlForm'
import UrlList from '../components/UrlList'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { createShortUrl, deleteUrl, getShortUrl, getUrl, listUrls, updateUrlStatus } from '../services/api'

const PAGE_SIZE = 20

function DashboardPage({ auth, onLogout, onHome, onUnauthorized }) {
  const [urls, setUrls] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [actionId, setActionId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [latestShortUrl, setLatestShortUrl] = useState('')
  const [hasNext, setHasNext] = useState(false)

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null })

  const handleError = useCallback((requestError, fallback = 'Something went wrong. Please try again.') => {
    if (requestError?.status === 401) {
      onUnauthorized()
      return
    }

    if (requestError?.status === 429) {
      const wait = requestError.retryAfter ? ` Try again in about ${requestError.retryAfter} seconds.` : ''
      setError(`Too many requests.${wait}`)
      return
    }

    setError(requestError?.message || fallback)
  }, [onUnauthorized])

  const loadUrls = useCallback(async (requestedPage = page, { showSpinner = true } = {}) => {
    try {
      const response = await listUrls({ page: requestedPage, size: PAGE_SIZE, token: auth.token })
      const nextUrls = Array.isArray(response?.urls) ? response.urls : []
      setUrls(nextUrls)
      setHasNext(nextUrls.length === PAGE_SIZE)
    } catch (requestError) {
      if (requestError?.status === 401) {
        onUnauthorized()
      } else {
        setListError(requestError?.message || 'Could not load your links.')
      }
    } finally {
      if (showSpinner) setLoading(false)
    }
  }, [auth.token, onUnauthorized, page])

  useEffect(() => {
    void loadUrls(page)
  }, [loadUrls, page])

  async function handleCreate(originalUrl) {
    setCreating(true)
    setError('')
    setNotice('')

    try {
      const created = await createShortUrl(originalUrl, auth.token)
      setLatestShortUrl(getShortUrl(created.shortCode))
      setNotice('Your short link is ready.')
      await loadUrls(page, { showSpinner: false })
      return true
    } catch (requestError) {
      handleError(requestError, 'Could not create this short link.')
      return false
    } finally {
      setCreating(false)
    }
  }

  async function handleGet(item) {
    setActionId(item.id)
    setError('')
    setNotice('')

    try {
      const refreshed = await getUrl(item.id, auth.token)
      setUrls((current) => current.map((entry) => entry.id === refreshed.id ? refreshed : entry))
      setNotice('Link details refreshed.')
    } catch (requestError) {
      handleError(requestError, 'Could not refresh this link.')
    } finally {
      setActionId(null)
    }
  }

  function handleStatusChange(item, status) {
    if (status === 'DISABLED') {
      setConfirmDialog({
        isOpen: true,
        title: 'Disable Link',
        message: 'Disable this short link? It will stop redirecting for every user who references it.',
        onConfirm: () => executeStatusChange(item, status)
      });
    } else {
      executeStatusChange(item, status);
    }
  }

  async function executeStatusChange(item, status) {
    setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
    setActionId(item.id)
    setError('')
    setNotice('')

    try {
      const updated = await updateUrlStatus(item.id, status, auth.token)
      setUrls((current) => current.map((entry) => entry.id === updated.id ? updated : entry))
      setNotice(`Link ${status === 'ACTIVE' ? 'enabled' : 'disabled'}.`)
    } catch (requestError) {
      handleError(requestError, 'Could not update this link.')
    } finally {
      setActionId(null)
    }
  }

  function handleDelete(item) {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove URL',
      message: 'Remove this URL from your library? The public short link may still exist.',
      onConfirm: () => executeDelete(item)
    });
  }

  async function executeDelete(item) {
    setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
    setActionId(item.id)
    setError('')
    setNotice('')

    try {
      await deleteUrl(item.id, auth.token)
      const shouldMoveBack = page > 0 && urls.length === 1
      if (shouldMoveBack) {
        setPage((current) => current - 1)
      } else {
        await loadUrls(page, { showSpinner: false })
      }
      setNotice('Removed from your library.')
    } catch (requestError) {
      handleError(requestError, 'Could not remove this link.')
    } finally {
      setActionId(null)
    }
  }

  function goToPage(nextPage) {
    setLoading(true)
    setListError('')
    setNotice('')
    setError('')
    setPage(nextPage)
  }

  return (
    <div className="min-h-screen animated-bg">
      <Navbar email={auth.email} onHome={onHome} onLogout={onLogout} />

      <Toast message={notice} onDismiss={() => setNotice('')} />

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Your workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink dark:text-white sm:text-4xl">Good to see you.</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Create and manage the short links connected to your account.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur px-4 py-3 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Showing page</p>
            <p className="mt-1 text-lg font-black text-ink dark:text-white">{page + 1}</p>
          </div>
        </section>

        <div className="space-y-4">
          <UrlForm onSubmit={handleCreate} submitting={creating} />
          {latestShortUrl && (
            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 sm:flex-row sm:items-center sm:justify-between animate-[fadeIn_0.3s_ease-out]">
              <div className="min-w-0">
                <p className="font-bold">Short link created</p>
                <a href={latestShortUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate font-semibold text-emerald-700 hover:underline dark:text-emerald-300" title={latestShortUrl}>{latestShortUrl}</a>
              </div>
              <div className="flex shrink-0 gap-2">
                <CopyButton value={latestShortUrl} />
                <a href={latestShortUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300">Open</a>
              </div>
            </div>
          )}
          <ErrorBanner message={error} onDismiss={() => setError('')} />
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">URL library</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-ink dark:text-white">Your short links</h2>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">Newest links appear first</p>
          </div>

          {listError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-8 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
              <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">{listError}</p>
              <button type="button" onClick={() => { setLoading(true); setListError(''); loadUrls(page) }} className="mt-4 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:border-rose-500/40 dark:bg-slate-900 dark:text-rose-200 dark:hover:bg-rose-500/20">Try again</button>
            </div>
          ) : (
            <UrlList
              urls={urls}
              loading={loading}
              actionId={actionId}
              onGet={handleGet}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              shortUrlFor={getShortUrl}
            />
          )}

          {!loading && !listError && (page > 0 || hasNext) && (
            <div className="mt-5 flex items-center justify-between gap-3">
              <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 0} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-600 backdrop-blur transition hover:border-slate-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white">← Previous</button>
              <span className="text-xs font-semibold text-slate-400">Page {page + 1}</span>
              <button type="button" onClick={() => goToPage(page + 1)} disabled={!hasNext} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-600 backdrop-blur transition hover:border-slate-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white">Next →</button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
