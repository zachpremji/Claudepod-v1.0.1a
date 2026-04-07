import { useStore } from '../../store/useStore'
import { mcpCategories } from '../../data/mcp'
import { platformCategory } from '../../data/platforms'

const totalMcpConnectors = mcpCategories.reduce((s, c) => s + c.connectors.length, 0)
const totalActions = mcpCategories.reduce(
  (s, c) => s + c.connectors.reduce((a, cn) => a + cn.actions.length, 0),
  0,
)
const totalPlatforms = platformCategory.connectors.length

export function TopBar() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <header className="bg-pod-surface border-b border-pod px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="font-mono text-sm font-semibold text-text-primary tracking-wide">
          ClaudePod
        </h1>
        <span className="font-mono text-[10px] text-text-dim bg-pod-raised px-2 py-0.5 rounded border border-pod">
          v0.1.0-alpha
        </span>
      </div>

      <div className="flex items-center gap-1 bg-pod-raised rounded-lg p-0.5 border border-pod">
        <button
          onClick={() => setActiveTab('cmd')}
          className={`font-mono text-xs px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'cmd'
              ? 'bg-pod-accent text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Command Hub
        </button>
        <button
          onClick={() => setActiveTab('ref')}
          className={`font-mono text-xs px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'ref'
              ? 'bg-pod-accent text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Reference
        </button>
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px] text-text-muted">
        <span>
          <span className="text-pod-accent-light font-semibold">{totalMcpConnectors}</span> connectors
        </span>
        <span>
          <span className="text-pod-accent-light font-semibold">{totalActions}+</span> actions
        </span>
        <span>
          <span className="text-pod-accent-light font-semibold">{totalPlatforms}</span> platforms
        </span>
      </div>
    </header>
  )
}
