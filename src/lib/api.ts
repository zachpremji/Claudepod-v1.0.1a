export interface ApiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamCallbacks {
  onText: (text: string) => void
  onToolUse: (data: { id: string; name: string; input: Record<string, unknown> }) => void
  onToolResult: (data: { tool_use_id: string; name: string; result: string }) => void
  onDone: () => void
  onError: (message: string) => void
}

export async function streamChat(messages: ApiMessage[], callbacks: StreamCallbacks) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    callbacks.onError(`Server error: ${res.status}`)
    return
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    let eventType = ''
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7)
      } else if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        switch (eventType) {
          case 'text':
            callbacks.onText(data.text)
            break
          case 'tool_use':
            callbacks.onToolUse(data)
            break
          case 'tool_result':
            callbacks.onToolResult(data)
            break
          case 'done':
            callbacks.onDone()
            break
          case 'error':
            callbacks.onError(data.message)
            break
        }
      }
    }
  }
}
