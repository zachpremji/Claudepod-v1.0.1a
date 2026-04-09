import { useRef, useCallback } from 'react'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback((blob: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        URL.revokeObjectURL(url)
        audioRef.current = null
        resolve()
      }

      audio.onerror = () => {
        URL.revokeObjectURL(url)
        audioRef.current = null
        reject(new Error('Audio playback failed'))
      }

      audio.play().catch(reject)
    })
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  return { play, stop }
}
