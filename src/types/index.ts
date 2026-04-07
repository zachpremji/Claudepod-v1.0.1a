export type NodeType = 'user' | 'think' | 'extract' | 'api' | 'output'

export interface ChainNode {
  label: string
  sub: string
  type: NodeType
}

export interface Chain {
  action: string
  nodes: ChainNode[]
}

export interface Connector {
  name: string
  type: 'mcp' | 'platform'
  actions: string[]
  chains: Record<string, ChainNode[]>
}

export interface Category {
  name: string
  emoji: string
  color: string
  connectors: Connector[]
}

export interface QuickPrompt {
  tag: string
  text: string
  chain: ChainNode[]
}

export interface TraceState {
  visible: boolean
  connectorName: string
  chain: ChainNode[]
  status: 'idle' | 'running' | 'complete'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  connectorName?: string
  chain?: ChainNode[]
  status?: 'running' | 'complete'
  timestamp: number
}
