import { useStore } from '../../store/useStore'
import { mcpCategories } from '../../data/mcp'
import { platformCategory } from '../../data/platforms'
import { CategoryRow } from '../sidebar/CategoryRow'

export function Sidebar() {
  const { searchQuery, setSearchQuery } = useStore()

  return (
    <aside className="bg-pod-surface border-r border-pod w-64 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-pod">
        <input
          type="text"
          placeholder="Search connectors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-pod-raised border border-pod rounded-md px-3 py-1.5 text-xs text-text-primary placeholder:text-text-dim font-sans outline-none focus:border-mid transition-colors"
        />
      </div>
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {mcpCategories.map((cat) => (
          <CategoryRow key={cat.name} category={cat} />
        ))}
        <CategoryRow category={platformCategory} />
      </div>
    </aside>
  )
}
