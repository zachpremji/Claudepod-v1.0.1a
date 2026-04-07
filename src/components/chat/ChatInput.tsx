import { useState, useRef, useEffect } from 'react'
import { routePrompt } from '../../lib/router'
import { useStore, nextId } from '../../store/useStore'

export function ChatInput() {
  const [text, setText] = useState('')
  const [routeTag, setRouteTag] = useState('')
  const { addMessage } = useStore()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Debounced route preview
  useEffect(() => {
    if (!text.trim()) {
      setRouteTag('')
      return
    }
    const timer = setTimeout(() => {
      setRouteTag(routePrompt(text).connectorName)
    }, 200)
    return () => clearTimeout(timer)
  }, [text])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return

    const result = routePrompt(trimmed)

    // Add user message
    addMessage({
      id: nextId(),
      role: 'user',
      text: trimmed,
      timestamp: Date.now(),
    })

    // Add bot response with chain
    addMessage({
      id: nextId(),
      role: 'bot',
      text: '',
      connectorName: result.connectorName,
      chain: result.chain,
      status: 'running',
      timestamp: Date.now(),
    })

    setText('')
    setRouteTag('')
  }

  return (
    <div className="border-t border-pod bg-pod-surface px-4 py-3">
      {/* Route preview tag */}
      {routeTag && (
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-dim">routing to</span>
          <span className="font-mono text-[11px] bg-pod-accent/15 text-pod-accent-light px-2 py-0.5 rounded border border-pod-accent/25">
            {routeTag}
          </span>
        </div>
      )}
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
          placeholder="Tell ClaudePod what to do..."
          rows={1}
          className="flex-1 bg-pod-raised border border-pod rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-dim font-sans outline-none focus:border-mid resize-none transition-colors min-h-[40px] max-h-[120px]"
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
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
