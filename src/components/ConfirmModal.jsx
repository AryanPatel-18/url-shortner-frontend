export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity dark:bg-black/65"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-[fadeIn_0.2s_ease-out] dark:bg-slate-900 dark:ring-slate-700">
        <h3 className="text-lg font-black tracking-tight text-ink dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-ink/20 dark:bg-brand dark:hover:bg-blue-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
