import type { ChainNode } from '../../types'
import { ChainNodeBox } from '../shared/ChainNode'

interface Props {
  chain: ChainNode[]
}

export function ChainFlow({ chain }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {chain.map((node, i) => (
        <div key={i} className="flex items-center gap-2">
          <ChainNodeBox node={node} compact />
          {i < chain.length - 1 && (
            <span className="text-text-dim font-mono text-xs select-none">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
