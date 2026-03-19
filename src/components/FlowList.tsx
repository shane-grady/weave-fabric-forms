import { useMemo, useState, useEffect } from 'react'
import type { Flow, Answer } from '../types'

function getStoredTheme(): 'light' | 'dark' {
  try {
    return localStorage.getItem('weave-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

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
  'your-goals': '🎯',
  'daily-routine': '⏰',
  'social-life': '🎉',
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
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('weave-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const filtered = useMemo(() => {
    if (!query.trim()) return flows
    const q = query.toLowerCase()
    return flows.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    )
  }, [flows, query])

  const grouped = useMemo(() => {
    const map = new Map<string, Flow[]>()
    for (const flow of filtered) {
      const group = flow.category.includes(' — ')
        ? flow.category.split(' — ')[0]
        : flow.category
      const list = map.get(group) ?? []
      list.push(flow)
      map.set(group, list)
    }
    return map
  }, [filtered])

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const toggleSection = (group: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })

  return (
    <div className="app">
      <div className="flow-list">
        <div className="flow-list-header">
          <div className="flow-list-top-row">
            <div className="flow-list-logo">Weave Fabric</div>
            <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label="Toggle dark mode">
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>
          </div>
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
        <div className="flow-search-wrap">
          <input
            className="flow-search"
            type="text"
            placeholder="Search flows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flow-grid">
          {[...grouped.entries()].map(([group, groupFlows]) => (
            <div key={group} className="flow-section">
              <button
                className="flow-section-header"
                onClick={() => toggleSection(group)}
                type="button"
                aria-expanded={!collapsed.has(group)}
              >
                <span className="flow-section-title">{group}</span>
                <span className={`flow-section-chevron ${collapsed.has(group) ? 'flow-section-chevron--collapsed' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {!collapsed.has(group) && groupFlows.map((flow) => {
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
          ))}
        </div>
      </div>
    </div>
  )
}
