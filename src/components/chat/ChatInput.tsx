import { useState, useRef } from 'react'
import { useStore } from '../../store/useStore'

export function ChatInput() {
  const [text, setText] = useState('')
  const { sendChat, isResponding } = useStore()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isResponding) return
    sendChat(trimmed)
    setText('')
  }

  return (
    <div className="border-t border-pod bg-pod-surface px-4 py-3">
      <div className="flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={isResponding ? 'ClaudePod is thinking...' : 'Tell ClaudePod what to do...'}
          rows={1}
          disabled={isResponding}
          className="flex-1 bg-pod-raised border border-pod rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-dim font-sans outline-none focus:border-mid resize-none transition-colors min-h-[40px] max-h-[120px] disabled:opacity-50"
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isResponding}
          className="h-10 w-10 rounded-xl bg-pod-accent text-white flex items-center justify-center hover:bg-pod-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
