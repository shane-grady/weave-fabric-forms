import type { FlowScreen } from '../../types'

const FLOW_ICONS: Record<string, string> = {
  'about-you': '👤',
  'your-work': '💼',
  'how-you-communicate': '💬',
  'your-people': '👥',
  'food-dining': '🍽️',
  'travel': '✈️',
  'entertainment': '🎬',
  'shopping-hobbies': '🛍️',
  'money-finances': '💰',
  'health-wellness': '🏥',
  'what-you-know': '🧠',
  'what-matters': '💎',
  'digital-life': '📱',
  'your-space': '🏠',
  'important-stuff': '📋',
  'your-goals': '🎯',
  'daily-routine': '⏰',
  'social-life': '🎉',
  'learning-growth': '📚',
  'creativity': '🎨',
  'pets-animals': '🐾',
  'spirituality': '🕊️',
  'sports-fitness': '⚽',
  'music-taste': '🎵',
  'tech-gadgets': '🖥️',
}

export default function IntroScreen({
  screen,
  flowId,
  voiceSupported,
  voiceEnabled,
  onToggleVoice,
  voiceError,
}: {
  screen: FlowScreen
  flowId: string
  voiceSupported?: boolean
  voiceEnabled?: boolean
  onToggleVoice?: () => void
  voiceError?: string | null
}) {
  return (
    <>
      <div className="intro-icon-box">
        <span className="intro-icon">{FLOW_ICONS[flowId] ?? '✨'}</span>
      </div>
      <h1 className="intro-title">{screen.question}</h1>
      <p className="intro-copy">{screen.introCopy}</p>
      <p className="intro-cta">
        Answer as many of these items as you can to improve your memory score.
      </p>
      {voiceSupported && (
        <>
          <button
            className={`voice-toggle ${voiceEnabled ? 'voice-toggle--active' : ''}`}
            onClick={onToggleVoice}
            type="button"
            aria-pressed={voiceEnabled}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="1" width="6" height="11" rx="3" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            {voiceEnabled ? 'Voice Mode On' : 'Use Voice Mode'}
          </button>
          {voiceError === 'not-allowed' && (
            <p className="voice-error">
              Microphone access was denied. Please enable it in your browser
              settings and try again.
            </p>
          )}
        </>
      )}
    </>
  )
}
