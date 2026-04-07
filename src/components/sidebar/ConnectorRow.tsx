import type { Connector } from '../../types'
import { useStore, nextId } from '../../store/useStore'

interface Props {
  connector: Connector
  categoryName: string
}

export function ConnectorRow({ connector, categoryName }: Props) {
  const { addMessage } = useStore()

  const handleClick = () => {
    // Grab the first chain for this connector and run it in chat
    const firstAction = Object.keys(connector.chains)[0]
    if (!firstAction) return
    const chain = connector.chains[firstAction]

    addMessage({
      id: nextId(),
      role: 'user',
      text: `${connector.name}: ${firstAction}`,
      timestamp: Date.now(),
    })
    addMessage({
      id: nextId(),
      role: 'bot',
      text: '',
      connectorName: connector.name,
      chain,
      status: 'running',
      timestamp: Date.now(),
    })
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-3 py-1.5 rounded-md text-xs font-sans transition-colors flex items-center justify-between group text-text-muted hover:text-text-primary hover:bg-pod-raised border border-transparent"
    >
      <span className="truncate">{connector.name}</span>
      <span className="font-mono text-[10px] text-text-dim">
        {connector.actions.length}
      </span>
    </button>
  )
}
