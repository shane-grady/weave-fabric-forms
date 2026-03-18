import { useState, useRef } from 'react'
import type { FlowScreen, Answer } from '../../types'

export default function RankingScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const items: string[] = Array.isArray(value) ? value : [...(screen.options ?? [])]
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const getInsertIndex = (clientY: number): number => {
    if (!listRef.current) return 0
    const children = Array.from(listRef.current.children) as HTMLElement[]
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect()
      if (clientY < rect.top + rect.height / 2) return i
    }
    return children.length
  }

  const reorder = (from: number, to: number) => {
    if (from === to) return
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to > from ? to - 1 : to, 0, moved)
    onChange(next)
  }

  const onGripDown = (idx: number, e: React.PointerEvent<HTMLSpanElement>) => {
    e.preventDefault()
    setDragIdx(idx)
    setOverIdx(idx)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onGripMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (dragIdx === null) return
    setOverIdx(getInsertIndex(e.clientY))
  }

  const onGripUp = () => {
    if (dragIdx !== null && overIdx !== null) {
      reorder(dragIdx, overIdx)
    }
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <p className="subtitle">Drag to reorder</p>
      <div className="ranking-list" ref={listRef}>
        {items.map((item, i) => {
          const isDragging = dragIdx === i
          const showAbove = overIdx !== null && dragIdx !== null && overIdx <= i && dragIdx > i
          const showBelow = overIdx !== null && dragIdx !== null && overIdx > i && dragIdx < i

          return (
            <div
              key={item}
              className={[
                'ranking-item',
                isDragging ? 'ranking-item--dragging' : '',
                showAbove ? 'ranking-item--shift-down' : '',
                showBelow ? 'ranking-item--shift-up' : '',
              ].join(' ')}
            >
              <span className="ranking-num">{i + 1}</span>
              <span className="ranking-label">{item}</span>
              <span
                className="ranking-grip"
                onPointerDown={(e) => onGripDown(i, e)}
                onPointerMove={onGripMove}
                onPointerUp={onGripUp}
                onPointerCancel={onGripUp}
                style={{ touchAction: 'none' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5" />
                  <circle cx="15" cy="6" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="18" r="1.5" />
                  <circle cx="15" cy="18" r="1.5" />
                </svg>
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
