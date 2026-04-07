import type { Connector } from '../../types'
import { useStore } from '../../store/useStore'

interface Props {
  connector: Connector
  categoryName: string
}

export function ConnectorRow({ connector, categoryName }: Props) {
  const { sendChat, isResponding } = useStore()

  const handleClick = () => {
    if (isResponding) return
    const firstAction = Object.keys(connector.chains)[0]
    if (!firstAction) return
    sendChat(`${connector.name}: ${firstAction}`)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isResponding}
      className="w-full text-left px-3 py-1.5 rounded-md text-xs font-sans transition-colors flex items-center justify-between group text-text-muted hover:text-text-primary hover:bg-pod-raised border border-transparent disabled:opacity-50"
    >
      <span className="truncate">{connector.name}</span>
      <span className="font-mono text-[10px] text-text-dim">
        {connector.actions.length}
      </span>
    </button>
  )
}
