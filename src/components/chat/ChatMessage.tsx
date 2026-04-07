import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ChatMessage as ChatMessageType } from '../../types'
import { useStore } from '../../store/useStore'

const nodeStyles: Record<string, { bg: string; border: string; badge: string }> = {
  user:    { bg: '#1a1a2e', border: '#4a4a6a', badge: '#4a4a6a' },
  think:   { bg: '#1e2a36', border: '#4a6070', badge: '#5580a0' },
  extract: { bg: '#2d2510', border: '#7a6010', badge: '#a08020' },
  api:     { bg: '#0f2d1e', border: '#1f7a50', badge: '#2a9a60' },
  output:  { bg: '#0e2040', border: '#2060a0', badge: '#3080c0' },
}

const typeLabels: Record<string, string> = {
  user: 'INPUT',
  think: 'PARSE',
  extract: 'EXTRACT',
  api: 'API',
  output: 'OUTPUT',
}

interface Props {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
  const updateMessage = useStore((s) => s.updateMessage)

  // Mark as complete after chain animation finishes
  useEffect(() => {
    if (message.role === 'bot' && message.status === 'running' && message.chain) {
      const timeout = setTimeout(() => {
        updateMessage(message.id, { status: 'complete' })
      }, message.chain.length * 260 + 400)
      return () => clearTimeout(timeout)
    }
  }, [message.id, message.role, message.status, message.chain, updateMessage])

  if (message.role === 'user') {
    return (
      <motion.div
        className="flex justify-end mb-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-[70%] bg-pod-accent/20 border border-pod-accent/30 rounded-2xl rounded-br-md px-4 py-2.5">
          <p className="text-sm text-text-primary">{message.text}</p>
        </div>
      </motion.div>
    )
  }

  // Bot message with execution chain
  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-[85%]">
        {/* Connector header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-pod-accent/20 border border-pod-accent/30 flex items-center justify-center">
            <span className="text-[10px] text-pod-accent-light font-bold">C</span>
          </div>
          <span className="font-mono text-[11px] text-pod-accent-light font-medium">
            ClaudePod
          </span>
          {message.connectorName && (
            <span className="font-mono text-[10px] bg-pod-raised border border-mid px-2 py-0.5 rounded text-text-muted">
              {message.connectorName}
            </span>
          )}
          <span className="font-mono text-[10px] ml-auto">
            {message.status === 'running' ? (
              <span className="text-pod-amber">executing...</span>
            ) : (
              <span className="text-pod-green">done</span>
            )}
          </span>
        </div>

        {/* Chain steps */}
        {message.chain && (
          <div className="bg-pod-surface border border-pod rounded-2xl rounded-tl-md p-4 space-y-2">
            {message.chain.map((node, i) => {
              const s = nodeStyles[node.type] || nodeStyles.api
              return (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.26 }}
                >
                  {/* Step number + vertical line */}
                  <div className="flex flex-col items-center pt-1">
                    <span className="font-mono text-[10px] text-text-dim w-4 text-center">{i}</span>
                    {i < message.chain!.length - 1 && (
                      <div className="w-px h-4 mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                    )}
                  </div>

                  {/* Node card */}
                  <div
                    className="flex-1 rounded-lg px-3 py-2 min-w-0"
                    style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-px rounded font-mono"
                        style={{ backgroundColor: s.badge, color: '#fff' }}
                      >
                        {typeLabels[node.type] || 'STEP'}
                      </span>
                      <span className="text-xs text-text-primary font-medium font-mono truncate">
                        {node.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted font-mono truncate">{node.sub}</p>
                  </div>
                </motion.div>
              )
            })}

            {/* Completion message */}
            {message.status === 'complete' && (
              <motion.div
                className="pt-2 border-t border-pod mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-pod-green font-mono">
                  Action completed via {message.connectorName}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
