import type { Flow } from '../types'

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
}

export default function FlowList({
  flows,
  onSelect,
}: {
  flows: Flow[]
  onSelect: (flow: Flow) => void
}) {
  return (
    <div className="app">
      <div className="flow-list">
        <div className="flow-list-header">
          <div className="flow-list-logo">Weave Fabric</div>
          <h1 className="flow-list-title">Build Your Memory</h1>
          <p className="flow-list-subtitle">
            Quick flows that help Weave understand you. Tap any card to get started.
          </p>
        </div>
        <div className="flow-grid">
          {flows.map((flow) => (
            <button
              key={flow.id}
              className="flow-card"
              onClick={() => onSelect(flow)}
              type="button"
            >
              <div className="flow-card-icon">
                {FLOW_ICONS[flow.id] ?? '✨'}
              </div>
              <div className="flow-card-content">
                <div className="flow-card-title">{flow.title}</div>
                <div className="flow-card-desc">{flow.introCopy}</div>
              </div>
              <span className="flow-card-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
