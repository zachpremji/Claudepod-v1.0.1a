import { useStore } from '../../store/useStore'

export function TopBar() {
  const { toggleSidebar, sidebarOpen, clearMessages, messages, isResponding } = useStore()

  return (
    <header className="bg-pod-surface border-b border-pod px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            sidebarOpen
              ? 'bg-pod-accent/15 text-pod-accent-light'
              : 'text-text-muted hover:text-text-primary hover:bg-pod-raised'
          }`}
          title="Toggle connectors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="font-mono text-sm font-semibold text-text-primary tracking-wide">
          ClaudePod
        </h1>
        <span className="font-mono text-[10px] text-text-dim bg-pod-raised px-2 py-0.5 rounded border border-pod">
          v1.0.1-alpha
        </span>
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] text-text-muted">
        {isResponding && (
          <span className="text-pod-amber">responding...</span>
        )}
        {messages.length > 0 && !isResponding && (
          <button
            onClick={clearMessages}
            className="ml-2 px-2 py-1 text-[10px] text-text-dim hover:text-text-muted bg-pod-raised border border-pod rounded-md transition-colors"
          >
            New chat
          </button>
        )}
      </div>
    </header>
  )
}
