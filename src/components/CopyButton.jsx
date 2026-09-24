import { useState } from 'react'

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = value
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400/50"
      aria-label={`Copy ${value}`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default CopyButton
