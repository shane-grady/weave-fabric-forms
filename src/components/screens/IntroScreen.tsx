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
}

export default function IntroScreen({
  screen,
  flowId,
}: {
  screen: FlowScreen
  flowId: string
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
    </>
  )
}
