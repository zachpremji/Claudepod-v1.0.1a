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
}

export interface TraceState {
  visible: boolean
  connectorName: string
  chain: ChainNode[]
  status: 'idle' | 'running' | 'complete'
}

// Tool use info displayed in chat
export interface ToolUseInfo {
  id: string
  name: string
  input: Record<string, unknown>
  result?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  toolUse?: ToolUseInfo[]
  isStreaming?: boolean
  timestamp: number
}
