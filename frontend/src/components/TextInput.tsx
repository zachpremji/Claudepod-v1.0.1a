import { useState, useCallback, KeyboardEvent } from 'react'

interface TextInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function TextInput({ onSend, disabled }: TextInputProps) {
  const [value, setValue] = useState('')

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type a message..."
        className="flex-1 bg-white/[0.06] text-white text-sm px-4 py-3 rounded-xl border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/20 placeholder-gray-500 disabled:opacity-40 transition-all"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 rounded-xl transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
        </svg>
      </button>
    </div>
  )
}
