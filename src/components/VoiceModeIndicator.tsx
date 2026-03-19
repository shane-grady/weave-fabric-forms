export default function VoiceModeIndicator({
  isListening,
  error,
}: {
  isListening: boolean
  error: string | null
}) {
  if (error === 'not-allowed') {
    return (
      <div className="voice-indicator voice-indicator--error" aria-live="polite">
        <svg className="voice-indicator-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .84-.15 1.65-.42 2.4" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        <span className="voice-indicator-label">Mic denied</span>
      </div>
    )
  }

  if (!isListening) return null

  return (
    <div className="voice-indicator" aria-live="polite">
      <span className="voice-indicator-dot" />
      <span className="voice-indicator-label">Listening...</span>
    </div>
  )
}
