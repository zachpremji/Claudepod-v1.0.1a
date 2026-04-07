import { useState } from 'react'
import type { Category } from '../../types'
import { ConnectorRow } from './ConnectorRow'
import { useStore } from '../../store/useStore'

interface Props {
  category: Category
}

export function CategoryRow({ category }: Props) {
  const [open, setOpen] = useState(true)
  const searchQuery = useStore((s) => s.searchQuery)
  const lower = searchQuery.toLowerCase()

  const filtered = lower
    ? category.connectors.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.actions.some((a) => a.toLowerCase().includes(lower)),
      )
    : category.connectors

  if (lower && filtered.length === 0) return null

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-mono font-semibold text-text-muted hover:text-text-primary transition-colors"
      >
        <span
          className="text-[10px]"
          style={{ color: category.color }}
        >
          {open ? '▼' : '▶'}
        </span>
        <span style={{ color: category.color }}>{category.emoji}</span>
        <span>{category.name}</span>
        <span className="text-text-dim font-normal ml-auto">
          {filtered.length}
        </span>
      </button>
      {open && (
        <div className="ml-3 space-y-0.5">
          {filtered.map((conn) => (
            <ConnectorRow
              key={conn.name}
              connector={conn}
              categoryName={category.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}
