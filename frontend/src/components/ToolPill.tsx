interface ToolPillProps {
  name: string
}

const TOOL_LABELS: Record<string, string> = {
  send_sms: 'SMS',
  send_gmail: 'Gmail',
  search_gmail: 'Gmail Search',
  create_calendar_event: 'Calendar',
  list_calendar_events: 'Calendar',
  send_interac_transfer: 'Interac',
}

export default function ToolPill({ name }: ToolPillProps) {
  const label = TOOL_LABELS[name] || name

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 bg-gray-700/50 rounded-full border border-gray-700">
      {label}
    </span>
  )
}
