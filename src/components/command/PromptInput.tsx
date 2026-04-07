import { useState, useEffect, useCallback } from 'react'
import { routePrompt } from '../../lib/router'
import { useStore } from '../../store/useStore'

export function PromptInput() {
  const [text, setText] = useState('')
  const [routeTag, setRouteTag] = useState('')
  const { runTrace, clearTrace } = useStore()

  const updateRoute = useCallback((value: string) => {
    if (!value.trim()) {
      setRouteTag('')
      return
    }
    const result = routePrompt(value)
    setRouteTag(result.connectorName)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => updateRoute(text), 300)
    return () => clearTimeout(timer)
  }, [text, updateRoute])

  const handleExecute = () => {
    if (!text.trim()) return
    const result = routePrompt(text)
    runTrace(result.connectorName, result.chain)
  }

  const handleClear = () => {
    setText('')
    setRouteTag('')
    clearTrace()
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleExecute()
            }
          }}
          placeholder="Enter a natural language prompt..."
          rows={3}
          className="w-full bg-pod-raised border border-pod rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-dim font-sans outline-none focus:border-mid resize-none transition-colors"
        />
        {routeTag && (
          <span className="absolute top-2 right-2 font-mono text-[10px] bg-pod-accent/20 text-pod-accent-light px-2 py-0.5 rounded border border-pod-accent/30">
            → {routeTag}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleExecute}
          className="font-mono text-xs px-4 py-2 bg-pod-accent text-white rounded-md hover:bg-pod-accent/90 transition-colors"
        >
          Execute
        </button>
        <button
          onClick={handleClear}
          className="font-mono text-xs px-4 py-2 bg-pod-raised text-text-muted border border-pod rounded-md hover:text-text-primary transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
