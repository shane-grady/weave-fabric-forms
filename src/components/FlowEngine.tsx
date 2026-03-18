import { lazy, Suspense, useEffect, useRef } from 'react'
import type { Flow, Answer } from '../types'
import useFlowNavigation from '../hooks/useFlowNavigation'
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

export default function FlowEngine({
  flow,
  onExit,
}: {
  flow: Flow
  onExit: () => void
}) {
  const nav = useFlowNavigation(flow, onExit)

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
  }, [nav.animKey])

  if (nav.completed) {
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

  const isIntro = nav.screen.type === 'intro'

  return (
    <div className="app">
      <NavBar title={flow.category} onBack={nav.handleBack} />
      <div className="screen-card" key={nav.animKey}>
        <div className={`screen screen--${nav.direction}`} ref={screenRef}>
          <ProgressBar current={nav.mainStep} total={nav.totalMain} />
          <div className="screen-content" aria-live="polite">
            <Suspense fallback={<div className="screen-spinner" />}>
              <ScreenRenderer
                screen={nav.screen}
                flowId={flow.id}
                value={nav.currentAnswer}
                onChange={nav.handleChange}
              />
            </Suspense>
          </div>
          <BottomNav
            showSkip={!isIntro}
            disabled={!nav.canAdvance}
            onDone={onExit}
            onSkip={nav.handleSkip}
            onNext={nav.handleNext}
          />
        </div>
      </div>
      {nav.undoIndex !== null && (
        <button className="undo-toast" onClick={nav.handleUndo} type="button">
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
