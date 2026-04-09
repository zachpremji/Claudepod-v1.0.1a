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

  if (!isSupported) {
    return null
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      disabled={disabled}
      className={`flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
        isHolding
          ? 'bg-red-600 scale-110'
          : 'bg-gray-700 hover:bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Hold to talk"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
        <path d="M17 11a1 1 0 10-2 0 3 3 0 01-6 0 1 1 0 10-2 0 5 5 0 004 4.9V18H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.1A5 5 0 0017 11z" />
      </svg>
    </button>
  )
}
