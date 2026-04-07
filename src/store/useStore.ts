import { create } from 'zustand'
import type { ChainNode, Connector, TraceState } from '../types'

interface Store {
  activeTab: 'cmd' | 'ref'
  setActiveTab: (tab: 'cmd' | 'ref') => void

  selectedConnector: Connector | null
  selectedCategory: string | null
  selectConnector: (connector: Connector, category: string) => void

  trace: TraceState
  runTrace: (connectorName: string, chain: ChainNode[]) => void
  clearTrace: () => void

  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useStore = create<Store>((set) => ({
  activeTab: 'cmd',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedConnector: null,
  selectedCategory: null,
  selectConnector: (connector, category) =>
    set({ selectedConnector: connector, selectedCategory: category, activeTab: 'ref' }),

  trace: {
    visible: false,
    connectorName: '',
    chain: [],
    status: 'idle',
  },
  runTrace: (connectorName, chain) =>
    set({
      activeTab: 'cmd',
      trace: { visible: true, connectorName, chain, status: 'running' },
    }),
  clearTrace: () =>
    set({
      trace: { visible: false, connectorName: '', chain: [], status: 'idle' },
    }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
