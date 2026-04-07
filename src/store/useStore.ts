import { create } from 'zustand'
import type { ChatMessage, Connector } from '../types'

interface Store {
  // Chat
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  updateMessage: (id: string, update: Partial<ChatMessage>) => void
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

export const useStore = create<Store>((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, update) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...update } : m)),
    })),
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
