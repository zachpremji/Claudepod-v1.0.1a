interface Props {
  actions: string[]
  activeAction: string | null
  onSelect: (action: string) => void
}

export function ActionChips({ actions, activeAction, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className={`font-mono text-[11px] px-3 py-1 rounded-md border transition-colors ${
            activeAction === action
              ? 'bg-pod-accent/15 border-pod-accent/40 text-pod-accent-light'
              : 'bg-pod-raised border-pod text-text-muted hover:text-text-primary hover:border-mid'
          }`}
        >
          {action}
        </button>
      ))}
    </div>
  )
}
