interface ToolPillProps {
  name: string
}

const TOOL_CONFIG: Record<string, { label: string; color: string }> = {
  send_sms: { label: 'SMS', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
  send_gmail: { label: 'Gmail', color: 'text-red-400 border-red-500/20 bg-red-500/10' },
  search_gmail: { label: 'Gmail Search', color: 'text-red-400 border-red-500/20 bg-red-500/10' },
  create_calendar_event: { label: 'Calendar', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
  list_calendar_events: { label: 'Calendar', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
  send_interac_transfer: { label: 'Interac', color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
}

export default function ToolPill({ name }: ToolPillProps) {
  const config = TOOL_CONFIG[name] || { label: name, color: 'text-gray-400 border-gray-500/20 bg-gray-500/10' }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${config.color}`}>
      <svg className="w-2.5 h-2.5" viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="3" />
      </svg>
      {config.label}
    </span>
  )
}
