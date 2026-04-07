import { motion } from 'framer-motion'
import type { ChatMessage as ChatMessageType, ToolUseInfo } from '../../types'

// Friendly labels for tool names
const toolLabels: Record<string, string> = {
  send_slack_message: 'Slack',
  send_email: 'Gmail',
  search_email: 'Gmail',
  create_calendar_event: 'Calendar',
  list_calendar_events: 'Calendar',
  send_imessage: 'iMessage',
  send_etransfer: 'Interac',
  create_linear_issue: 'Linear',
  create_notion_page: 'Notion',
  web_search: 'Web Search',
  control_lights: 'Smart Lights',
  set_thermostat: 'Thermostat',
  play_music: 'Music',
  set_timer: 'Timer',
  get_weather: 'Weather',
  search_hubspot: 'HubSpot',
  create_stripe_refund: 'Stripe',
}

function ToolUseCard({ tool }: { tool: ToolUseInfo }) {
  const label = toolLabels[tool.name] || tool.name
  const hasResult = !!tool.result

  return (
    <motion.div
      className="my-2 rounded-lg border overflow-hidden"
      style={{
        backgroundColor: '#0f2d1e',
        borderColor: hasResult ? '#1f7a50' : '#7a6010',
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span
          className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-px rounded font-mono text-white"
          style={{ backgroundColor: hasResult ? '#2a9a60' : '#a08020' }}
        >
          {hasResult ? 'DONE' : 'CALLING'}
        </span>
        <span className="text-xs text-text-primary font-mono font-medium">{label}</span>
      </div>
      <div className="px-3 pb-2">
        <p className="text-[11px] text-text-muted font-mono break-all">
          {Object.entries(tool.input)
            .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
            .join(' | ')}
        </p>
      </div>
    </motion.div>
  )
}

interface Props {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
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

  // Assistant message
  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-[85%]">
        {/* ClaudePod header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-pod-accent/20 border border-pod-accent/30 flex items-center justify-center">
            <span className="text-[10px] text-pod-accent-light font-bold">C</span>
          </div>
          <span className="font-mono text-[11px] text-pod-accent-light font-medium">
            ClaudePod
          </span>
          {message.isStreaming && (
            <span className="font-mono text-[10px] text-pod-amber ml-auto">
              thinking...
            </span>
          )}
        </div>

        {/* Tool use cards */}
        {message.toolUse?.map((tool) => (
          <ToolUseCard key={tool.id} tool={tool} />
        ))}

        {/* Text response */}
        {message.text && (
          <div className="bg-pod-surface border border-pod rounded-2xl rounded-tl-md px-4 py-3">
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
              {message.text}
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-pod-accent-light ml-0.5 animate-pulse rounded-sm" />
              )}
            </p>
          </div>
        )}

        {/* Streaming with no text yet */}
        {!message.text && message.isStreaming && !message.toolUse?.length && (
          <div className="bg-pod-surface border border-pod rounded-2xl rounded-tl-md px-4 py-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-pod-accent-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-pod-accent-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-pod-accent-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
