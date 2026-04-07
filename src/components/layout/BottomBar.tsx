import { useStore } from '../../store/useStore'

export function BottomBar() {
  const { selectedConnector } = useStore()

  return (
    <footer className="bg-pod-surface border-t border-pod px-5 py-2 flex items-center justify-between font-mono text-[11px] text-text-dim">
      <div className="flex items-center gap-3">
        <span>MCP: 57 connectors</span>
        <span className="text-text-dim">·</span>
        <span>Platform chains: 5</span>
        <span className="text-text-dim">·</span>
        <span className="text-text-muted">
          {selectedConnector ? selectedConnector.name : 'No connector selected'}
        </span>
      </div>
      <span>ClaudePod v0.1.0</span>
    </footer>
  )
}
