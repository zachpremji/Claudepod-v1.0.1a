import { quickPrompts } from '../../data/quickPrompts'
import { useStore } from '../../store/useStore'

export function SuggestionChips() {
  const { sendChat, messages, isResponding } = useStore()

  if (messages.length > 0) return null

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <div className="mb-8 text-center">
        <h2 className="font-mono text-lg font-semibold text-text-primary mb-2">ClaudePod</h2>
        <p className="text-sm text-text-muted max-w-md">
          Hey! I'm ClaudePod, your smart home assistant. I can send messages, manage your calendar, control your home, and a whole lot more. Just ask.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-w-lg w-full">
        {quickPrompts.map((qp) => (
          <button
            key={qp.text}
            onClick={() => !isResponding && sendChat(qp.text)}
            disabled={isResponding}
            className="text-left bg-pod-raised border border-pod rounded-xl px-3 py-2.5 hover:border-mid transition-colors group disabled:opacity-50"
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
