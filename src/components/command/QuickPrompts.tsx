import { quickPrompts } from '../../data/quickPrompts'
import { useStore } from '../../store/useStore'
import { SectionLabel } from '../shared/SectionLabel'

export function QuickPrompts() {
  const runTrace = useStore((s) => s.runTrace)

  return (
    <div>
      <SectionLabel>Quick Prompts</SectionLabel>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {quickPrompts.map((qp) => (
          <button
            key={qp.text}
            onClick={() => runTrace(qp.tag, qp.chain)}
            className="text-left bg-pod-raised border border-pod rounded-lg px-4 py-3 hover:border-mid transition-colors group"
          >
            <span className="font-mono text-[10px] text-pod-accent-light uppercase tracking-wider">
              {qp.tag}
            </span>
            <p className="text-xs text-text-muted mt-1 group-hover:text-text-primary transition-colors leading-relaxed">
              {qp.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
