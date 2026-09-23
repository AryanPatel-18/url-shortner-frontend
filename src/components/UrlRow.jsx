import CopyButton from './CopyButton'
import StatusBadge from './StatusBadge'

function UrlRow({ item, shortUrl, busy, onGet, onStatusChange, onDelete }) {
  const nextStatus = item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'

  function handleStatusChange() {
    onStatusChange(item, nextStatus)
  }

  function handleDelete() {
    onDelete(item)
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Original URL</p>
          <a
            href={item.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm font-medium text-ink hover:text-brand hover:underline"
            title={item.originalUrl}
          >
            {item.originalUrl}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Short URL</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-bold text-brand hover:underline"
              title={shortUrl}
            >
              {shortUrl}
            </a>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Clicks</p>
            <p className="mt-1 text-lg font-bold text-ink">{item.clickCount}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton value={shortUrl} />
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-ink/30"
          >
            Open
          </a>
          <button
            type="button"
            onClick={() => onGet(item)}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleStatusChange}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Saving...' : nextStatus === 'ACTIVE' ? 'Enable' : 'Disable'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

export default UrlRow
