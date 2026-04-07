import { quickPrompts } from '../../data/quickPrompts'
import { useStore, nextId } from '../../store/useStore'
import { routePrompt } from '../../lib/router'

export function SuggestionChips() {
  const { addMessage, messages } = useStore()

  // Only show suggestions when chat is empty
  if (messages.length > 0) return null

  const handleChip = (text: string) => {
    const result = routePrompt(text)
    addMessage({
      id: nextId(),
      role: 'user',
      text,
      timestamp: Date.now(),
    })
    addMessage({
      id: nextId(),
      role: 'bot',
      text: '',
      connectorName: result.connectorName,
      chain: result.chain,
      status: 'running',
      timestamp: Date.now(),
    })
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <div className="mb-8 text-center">
        <h2 className="font-mono text-lg font-semibold text-text-primary mb-2">ClaudePod</h2>
        <p className="text-sm text-text-muted max-w-md">
          Tell me what to do. I can send messages, transfer money, create tickets, schedule meetings, search data, and more.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-w-lg w-full">
        {quickPrompts.map((qp) => (
          <button
            key={qp.text}
            onClick={() => handleChip(qp.text)}
            className="text-left bg-pod-raised border border-pod rounded-xl px-3 py-2.5 hover:border-mid transition-colors group"
          >
            <span className="font-mono text-[10px] text-pod-accent-light uppercase tracking-wider">
              {qp.tag}
            </span>
            <p className="text-[12px] text-text-muted mt-1 group-hover:text-text-primary transition-colors leading-snug">
              {qp.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
