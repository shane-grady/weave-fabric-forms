import { useState, useCallback, useEffect } from 'react'
import type { Answer } from '../types'

const STORAGE_PREFIX = 'weave-flow-'

interface PersistedState {
  answers: Record<number, Answer>
  currentIndex: number
}

function loadState(flowId: string): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + flowId)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

function saveState(flowId: string, state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + flowId, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — silently degrade
  }
}

export function clearFlowState(flowId: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + flowId)
  } catch {
    // Ignore
  }
}

export function usePersistedAnswers(flowId: string) {
  const saved = loadState(flowId)

  const [answers, setAnswersRaw] = useState<Record<number, Answer>>(
    () => saved?.answers ?? {},
  )
  const [currentIndex, setCurrentIndexRaw] = useState(
    () => saved?.currentIndex ?? 0,
  )

  // Persist whenever answers or currentIndex change
  useEffect(() => {
    saveState(flowId, { answers, currentIndex })
  }, [flowId, answers, currentIndex])

  const setAnswers = useCallback(
    (updater: (prev: Record<number, Answer>) => Record<number, Answer>) => {
      setAnswersRaw(updater)
    },
    [],
  )

  const setCurrentIndex = useCallback((index: number | ((prev: number) => number)) => {
    setCurrentIndexRaw(index)
  }, [])

  return { answers, currentIndex, setAnswers, setCurrentIndex }
}
