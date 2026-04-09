import { useEffect, useRef } from 'react'
import { Message } from '../types'
import ToolPill from './ToolPill'

interface TranscriptProps {
  messages: Message[]
  onConfirm?: (toolCall: object) => void
  onDecline?: () => void
}

export default function Transcript({ messages, onConfirm, onDecline }: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-sm text-gray-600 text-center">
          Say something or type a message to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[85%] ${msg.role === 'assistant' ? 'flex gap-2.5' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            )}

            <div>
              <div
                className={`px-4 py-2.5 text-[14px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600/90 backdrop-blur rounded-2xl rounded-br-md text-white'
                    : 'bg-white/[0.06] backdrop-blur border border-white/[0.06] rounded-2xl rounded-bl-md text-gray-200'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'assistant' && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {msg.toolsUsed.map((tool, j) => (
                    <ToolPill key={j} name={tool} />
                  ))}
                </div>
              )}

              {msg.role === 'assistant' && msg.confirmationRequired && (
                <div className="flex gap-2 mt-2.5">
                  <button
                    onClick={() => onConfirm?.(msg.confirmationRequired!.tool_call)}
                    className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all active:scale-95"
                  >
                    Yes, go ahead
                  </button>
                  <button
                    onClick={() => onDecline?.()}
                    className="px-4 py-1.5 text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] rounded-lg transition-all active:scale-95"
                  >
                    No, cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
