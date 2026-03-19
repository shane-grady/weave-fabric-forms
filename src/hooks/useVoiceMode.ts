import { useState, useCallback, useEffect, useRef } from 'react'
import type { ScreenType, FlowScreen, Answer } from '../types'
import useSpeechRecognition from './useSpeechRecognition'

const VOICE_TEXT_SCREENS = new Set<ScreenType>(['text-input', 'multi-input', 'tag-input'])
const VOICE_SELECT_SCREENS = new Set<ScreenType>([
  'single-select',
  'multi-select',
  'binary-choice',
  'checkbox',
])
const VOICE_ACTIVE_SCREENS = new Set<ScreenType>([
  'intro',
  ...VOICE_TEXT_SCREENS,
  ...VOICE_SELECT_SCREENS,
])

const YES_WORDS = ['yes', 'yeah', 'yep', 'sure', 'yup', 'absolutely', 'definitely']
const NO_WORDS = ['no', 'nope', 'nah', 'never', 'not really']

function matchOption(spoken: string, options: string[]): string | null {
  const lower = spoken.toLowerCase().trim()
  if (!lower) return null
  // Exact match first
  const exact = options.find((o) => o.toLowerCase() === lower)
  if (exact) return exact
  // Substring match (spoken contains option or option contains spoken)
  return (
    options.find(
      (o) => lower.includes(o.toLowerCase()) || o.toLowerCase().includes(lower),
    ) ?? null
  )
}

export interface UseVoiceModeReturn {
  isSupported: boolean
  isEnabled: boolean
  isListening: boolean
  error: string | null
  toggleVoiceMode: () => void
  interimTranscript: string
  setFocusedFieldIndex: (index: number) => void
}

export default function useVoiceMode({
  screenType,
  currentIndex,
  onChange,
  currentAnswer,
  screen,
  onNext,
}: {
  screenType: ScreenType
  currentIndex: number
  onChange: (v: Answer) => void
  currentAnswer: Answer
  screen: FlowScreen
  onNext: () => void
}): UseVoiceModeReturn {
  const speech = useSpeechRecognition()
  const [isEnabled, setIsEnabled] = useState(false)
  const [focusedFieldIndex, setFocusedFieldIndex] = useState(0)

  // Stable refs for callbacks/values used inside effects
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const onNextRef = useRef(onNext)
  onNextRef.current = onNext
  const currentAnswerRef = useRef(currentAnswer)
  currentAnswerRef.current = currentAnswer
  const screenRef = useRef(screen)
  screenRef.current = screen
  const focusedFieldRef = useRef(focusedFieldIndex)
  focusedFieldRef.current = focusedFieldIndex

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevTagTranscriptRef = useRef('')
  const prevSelectTranscriptRef = useRef('')
  const screenIndexRef = useRef(currentIndex)

  // Clean up auto-advance on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    }
  }, [])

  // Disable voice if mic permission denied
  useEffect(() => {
    if (speech.error === 'not-allowed') {
      setIsEnabled(false)
    }
  }, [speech.error])

  // Start/stop recognition on screen transitions and voice toggle
  useEffect(() => {
    if (!isEnabled) {
      speech.stop()
      return
    }

    // Reset state on screen change
    if (screenIndexRef.current !== currentIndex) {
      screenIndexRef.current = currentIndex
      prevTagTranscriptRef.current = ''
      prevSelectTranscriptRef.current = ''
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current)
        autoAdvanceTimer.current = null
      }
    }

    if (VOICE_ACTIVE_SCREENS.has(screenType)) {
      // Stop and restart for a fresh session
      speech.stop()
      speech.resetTranscript()
      const timer = setTimeout(() => speech.start(), 120)
      return () => clearTimeout(timer)
    } else {
      speech.stop()
    }
  }, [isEnabled, screenType, currentIndex])

  // Text screen: push transcript into answer in real-time
  useEffect(() => {
    if (!isEnabled || !VOICE_TEXT_SCREENS.has(screenType)) return
    if (!speech.transcript && !speech.interimTranscript) return

    const fullText = (
      speech.transcript +
      (speech.interimTranscript ? ' ' + speech.interimTranscript : '')
    ).trim()
    if (!fullText) return

    if (screenType === 'text-input') {
      onChangeRef.current(fullText)
    } else if (screenType === 'multi-input') {
      const current = currentAnswerRef.current
      const arr = Array.isArray(current)
        ? [...(current as string[])]
        : screenRef.current.fields?.map(() => '') ?? []
      arr[focusedFieldRef.current] = fullText
      onChangeRef.current(arr)
    }
  }, [speech.transcript, speech.interimTranscript, isEnabled, screenType])

  // Tag input: add final results as tags
  useEffect(() => {
    if (!isEnabled || screenType !== 'tag-input') return
    if (!speech.transcript || speech.transcript === prevTagTranscriptRef.current) return

    const delta = speech.transcript
      .slice(prevTagTranscriptRef.current.length)
      .trim()
    prevTagTranscriptRef.current = speech.transcript
    if (!delta) return

    const existing = Array.isArray(currentAnswerRef.current)
      ? (currentAnswerRef.current as string[])
      : []
    const newTags = delta
      .split(/[,.]/)
      .map((t) => t.trim())
      .filter((t) => t && !existing.includes(t))
    if (newTags.length > 0) {
      onChangeRef.current([...existing, ...newTags])
    }
  }, [speech.transcript, isEnabled, screenType])

  // Selection screens: match spoken text to options
  useEffect(() => {
    if (!isEnabled || !VOICE_SELECT_SCREENS.has(screenType)) return
    if (!speech.transcript || speech.transcript === prevSelectTranscriptRef.current)
      return

    const delta = speech.transcript
      .slice(prevSelectTranscriptRef.current.length)
      .trim()
      .toLowerCase()
    prevSelectTranscriptRef.current = speech.transcript
    if (!delta) return

    if (screenType === 'binary-choice') {
      let matched: string | null = null
      if (YES_WORDS.some((w) => delta.includes(w))) matched = 'yes'
      else if (NO_WORDS.some((w) => delta.includes(w))) matched = 'no'

      if (matched) {
        onChangeRef.current(matched)
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
        autoAdvanceTimer.current = setTimeout(() => {
          if (screenIndexRef.current === currentIndex) {
            onNextRef.current()
          }
        }, 1000)
      }
    } else if (screenType === 'single-select') {
      const match = matchOption(delta, screenRef.current.options ?? [])
      if (match) {
        onChangeRef.current(match)
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
        autoAdvanceTimer.current = setTimeout(() => {
          if (screenIndexRef.current === currentIndex) {
            onNextRef.current()
          }
        }, 1000)
      }
    } else if (screenType === 'multi-select' || screenType === 'checkbox') {
      const match = matchOption(delta, screenRef.current.options ?? [])
      if (match) {
        const arr = Array.isArray(currentAnswerRef.current)
          ? (currentAnswerRef.current as string[])
          : []
        if (arr.includes(match)) {
          onChangeRef.current(arr.filter((v) => v !== match))
        } else {
          onChangeRef.current([...arr, match])
        }
      }
    }
  }, [speech.transcript, isEnabled, screenType, currentIndex])

  // Reset focused field on screen change
  useEffect(() => {
    setFocusedFieldIndex(0)
  }, [currentIndex])

  // Restart recognition on field focus change (multi-input)
  useEffect(() => {
    if (screenType !== 'multi-input' || !isEnabled) return
    speech.stop()
    speech.resetTranscript()
    const timer = setTimeout(() => speech.start(), 120)
    return () => clearTimeout(timer)
  }, [focusedFieldIndex])

  const toggleVoiceMode = useCallback(() => {
    setIsEnabled((prev) => {
      if (!prev) {
        // Start to trigger mic permission prompt
        speech.start()
        return true
      } else {
        speech.stop()
        speech.resetTranscript()
        return false
      }
    })
  }, [speech])

  return {
    isSupported: speech.isSupported,
    isEnabled,
    isListening: speech.isListening,
    error: speech.error,
    toggleVoiceMode,
    interimTranscript: speech.interimTranscript,
    setFocusedFieldIndex,
  }
}
