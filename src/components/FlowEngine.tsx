import { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react'
import type { Flow, Answer } from '../types'
import { serializeFlow, saveFlowExport } from '../export'
import NavBar from './NavBar'
import ProgressBar from './ProgressBar'
import BottomNav from './BottomNav'

const IntroScreen = lazy(() => import('./screens/IntroScreen'))
const MultiSelectScreen = lazy(() => import('./screens/MultiSelectScreen'))
const SingleSelectScreen = lazy(() => import('./screens/SingleSelectScreen'))
const BinaryChoiceScreen = lazy(() => import('./screens/BinaryChoiceScreen'))
const TextInputScreen = lazy(() => import('./screens/TextInputScreen'))
const MultiInputScreen = lazy(() => import('./screens/MultiInputScreen'))
const CheckboxScreen = lazy(() => import('./screens/CheckboxScreen'))
const NumberStepperScreen = lazy(() => import('./screens/NumberStepperScreen'))
const DatePickerScreen = lazy(() => import('./screens/DatePickerScreen'))
const SliderScreen = lazy(() => import('./screens/SliderScreen'))
const RankingScreen = lazy(() => import('./screens/RankingScreen'))
const TagInputScreen = lazy(() => import('./screens/TagInputScreen'))
const ImageSelectScreen = lazy(() => import('./screens/ImageSelectScreen'))

const STORAGE_PREFIX = 'weave-flow-'

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
  } catch {
    // Storage full — silently fail
  }
}

function clearFlowState(flowId: string) {
  localStorage.removeItem(STORAGE_PREFIX + flowId)
}

const COMPLETED_KEY = 'weave-completed-flows'

function markFlowCompleted(flowId: string) {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY)
    const ids: string[] = raw ? JSON.parse(raw) : []
    if (!ids.includes(flowId)) {
      ids.push(flowId)
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(ids))
    }
  } catch {
    // Silently fail
  }
}

function isAnswerValid(type: import('../types').ScreenType, answer: Answer): boolean {
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

export default function FlowEngine({
  flow,
  onExit,
}: {
  flow: Flow
  onExit: () => void
}) {
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
    () =>
      flow.screens
        .map((s, i) => (!s.isSubScreen ? i : -1))
        .filter((i) => i >= 0),
    [flow.screens],
  )

  const mainStep = useMemo(() => {
    if (flow.screens[currentIndex]?.isSubScreen) {
      // Show same step as preceding main screen
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

  const showUndo = useCallback(
    (fromIndex: number) => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
      setUndoIndex(fromIndex)
      undoTimer.current = setTimeout(() => setUndoIndex(null), 3000)
    },
    [],
  )

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
          if (rule.values.includes(ansStr)) {
            return rule.targetIndex
          }
        }
      }
      return fromIndex + 1
    },
    [flow.screens],
  )

  const handleNext = useCallback(() => {
    const answer = answers[currentIndex] ?? null
    const nextIdx = getNextIndex(currentIndex, answer)
    navigate(nextIdx)
  }, [currentIndex, answers, getNextIndex, navigate])

  const handleSkip = useCallback(() => {
    // When skipping, jump past any following sub-screens
    let nextIdx = currentIndex + 1
    while (nextIdx < flow.screens.length && flow.screens[nextIdx].isSubScreen) {
      nextIdx++
    }
    navigate(nextIdx)
  }, [currentIndex, flow.screens, navigate])

  const handleBack = useCallback(() => {
    if (currentIndex === 0) {
      onExit()
      return
    }
    setUndoIndex(null)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setDirection('back')
    setAnimKey((k) => k + 1)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [currentIndex, onExit])

  const handleChange = useCallback(
    (v: Answer) => {
      setAnswers((prev) => ({ ...prev, [currentIndex]: v }))
    },
    [currentIndex],
  )

  const currentAnswer = answers[currentIndex] ?? null
  const canAdvance = isAnswerValid(screen.type, currentAnswer)

  // Keyboard navigation — refs avoid stale closures, effect stays stable
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

  // Focus first interactive element on screen transition
  const screenRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const focusable = el.querySelector<HTMLElement>(
      'input, textarea, button:not(.nav-back):not(.btn-done):not(.btn-skip):not(.btn-next)',
    )
    if (focusable) {
      requestAnimationFrame(() => focusable.focus())
    }
  }, [animKey])

  if (completed) {
    return (
      <div className="app">
        <NavBar title={flow.category} onBack={onExit} />
        <div className="screen-card">
          <div className="completion">
            <div className="completion-icon">✨</div>
            <h1 className="completion-title">All done!</h1>
            <p className="completion-desc">
              You've completed the {flow.title} flow. Your memories have been
              saved.
            </p>
            <button className="completion-btn" onClick={onExit} type="button">
              Back to flows
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isIntro = screen.type === 'intro'

  return (
    <div className="app">
      <NavBar title={flow.category} onBack={handleBack} />
      <div className="screen-card" key={animKey}>
        <div className={`screen screen--${direction}`} ref={screenRef}>
          <ProgressBar current={mainStep} total={totalMain} />
          <div className="screen-content" aria-live="polite">
            <Suspense fallback={<div className="screen-spinner" />}>
              <ScreenRenderer
                screen={screen}
                flowId={flow.id}
                value={currentAnswer}
                onChange={handleChange}
              />
            </Suspense>
          </div>
          <BottomNav
            showSkip={!isIntro}
            disabled={!canAdvance}
            onDone={onExit}
            onSkip={handleSkip}
            onNext={handleNext}
          />
        </div>
      </div>
      {undoIndex !== null && (
        <button className="undo-toast" onClick={handleUndo} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Undo
        </button>
      )}
    </div>
  )
}

function ScreenRenderer({
  screen,
  flowId,
  value,
  onChange,
}: {
  screen: import('../types').FlowScreen
  flowId: string
  value: Answer
  onChange: (v: Answer) => void
}) {
  switch (screen.type) {
    case 'intro':
      return <IntroScreen screen={screen} flowId={flowId} />
    case 'multi-select':
      return <MultiSelectScreen screen={screen} value={value} onChange={onChange} />
    case 'single-select':
      return <SingleSelectScreen screen={screen} value={value} onChange={onChange} />
    case 'binary-choice':
      return <BinaryChoiceScreen screen={screen} value={value} onChange={onChange} />
    case 'text-input':
      return <TextInputScreen screen={screen} value={value} onChange={onChange} />
    case 'multi-input':
      return <MultiInputScreen screen={screen} value={value} onChange={onChange} />
    case 'checkbox':
      return <CheckboxScreen screen={screen} value={value} onChange={onChange} />
    case 'number-stepper':
      return <NumberStepperScreen screen={screen} value={value} onChange={onChange} />
    case 'date-picker':
      return <DatePickerScreen screen={screen} value={value} onChange={onChange} />
    case 'slider':
      return <SliderScreen screen={screen} value={value} onChange={onChange} />
    case 'ranking':
      return <RankingScreen screen={screen} value={value} onChange={onChange} />
    case 'tag-input':
      return <TagInputScreen screen={screen} value={value} onChange={onChange} />
    case 'image-select':
      return <ImageSelectScreen screen={screen} value={value} onChange={onChange} />
  }
}
