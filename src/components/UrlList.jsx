import LoadingState from './LoadingState'
import CopyButton from './CopyButton'
import StatusBadge from './StatusBadge'
import UrlRow from './UrlRow'

function UrlList({ urls, loading, actionId, onGet, onStatusChange, onDelete, shortUrlFor }) {
  if (loading) return <LoadingState label="Loading your links..." />

  if (!urls.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-xl text-brand" aria-hidden="true">↗</div>
        <h3 className="mt-4 text-base font-bold text-ink">No short links yet</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Create your first link above and it will appear here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-[0.13em] text-slate-400">
            <tr>
              <th className="px-5 py-4 font-bold">Original URL</th>
              <th className="px-5 py-4 font-bold">Short URL</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Clicks</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {urls.map((item) => {
              const shortUrl = shortUrlFor(item.shortCode)
              const busy = actionId === item.id
              const nextStatus = item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'

              return (
                <tr key={item.id} className="align-middle">
                  <td className="max-w-64 px-5 py-5">
                    <a href={item.originalUrl} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium text-ink hover:text-brand hover:underline" title={item.originalUrl}>{item.originalUrl}</a>
                  </td>
                  <td className="max-w-52 px-5 py-5">
                    <a href={shortUrl} target="_blank" rel="noreferrer" className="block truncate text-sm font-bold text-brand hover:underline" title={shortUrl}>{shortUrl}</a>
                  </td>
                  <td className="px-5 py-5"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-5 text-sm font-bold text-ink">{item.clickCount}</td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <CopyButton value={shortUrl} />
                      <a href={shortUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-ink/30">Open</a>
                      <button type="button" onClick={() => onGet(item)} disabled={busy} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-brand/40 hover:text-brand disabled:opacity-50">Get</button>
                      <button type="button" onClick={() => onStatusChange(item, nextStatus)} disabled={busy} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-brand/40 hover:text-brand disabled:opacity-50" title={`Set status to ${nextStatus}`}>{busy ? 'Saving' : nextStatus === 'ACTIVE' ? 'Enable' : 'Disable'}</button>
                      <button type="button" onClick={() => onDelete(item)} disabled={busy} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {urls.map((item) => (
          <UrlRow
            key={item.id}
            item={item}
            shortUrl={shortUrlFor(item.shortCode)}
            busy={actionId === item.id}
            onGet={onGet}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  )
}

export default UrlList
