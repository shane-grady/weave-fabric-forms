import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { Flow, FlowScreen, Answer, ScreenType } from '../types'
import { serializeFlow, saveFlowExport } from '../export'
import { haptic } from '../haptic'

const STORAGE_PREFIX = 'weave-flow-'
const COMPLETED_KEY = 'weave-completed-flows'

interface SavedFlowState {
  answers: Record<number, Answer>
  currentIndex: number
}

function loadFlowState(flowId: string): SavedFlowState | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + flowId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveFlowState(flowId: string, state: SavedFlowState) {
  try {
    localStorage.setItem(STORAGE_PREFIX + flowId, JSON.stringify(state))
  } catch {}
}

function clearFlowState(flowId: string) {
  localStorage.removeItem(STORAGE_PREFIX + flowId)
}

function markFlowCompleted(flowId: string) {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY)
    const ids: string[] = raw ? JSON.parse(raw) : []
    if (!ids.includes(flowId)) {
      ids.push(flowId)
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(ids))
    }
  } catch {}
}

function isAnswerValid(type: ScreenType, answer: Answer): boolean {
  switch (type) {
    case 'intro':
    case 'number-stepper':
    case 'slider':
    case 'ranking':
      return true
    case 'text-input':
      return typeof answer === 'string' && answer.trim().length > 0
    case 'multi-input':
      return Array.isArray(answer) && answer.some((v) => typeof v === 'string' && v.trim().length > 0)
    case 'multi-select':
    case 'checkbox':
    case 'tag-input':
    case 'image-select':
      return Array.isArray(answer) && answer.length > 0
    case 'single-select':
    case 'binary-choice':
      return answer != null && answer !== ''
    case 'date-picker':
      return typeof answer === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(answer)
  }
}

export default function useFlowNavigation(flow: Flow, onExit: () => void) {
  const saved = useMemo(() => loadFlowState(flow.id), [flow.id])
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex ?? 0)
  const [answers, setAnswers] = useState<Record<number, Answer>>(saved?.answers ?? {})
  const [completed, setCompleted] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [undoIndex, setUndoIndex] = useState<number | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!completed) {
      saveFlowState(flow.id, { answers, currentIndex })
    }
  }, [flow.id, answers, currentIndex, completed])

  const screen = flow.screens[currentIndex]

  const mainIndices = useMemo(
    () => flow.screens.map((s, i) => (!s.isSubScreen ? i : -1)).filter((i) => i >= 0),
    [flow.screens],
  )

  const mainStep = useMemo(() => {
    if (flow.screens[currentIndex]?.isSubScreen) {
      let step = 0
      for (const idx of mainIndices) {
        if (idx >= currentIndex) break
        step++
      }
      return step
    }
    let step = 0
    for (const idx of mainIndices) {
      step++
      if (idx >= currentIndex) break
    }
    return step
  }, [currentIndex, mainIndices, flow.screens])

  const totalMain = mainIndices.length

  const showUndo = useCallback((fromIndex: number) => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setUndoIndex(fromIndex)
    undoTimer.current = setTimeout(() => setUndoIndex(null), 3000)
  }, [])

  const handleUndo = useCallback(() => {
    if (undoIndex === null) return
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setDirection('back')
    setAnimKey((k) => k + 1)
    setCurrentIndex(undoIndex)
    setUndoIndex(null)
  }, [undoIndex])

  const navigate = useCallback(
    (targetIndex: number) => {
      haptic()
      const fromIdx = currentIndex
      setDirection('forward')
      setAnimKey((k) => k + 1)
      if (targetIndex >= flow.screens.length) {
        clearFlowState(flow.id)
        markFlowCompleted(flow.id)
        saveFlowExport(serializeFlow(flow, answers))
        setCompleted(true)
      } else {
        setCurrentIndex(targetIndex)
        if (flow.screens[fromIdx].type !== 'intro') {
          showUndo(fromIdx)
        }
      }
    },
    [flow, answers, currentIndex, showUndo],
  )

  const getNextIndex = useCallback(
    (fromIndex: number, answer: Answer): number => {
      const s = flow.screens[fromIndex]
      if (s.skipRules) {
        const ansStr = typeof answer === 'string' ? answer : ''
        for (const rule of s.skipRules) {
          if (rule.values.includes(ansStr)) return rule.targetIndex
        }
      }
      return fromIndex + 1
    },
    [flow.screens],
  )

  const handleNext = useCallback(() => {
    const answer = answers[currentIndex] ?? null
    navigate(getNextIndex(currentIndex, answer))
  }, [currentIndex, answers, getNextIndex, navigate])

  const handleSkip = useCallback(() => {
    let nextIdx = currentIndex + 1
    while (nextIdx < flow.screens.length && flow.screens[nextIdx].isSubScreen) nextIdx++
    navigate(nextIdx)
  }, [currentIndex, flow.screens, navigate])

  const handleBack = useCallback(() => {
    if (currentIndex === 0) { onExit(); return }
    haptic()
    setUndoIndex(null)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setDirection('back')
    setAnimKey((k) => k + 1)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [currentIndex, onExit])

  const handleChange = useCallback(
    (v: Answer) => setAnswers((prev) => ({ ...prev, [currentIndex]: v })),
    [currentIndex],
  )

  const currentAnswer = answers[currentIndex] ?? null
  const canAdvance = isAnswerValid(screen.type, currentAnswer)

  // Keyboard navigation
  const nextRef = useRef(handleNext)
  const backRef = useRef(handleBack)
  const canAdvanceRef = useRef(canAdvance)
  nextRef.current = handleNext
  backRef.current = handleBack
  canAdvanceRef.current = canAdvance

  useEffect(() => {
    if (completed) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return
        if (!canAdvanceRef.current) return
        e.preventDefault()
        nextRef.current()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        backRef.current()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [completed])

  return {
    screen,
    currentIndex,
    currentAnswer,
    answers,
    completed,
    animKey,
    direction,
    canAdvance,
    undoIndex,
    mainStep,
    totalMain,
    handleNext,
    handleSkip,
    handleBack,
    handleChange,
    handleUndo,
  }
}
