import { useState, useCallback } from 'react'
import Orb from './components/Orb'
import Transcript from './components/Transcript'
import TextInput from './components/TextInput'
import PushToTalkButton from './components/PushToTalkButton'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { sendMessage, synthesizeSpeech } from './api/client'
import { OrbState, Message } from './types'

export default function App() {
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingToolCall, setPendingToolCall] = useState<object | null>(null)

  const { start: startRecognition, stop: stopRecognition, isSupported } = useSpeechRecognition()
  const { play: playAudio } = useAudioPlayer()

  const handleSendMessage = useCallback(
    async (text: string, toolCall?: object) => {
      if (isProcessing && !toolCall) return

      setIsProcessing(true)
      setOrbState('thinking')

      // Add user message
      const userMsg: Message = {
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])

      try {
        const payload: { message: string; pending_tool_call?: object } = {
          message: text,
        }
        if (toolCall) {
          payload.pending_tool_call = toolCall
        }

        const response = await sendMessage(payload)

        const assistantMsg: Message = {
          role: 'assistant',
          content: response.reply,
          toolsUsed: response.tools_used,
          timestamp: new Date().toISOString(),
        }

        if (response.confirmation_required) {
          assistantMsg.confirmationRequired = response.confirmation_required
          setPendingToolCall(response.confirmation_required.tool_call)
        }

        setMessages((prev) => [...prev, assistantMsg])

        // Speak the response
        setOrbState('speaking')
        try {
          const audioBlob = await synthesizeSpeech(response.reply)
          await playAudio(audioBlob)
        } catch {
          // ElevenLabs failed — fallback to browser TTS
          console.warn('ElevenLabs TTS failed, falling back to browser speech synthesis')
          const utterance = new SpeechSynthesisUtterance(response.reply)
          await new Promise<void>((resolve) => {
            utterance.onend = () => resolve()
            utterance.onerror = () => resolve()
            window.speechSynthesis.speak(utterance)
          })
        }
      } catch (err) {
        console.error('Chat error:', err)
        const errorMsg: Message = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setOrbState('idle')
        setIsProcessing(false)
      }
    },
    [isProcessing, playAudio]
  )

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (!text.trim()) return
      handleSendMessage(text)
    },
    [handleSendMessage]
  )

  const handleConfirm = useCallback(
    (toolCall: object) => {
      setPendingToolCall(null)
      handleSendMessage('Yes, go ahead', toolCall)
    },
    [handleSendMessage]
  )

  const handleDecline = useCallback(() => {
    setPendingToolCall(null)
    handleSendMessage('No, cancel')
  }, [handleSendMessage])

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white">
      {/* Orb zone */}
      <div className="h-[55vh] flex items-center justify-center shrink-0">
        <Orb state={isProcessing && orbState === 'idle' ? 'thinking' : orbState} />
      </div>

      {/* Transcript + Input zone */}
      <div className="h-[45vh] flex flex-col border-t border-gray-800">
        <Transcript
          messages={messages}
          onConfirm={handleConfirm}
          onDecline={handleDecline}
        />

        {/* Input bar */}
        <div className="shrink-0 px-4 py-3 bg-gray-900 border-t border-gray-800 flex items-center gap-2">
          <div className="flex-1">
            <TextInput onSend={(text) => handleSendMessage(text)} disabled={isProcessing} />
          </div>
          <PushToTalkButton
            onTranscript={handleVoiceTranscript}
            isSupported={isSupported}
            startRecognition={startRecognition}
            stopRecognition={stopRecognition}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  )
}
