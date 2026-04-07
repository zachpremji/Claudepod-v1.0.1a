import type { ChainNode as ChainNodeType } from '../../types'

const nodeStyles: Record<ChainNodeType['type'], { bg: string; border: string; badge: string }> = {
  user:    { bg: '#1a1a2e', border: '#4a4a6a', badge: '#4a4a6a' },
  think:   { bg: '#1e2a36', border: '#4a6070', badge: '#5580a0' },
  extract: { bg: '#2d2510', border: '#7a6010', badge: '#a08020' },
  api:     { bg: '#0f2d1e', border: '#1f7a50', badge: '#2a9a60' },
  output:  { bg: '#0e2040', border: '#2060a0', badge: '#3080c0' },
}

const typeLabels: Record<ChainNodeType['type'], string> = {
  user: 'INPUT',
  think: 'PARSE',
  extract: 'EXTRACT',
  api: 'API',
  output: 'OUTPUT',
}

interface Props {
  node: ChainNodeType
  compact?: boolean
}

export function ChainNodeBox({ node, compact }: Props) {
  const s = nodeStyles[node.type]
  return (
    <div
      className={`rounded-lg font-mono ${compact ? 'px-3 py-2' : 'px-4 py-3'} min-w-[120px]`}
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{ backgroundColor: s.badge, color: '#fff' }}
      >
        {typeLabels[node.type]}
      </span>
      <div className="mt-1.5 text-xs text-text-primary font-medium truncate">{node.label}</div>
      <div className="text-[11px] text-text-muted truncate">{node.sub}</div>
    </div>
  )
}
