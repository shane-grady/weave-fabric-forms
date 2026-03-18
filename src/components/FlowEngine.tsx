import { useState, useCallback, useMemo } from 'react'
import type { Flow, Answer } from '../types'
import { usePersistedAnswers, clearFlowState } from '../hooks/usePersistedAnswers'
import IntroScreen from './screens/IntroScreen'
import MultiSelectScreen from './screens/MultiSelectScreen'
import SingleSelectScreen from './screens/SingleSelectScreen'
import BinaryChoiceScreen from './screens/BinaryChoiceScreen'
import TextInputScreen from './screens/TextInputScreen'
import MultiInputScreen from './screens/MultiInputScreen'
import CheckboxScreen from './screens/CheckboxScreen'
import NumberStepperScreen from './screens/NumberStepperScreen'

export default function FlowEngine({
  flow,
  onExit,
}: {
  flow: Flow
  onExit: () => void
}) {
  const { answers, currentIndex, setAnswers, setCurrentIndex } =
    usePersistedAnswers(flow.id)
  const [completed, setCompleted] = useState(false)
  const [animKey, setAnimKey] = useState(0)

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
        setCompleted(true)
      } else {
        setCurrentIndex(targetIndex)
      }
    },
    [flow.screens.length],
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
  const currentAnswer = answers[currentIndex] ?? null

  return (
    <div className="app">
      <NavBar title={flow.category} onBack={handleBack} />
      <div className="screen-card" key={animKey}>
        <div className="screen" style={{ animation: 'screenIn 0.25s ease-out' }}>
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
  onDone,
  onSkip,
  onNext,
}: {
  showSkip: boolean
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
      <button className="btn btn-next" onClick={onNext} type="button">
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
  }
}
