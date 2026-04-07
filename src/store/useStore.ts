import { create } from 'zustand'
import type { ChatMessage, Connector, ToolUseInfo } from '../types'
import { streamChat } from '../lib/api'
import type { ApiMessage } from '../lib/api'

interface Store {
  // Chat
  messages: ChatMessage[]
  isResponding: boolean
  addUserMessage: (text: string) => void
  sendChat: (text: string) => void
  clearMessages: () => void

  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  selectedConnector: Connector | null
  selectedCategory: string | null
  selectConnector: (connector: Connector, category: string) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

let msgCounter = 0
export function nextId() {
  return `msg-${++msgCounter}-${Date.now()}`
}

export const useStore = create<Store>((set, get) => ({
  messages: [],
  isResponding: false,

  addUserMessage: (text: string) => {
    const msg: ChatMessage = {
      id: nextId(),
      role: 'user',
      text,
      timestamp: Date.now(),
    }
    set((s) => ({ messages: [...s.messages, msg] }))
  },

  sendChat: async (text: string) => {
    const { messages, addUserMessage } = get()

    // Add user message
    addUserMessage(text)

    // Create assistant placeholder
    const assistantId = nextId()
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      text: '',
      isStreaming: true,
      timestamp: Date.now(),
    }
    set((s) => ({
      messages: [...s.messages, assistantMsg],
      isResponding: true,
    }))

    // Build conversation history for API
    const apiMessages: ApiMessage[] = [
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.text,
      })),
      { role: 'user' as const, content: text },
    ]

    const toolUses: ToolUseInfo[] = []

    const update = (patch: Partial<ChatMessage>) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, ...patch } : m
        ),
      }))
    }

    await streamChat(apiMessages, {
      onText: (chunk) => {
        const current = get().messages.find((m) => m.id === assistantId)
        update({ text: (current?.text || '') + chunk })
      },
      onToolUse: (data) => {
        toolUses.push({ id: data.id, name: data.name, input: data.input })
        update({ toolUse: [...toolUses] })
      },
      onToolResult: (data) => {
        const tool = toolUses.find((t) => t.id === data.tool_use_id)
        if (tool) {
          tool.result = data.result
          update({ toolUse: [...toolUses] })
        }
      },
      onDone: () => {
        update({ isStreaming: false })
        set({ isResponding: false })
      },
      onError: (message) => {
        const current = get().messages.find((m) => m.id === assistantId)
        update({
          text: (current?.text || '') + `\n\n_Error: ${message}_`,
          isStreaming: false,
        })
        set({ isResponding: false })
      },
    })
  },

  clearMessages: () => set({ messages: [] }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectedConnector: null,
  selectedCategory: null,
  selectConnector: (connector, category) =>
    set({ selectedConnector: connector, selectedCategory: category }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
