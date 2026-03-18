import { useMemo } from 'react'
import type { Flow, Answer } from '../types'

function getCompletedFlows(): Set<string> {
  try {
    const raw = localStorage.getItem('weave-completed-flows')
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function getFlowProgress(flow: Flow, isDone: boolean): { answered: number; total: number } {
  const dataScreens = flow.screens.filter((s) => s.type !== 'intro')
  const total = dataScreens.length
  if (isDone) return { answered: total, total }
  try {
    const raw = localStorage.getItem(`weave-flow-${flow.id}`)
    if (!raw) return { answered: 0, total }
    const saved: { answers: Record<number, Answer> } = JSON.parse(raw)
    let answered = 0
    for (let i = 0; i < flow.screens.length; i++) {
      if (flow.screens[i].type === 'intro') continue
      const a = saved.answers[i]
      if (a != null && a !== '' && !(Array.isArray(a) && a.length === 0)) answered++
    }
    return { answered, total }
  } catch {
    return { answered: 0, total }
  }
}

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
  const completed = useMemo(() => getCompletedFlows(), [])
  const completedCount = useMemo(
    () => flows.filter((f) => completed.has(f.id)).length,
    [flows, completed],
  )
  const overallPct = flows.length > 0 ? Math.round((completedCount / flows.length) * 100) : 0

  return (
    <div className="app">
      <div className="flow-list">
        <div className="flow-list-header">
          <div className="flow-list-logo">Weave Fabric</div>
          <h1 className="flow-list-title">Build Your Memory</h1>
          <p className="flow-list-subtitle">
            Quick flows that help Weave understand you. Tap any card to get started.
          </p>
          <div className="overall-progress">
            <div className="overall-progress-bar">
              <div
                className="overall-progress-fill"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="overall-progress-label">
              {completedCount} of {flows.length} complete
            </span>
          </div>
        </div>
        <div className="flow-grid">
          {flows.map((flow) => {
            const isDone = completed.has(flow.id)
            const { answered, total } = getFlowProgress(flow, isDone)
            return (
              <button
                key={flow.id}
                className={`flow-card ${isDone ? 'flow-card--done' : ''}`}
                onClick={() => onSelect(flow)}
                type="button"
              >
                <div className="flow-card-icon">
                  {FLOW_ICONS[flow.id] ?? '✨'}
                </div>
                <div className="flow-card-content">
                  <div className="flow-card-title">{flow.title}</div>
                  <div className="flow-card-desc">{flow.introCopy}</div>
                  {answered > 0 && (
                    <div className="flow-card-progress">
                      {isDone ? 'Complete' : `${answered} of ${total} answered`}
                    </div>
                  )}
                </div>
                {isDone ? (
                  <span className="flow-card-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                ) : (
                  <span className="flow-card-arrow">›</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
