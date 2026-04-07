import type { Connector } from '../../types'
import { useStore } from '../../store/useStore'

interface Props {
  connector: Connector
  categoryName: string
}

export function ConnectorRow({ connector, categoryName }: Props) {
  const { selectedConnector, selectConnector } = useStore()
  const isSelected = selectedConnector?.name === connector.name

  return (
    <button
      onClick={() => selectConnector(connector, categoryName)}
      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-sans transition-colors flex items-center justify-between group ${
        isSelected
          ? 'bg-pod-raised border border-pod-accent/25 text-text-primary'
          : 'text-text-muted hover:text-text-primary hover:bg-pod-raised border border-transparent'
      }`}
    >
      <span className="truncate">{connector.name}</span>
      <span className="font-mono text-[10px] text-text-dim">
        {connector.actions.length}
      </span>
    </button>
  )
}
