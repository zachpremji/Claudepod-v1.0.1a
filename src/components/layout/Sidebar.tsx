import { useStore } from '../../store/useStore'
import { mcpCategories } from '../../data/mcp'
import { platformCategory } from '../../data/platforms'
import { CategoryRow } from '../sidebar/CategoryRow'

export function Sidebar() {
  const { searchQuery, setSearchQuery } = useStore()

  return (
    <aside className="bg-pod-surface border-r border-pod w-60 flex flex-col overflow-hidden shrink-0">
      <div className="p-3 border-b border-pod">
        <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-2">
          Connectors
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-pod-raised border border-pod rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-dim font-sans outline-none focus:border-mid transition-colors"
        />
      </div>
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {mcpCategories.map((cat) => (
          <CategoryRow key={cat.name} category={cat} />
        ))}
        <CategoryRow category={platformCategory} />
      </div>
    </aside>
  )
}
