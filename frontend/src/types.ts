export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  toolsUsed?: string[]
  timestamp: string
  confirmationRequired?: {
    action: string
    tool_call: object
  }
}

export interface ChatResponse {
  reply: string
  tools_used: string[]
  confirmation_required?: {
    action: string
    tool_call: object
  }
}

export interface AuthStatus {
  google: { connected: boolean; available: boolean }
  elevenlabs: { connected: boolean }
  anthropic: { connected: boolean }
}
