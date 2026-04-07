import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { SuggestionChips } from './SuggestionChips'

export function ChatView() {
  const messages = useStore((s) => s.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages and streaming updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <SuggestionChips />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
      <ChatInput />
    </div>
  )
}
