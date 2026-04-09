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

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className="max-w-[80%]">
            <div
              className={`px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-700 rounded-2xl rounded-br-sm'
                  : 'bg-gray-800 rounded-2xl rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>

            {msg.role === 'assistant' && msg.toolsUsed && msg.toolsUsed.length > 0 && (
              <div className="flex gap-1.5 mt-1.5 ml-1 flex-wrap">
                {msg.toolsUsed.map((tool, j) => (
                  <ToolPill key={j} name={tool} />
                ))}
              </div>
            )}

            {msg.role === 'assistant' && msg.confirmationRequired && (
              <div className="flex gap-2 mt-2 ml-1">
                <button
                  onClick={() => onConfirm?.(msg.confirmationRequired!.tool_call)}
                  className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Yes, go ahead
                </button>
                <button
                  onClick={() => onDecline?.()}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  No, cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
