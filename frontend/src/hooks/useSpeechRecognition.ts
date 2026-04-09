import { useRef, useCallback } from 'react'

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

export function useSpeechRecognition() {
  const recognitionRef = useRef<any>(null)

  const isSupported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  const start = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        resolve(transcript)
      }

      recognition.onerror = (event: any) => {
        reject(new Error(event.error))
      }

      recognition.onend = () => {
        // If no result was captured, resolve with empty string
        // The promise might already be resolved by onresult
      }

      recognitionRef.current = recognition
      recognition.start()
    })
  }, [isSupported])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [])

  return { start, stop, isSupported }
}
