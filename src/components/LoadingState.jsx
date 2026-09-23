function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-brand" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default LoadingState
