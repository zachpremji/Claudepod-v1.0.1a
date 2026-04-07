import { PromptInput } from './PromptInput'
import { ExecutionTrace } from './ExecutionTrace'
import { QuickPrompts } from './QuickPrompts'

export function CommandHub() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="font-mono text-sm font-semibold text-text-primary mb-1">
          Command Hub
        </h2>
        <p className="text-xs text-text-muted mb-4">
          Enter a natural language prompt. It will be routed to the correct connector and animated as an execution chain.
        </p>
        <PromptInput />
      </div>
      <ExecutionTrace />
      <QuickPrompts />
    </div>
  )
}
