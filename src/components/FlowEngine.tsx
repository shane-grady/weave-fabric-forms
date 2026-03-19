import { lazy, Suspense, useEffect, useRef } from 'react'
import type { Flow, Answer } from '../types'
import useFlowNavigation from '../hooks/useFlowNavigation'
import useVoiceMode from '../hooks/useVoiceMode'
import NavBar from './NavBar'
import ProgressBar from './ProgressBar'
import BottomNav from './BottomNav'
import VoiceModeIndicator from './VoiceModeIndicator'

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
    case 'image-select':
      return true
    case 'text-input':
      return typeof answer === 'string' && answer.trim().length > 0
    case 'multi-input':
      return Array.isArray(answer) && answer.some((v) => typeof v === 'string' && v.trim().length > 0)
    case 'multi-select':
    case 'checkbox':
    case 'tag-input':
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
  const nav = useFlowNavigation(flow, onExit)

  const voice = useVoiceMode({
    screenType: nav.screen.type,
    currentIndex: nav.currentIndex,
    onChange: nav.handleChange,
    currentAnswer: nav.currentAnswer,
    screen: nav.screen,
    onNext: nav.handleNext,
  })

  // Swipe gesture detection
  const touchStartX = useRef(0)
  const navNextRef = useRef(nav.handleNext)
  const navBackRef = useRef(nav.handleBack)
  const canAdvanceRef = useRef(nav.canAdvance)
  navNextRef.current = nav.handleNext
  navBackRef.current = nav.handleBack
  canAdvanceRef.current = nav.canAdvance

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 50) return
    if (dx < 0 && canAdvanceRef.current) navNextRef.current()
    else if (dx > 0) navBackRef.current()
  }

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
          <div className="confetti" aria-hidden="true" />
          <div className="completion">
            <div className="completion-icon">
              <svg className="checkmark-svg" viewBox="0 0 52 52" fill="none">
                <circle className="checkmark-circle" cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="3" />
                <path className="checkmark-path" d="M15 27l7 7 15-15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
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
      <div className="screen-card" key={nav.animKey} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className={`screen screen--${nav.direction}`} ref={screenRef}>
          <ProgressBar current={nav.mainStep} total={nav.totalMain} />
          {voice.isEnabled && !isIntro && (
            <VoiceModeIndicator isListening={voice.isListening} error={voice.error} />
          )}
          <div className="screen-content" aria-live="polite">
            <Suspense fallback={<div className="screen-spinner" />}>
              <ScreenRenderer
                screen={nav.screen}
                flowId={flow.id}
                value={nav.currentAnswer}
                onChange={nav.handleChange}
                voiceSupported={voice.isSupported}
                voiceEnabled={voice.isEnabled}
                onToggleVoice={voice.toggleVoiceMode}
                voiceError={voice.error}
                voiceInterimTranscript={voice.interimTranscript}
                onFieldFocus={voice.setFocusedFieldIndex}
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
  voiceSupported,
  voiceEnabled,
  onToggleVoice,
  voiceError,
  voiceInterimTranscript,
  onFieldFocus,
}: {
  screen: import('../types').FlowScreen
  flowId: string
  value: Answer
  onChange: (v: Answer) => void
  voiceSupported: boolean
  voiceEnabled: boolean
  onToggleVoice: () => void
  voiceError: string | null
  voiceInterimTranscript: string
  onFieldFocus: (index: number) => void
}) {
  switch (screen.type) {
    case 'intro':
      return (
        <IntroScreen
          screen={screen}
          flowId={flowId}
          voiceSupported={voiceSupported}
          voiceEnabled={voiceEnabled}
          onToggleVoice={onToggleVoice}
          voiceError={voiceError}
        />
      )
    case 'multi-select':
      return <MultiSelectScreen screen={screen} value={value} onChange={onChange} />
    case 'single-select':
      return <SingleSelectScreen screen={screen} value={value} onChange={onChange} />
    case 'binary-choice':
      return <BinaryChoiceScreen screen={screen} value={value} onChange={onChange} />
    case 'text-input':
      return <TextInputScreen screen={screen} value={value} onChange={onChange} />
    case 'multi-input':
      return (
        <MultiInputScreen
          screen={screen}
          value={value}
          onChange={onChange}
          onFieldFocus={onFieldFocus}
        />
      )
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
      return (
        <TagInputScreen
          screen={screen}
          value={value}
          onChange={onChange}
          voiceInterimTranscript={voiceEnabled ? voiceInterimTranscript : undefined}
        />
      )
    case 'image-select':
      return <ImageSelectScreen screen={screen} value={value} onChange={onChange} />
  }
}
