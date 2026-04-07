import { motion } from 'framer-motion'
import type { ChainNode } from '../../types'
import { ChainNodeBox } from '../shared/ChainNode'

interface Props {
  node: ChainNode
  index: number
  isLast: boolean
}

export function TraceStep({ node, index, isLast }: Props) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.26 }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-text-dim w-4 text-right">{index}</span>
        <ChainNodeBox node={node} />
      </div>
      {!isLast && (
        <div className="w-px h-8 bg-mid self-center ml-[60px]" />
      )}
    </motion.div>
  )
}
