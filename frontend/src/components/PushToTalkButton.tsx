import { useState, useCallback } from 'react'

interface PushToTalkButtonProps {
  onTranscript: (text: string) => void
  isSupported: boolean
  startRecognition: () => Promise<string>
  stopRecognition: () => void
  disabled?: boolean
}

export default function PushToTalkButton({
  onTranscript,
  isSupported,
  startRecognition,
  stopRecognition,
  disabled,
}: PushToTalkButtonProps) {
  const [isHolding, setIsHolding] = useState(false)

  const handlePointerDown = useCallback(async () => {
    if (!isSupported || disabled) return
    setIsHolding(true)
    try {
      const transcript = await startRecognition()
      if (transcript.trim()) {
        onTranscript(transcript)
      }
    } catch {
      // Recognition failed or was cancelled
    } finally {
      setIsHolding(false)
    }
  }, [isSupported, disabled, startRecognition, onTranscript])

  const handlePointerUp = useCallback(() => {
    if (isHolding) {
      stopRecognition()
    }
  }, [isHolding, stopRecognition])

  if (!isSupported) return null

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      disabled={disabled}
      className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 ${
        isHolding
          ? 'bg-red-500 shadow-lg shadow-red-500/25'
          : 'bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      title="Hold to talk"
    >
      {isHolding && (
        <span className="absolute inset-0 rounded-xl animate-ping bg-red-500/30" />
      )}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-10">
        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
      </svg>
    </button>
  )
}
