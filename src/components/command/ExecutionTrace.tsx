import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { TraceStep } from './TraceStep'
import { SectionLabel } from '../shared/SectionLabel'

export function ExecutionTrace() {
  const { trace } = useStore()

  useEffect(() => {
    if (trace.status !== 'running') return
    const timeout = setTimeout(() => {
      useStore.setState((s) => ({
        trace: { ...s.trace, status: 'complete' },
      }))
    }, trace.chain.length * 260 + 300)
    return () => clearTimeout(timeout)
  }, [trace.status, trace.chain.length])

  if (!trace.visible) return null

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Execution Trace — {trace.connectorName}</SectionLabel>
        <span className="font-mono text-[11px]">
          {trace.status === 'running' ? (
            <span className="text-pod-amber">running...</span>
          ) : (
            <span className="text-pod-green">&#10003; complete</span>
          )}
        </span>
      </div>
      <div className="space-y-2">
        {trace.chain.map((node, i) => (
          <TraceStep
            key={i}
            node={node}
            index={i}
            isLast={i === trace.chain.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
