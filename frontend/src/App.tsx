import { useState, useCallback, useEffect } from 'react'
import Orb from './components/Orb'
import Transcript from './components/Transcript'
import TextInput from './components/TextInput'
import PushToTalkButton from './components/PushToTalkButton'
import Settings from './components/Settings'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { sendMessage, synthesizeSpeech, getAuthStatus } from './api/client'
import { OrbState, Message, AuthStatus } from './types'

export default function App() {
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null)

  const { start: startRecognition, stop: stopRecognition, isSupported } = useSpeechRecognition()
  const { play: playAudio } = useAudioPlayer()

  const fetchAuthStatus = useCallback(async () => {
    try {
      const status = await getAuthStatus()
      setAuthStatus(status)
    } catch {
      // Backend might not be running
    }
  }, [])

  useEffect(() => {
    fetchAuthStatus()

    // Check for OAuth callback
    const params = new URLSearchParams(window.location.search)
    const authResult = params.get('auth')
    if (authResult === 'success') {
      fetchAuthStatus()
      window.history.replaceState({}, '', '/')
    } else if (authResult === 'error') {
      window.history.replaceState({}, '', '/')
    }
  }, [fetchAuthStatus])

  const handleSendMessage = useCallback(
    async (text: string, toolCall?: object) => {
      if (isProcessing && !toolCall) return

      setIsProcessing(true)
      setOrbState('thinking')

      const userMsg: Message = {
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])

      try {
        const payload: { message: string; pending_tool_call?: object } = { message: text }
        if (toolCall) payload.pending_tool_call = toolCall

        const response = await sendMessage(payload)

        const assistantMsg: Message = {
          role: 'assistant',
          content: response.reply,
          toolsUsed: response.tools_used,
          timestamp: new Date().toISOString(),
        }

        if (response.confirmation_required) {
          assistantMsg.confirmationRequired = response.confirmation_required
        }

        setMessages((prev) => [...prev, assistantMsg])

        // TTS
        setOrbState('speaking')
        try {
          const audioBlob = await synthesizeSpeech(response.reply)
          await playAudio(audioBlob)
        } catch {
          console.warn('TTS failed, falling back to browser speech')
          const utterance = new SpeechSynthesisUtterance(response.reply)
          await new Promise<void>((resolve) => {
            utterance.onend = () => resolve()
            utterance.onerror = () => resolve()
            window.speechSynthesis.speak(utterance)
          })
        }
      } catch (err) {
        console.error('Chat error:', err)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setOrbState('idle')
        setIsProcessing(false)
      }
    },
    [isProcessing, playAudio]
  )

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (text.trim()) handleSendMessage(text)
    },
    [handleSendMessage]
  )

  const handleConfirm = useCallback(
    (toolCall: object) => handleSendMessage('Yes, go ahead', toolCall),
    [handleSendMessage]
  )

  const handleDecline = useCallback(
    () => handleSendMessage('No, cancel'),
    [handleSendMessage]
  )

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">Claude Pod</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection indicator */}
          {authStatus && (
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  authStatus.anthropic.connected ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
              <span className="text-[11px] text-gray-500">
                {authStatus.anthropic.connected ? 'Ready' : 'No API key'}
              </span>
            </div>
          )}

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-gray-700 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Orb zone */}
      <div className="flex-1 flex items-center justify-center min-h-0" style={{ flexBasis: '50%' }}>
        <Orb state={isProcessing && orbState === 'idle' ? 'thinking' : orbState} />
      </div>

      {/* Transcript + Input zone */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-white/[0.04]" style={{ flexBasis: '50%' }}>
        <Transcript
          messages={messages}
          onConfirm={handleConfirm}
          onDecline={handleDecline}
        />

        {/* Input bar */}
        <div className="shrink-0 px-4 py-3 bg-gray-950/80 backdrop-blur-xl border-t border-white/[0.04] flex items-center gap-2">
          <TextInput onSend={(text) => handleSendMessage(text)} disabled={isProcessing} />
          <PushToTalkButton
            onTranscript={handleVoiceTranscript}
            isSupported={isSupported}
            startRecognition={startRecognition}
            stopRecognition={stopRecognition}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Settings Panel */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        authStatus={authStatus}
        onRefreshAuth={fetchAuthStatus}
      />
    </div>
  )
}
