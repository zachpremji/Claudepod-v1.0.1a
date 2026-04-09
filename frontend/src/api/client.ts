import { ChatResponse, AuthStatus } from '../types'

const BASE = 'http://localhost:8000'

export async function sendMessage(payload: {
  message: string
  pending_tool_call?: object
}): Promise<ChatResponse> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Chat request failed: ${detail}`)
  }
  return res.json()
}

export async function synthesizeSpeech(text: string): Promise<Blob> {
  const res = await fetch(`${BASE}/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) {
    throw new Error('Speech synthesis failed')
  }
  return res.blob()
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const res = await fetch(`${BASE}/auth/status`)
  if (!res.ok) throw new Error('Failed to fetch auth status')
  return res.json()
}

export function getGoogleAuthUrl(): string {
  return `${BASE}/auth/google/start`
}

export async function disconnectGoogle(): Promise<void> {
  const res = await fetch(`${BASE}/auth/google/disconnect`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to disconnect')
}
