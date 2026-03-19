import { useState, useRef, useCallback, useEffect } from 'react'

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export interface UseSpeechRecognitionReturn {
  isSupported: boolean
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  start: () => void
  stop: () => void
  resetTranscript: () => void
}

export default function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    if (!SpeechRecognitionAPI) return

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      finalTranscriptRef.current = finalText
      setTranscript(finalText)
      setInterimTranscript(interimText)
    }

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('not-allowed')
        isListeningRef.current = false
        setIsListening(false)
      } else if (event.error === 'no-speech') {
        // Silence — not a real error, recognition will restart via onend
      } else if (event.error !== 'aborted') {
        setError(event.error)
      }
    }

    recognition.onend = () => {
      // Auto-restart if we're still supposed to be listening
      // Safari and some browsers stop after pauses
      if (isListeningRef.current) {
        try {
          recognition.start()
        } catch {
          // Already started or other issue — ignore
        }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition

    return () => {
      isListeningRef.current = false
      try {
        recognition.stop()
      } catch {
        // Not started — ignore
      }
    }
  }, [])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    setError(null)
    isListeningRef.current = true
    setIsListening(true)
    try {
      recognitionRef.current.start()
    } catch {
      // Already started — ignore
    }
  }, [])

  const stop = useCallback(() => {
    isListeningRef.current = false
    setIsListening(false)
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      // Not started — ignore
    }
  }, [])

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = ''
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isSupported: !!SpeechRecognitionAPI,
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    resetTranscript,
  }
}
