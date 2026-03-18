export default function BottomNav({
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
