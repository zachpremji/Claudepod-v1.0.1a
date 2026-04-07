import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { ActionChips } from './ActionChips'
import { ChainFlow } from './ChainFlow'
import { SectionLabel } from '../shared/SectionLabel'

export function ReferenceView() {
  const { selectedConnector, selectedCategory } = useStore()
  const [activeAction, setActiveAction] = useState<string | null>(null)

  if (!selectedConnector) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-dim font-mono text-sm">
          Select a connector from the sidebar to view details.
        </p>
      </div>
    )
  }

  const chainActions = Object.keys(selectedConnector.chains)
  const currentAction = activeAction && chainActions.includes(activeAction) ? activeAction : chainActions[0] || null
  const currentChain = currentAction ? selectedConnector.chains[currentAction] : null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-mono text-sm font-semibold text-text-primary">
            {selectedConnector.name}
          </h2>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              selectedConnector.type === 'mcp'
                ? 'bg-pod-accent/10 border-pod-accent/30 text-pod-accent-light'
                : 'bg-pod-green/10 border-pod-green/30 text-pod-green'
            }`}
          >
            {selectedConnector.type === 'mcp' ? 'MCP' : 'Platform Chain'}
          </span>
        </div>
        {selectedCategory && (
          <p className="text-xs text-text-muted">Category: {selectedCategory}</p>
        )}
      </div>

      <div>
        <SectionLabel>Actions ({selectedConnector.actions.length})</SectionLabel>
        <ActionChips
          actions={selectedConnector.actions}
          activeAction={currentAction}
          onSelect={setActiveAction}
        />
      </div>

      {currentChain && (
        <div>
          <SectionLabel>
            Chain — {currentAction}
          </SectionLabel>
          <ChainFlow chain={currentChain} />
        </div>
      )}
    </div>
  )
}
