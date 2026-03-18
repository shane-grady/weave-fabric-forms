import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { Flow, Answer } from '../types'
import { serializeFlow, saveFlowExport } from '../export'
import IntroScreen from './screens/IntroScreen'
import MultiSelectScreen from './screens/MultiSelectScreen'
import SingleSelectScreen from './screens/SingleSelectScreen'
import BinaryChoiceScreen from './screens/BinaryChoiceScreen'
import TextInputScreen from './screens/TextInputScreen'
import MultiInputScreen from './screens/MultiInputScreen'
import CheckboxScreen from './screens/CheckboxScreen'
import NumberStepperScreen from './screens/NumberStepperScreen'
import DatePickerScreen from './screens/DatePickerScreen'
import SliderScreen from './screens/SliderScreen'

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
      return true
    case 'text-input':
      return typeof answer === 'string' && answer.trim().length > 0
    case 'multi-input':
      return Array.isArray(answer) && answer.some((v) => typeof v === 'string' && v.trim().length > 0)
    case 'multi-select':
    case 'checkbox':
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

  const navigate = useCallback(
    (targetIndex: number) => {
      setAnimKey((k) => k + 1)
      if (targetIndex >= flow.screens.length) {
        clearFlowState(flow.id)
        markFlowCompleted(flow.id)
        saveFlowExport(serializeFlow(flow, answers))
        setCompleted(true)
      } else {
        setCurrentIndex(targetIndex)
      }
    },
    [flow, answers],
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
        <div className="screen" ref={screenRef} style={{ animation: 'screenIn 0.25s ease-out' }}>
          <ProgressBar current={mainStep} total={totalMain} />
          <div className="screen-content">
            <ScreenRenderer
              screen={screen}
              flowId={flow.id}
              value={currentAnswer}
              onChange={handleChange}
            />
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
    </div>
  )
}

function NavBar({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="nav-bar">
      <button className="nav-back" onClick={onBack} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span className="nav-title">{title}</span>
    </div>
  )
}

function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="progress-bar">
      <div className="progress-segments">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-segment ${
              i < current ? 'progress-segment--filled' : 'progress-segment--empty'
            }`}
          />
        ))}
      </div>
      <span className="progress-label">
        {current}/{total}
      </span>
    </div>
  )
}

function BottomNav({
  showSkip,
  disabled,
  onDone,
  onSkip,
  onNext,
}: {
  showSkip: boolean
  disabled: boolean
  onDone: () => void
  onSkip: () => void
  onNext: () => void
}) {
  return (
    <div className="bottom-nav">
      <button className="btn btn-done" onClick={onDone} type="button">
        Done
      </button>
      {showSkip && (
        <button className="btn btn-skip" onClick={onSkip} type="button">
          Skip
        </button>
      )}
      <button
        className={`btn btn-next ${disabled ? 'btn-next--disabled' : ''}`}
        onClick={disabled ? undefined : onNext}
        type="button"
        aria-disabled={disabled}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        Next
      </button>
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
  }
}
