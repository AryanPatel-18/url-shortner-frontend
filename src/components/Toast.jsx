import { useEffect } from 'react'

export default function Toast({ message, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [message, onDismiss, duration]);

  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 transform animate-[slideDown_0.3s_ease-out] sm:w-auto">
      <div className="flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-800 shadow-lg dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 sm:w-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="font-medium">{message}</p>
        <button 
          onClick={onDismiss}
          className="ml-2 rounded-full p-1 text-emerald-600 hover:bg-emerald-100 focus:outline-none dark:text-emerald-300 dark:hover:bg-emerald-500/20"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
