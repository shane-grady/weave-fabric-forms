import type { FlowScreen, Answer } from '../../types'

export default function SliderScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const min = screen.min ?? 0
  const max = screen.max ?? 10
  const step = screen.step ?? 1
  const current = typeof value === 'number' ? value : min
  const pct = ((current - min) / (max - min)) * 100

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      {screen.subtitle && <p className="subtitle">{screen.subtitle}</p>}
      <div className="slider-value">{current}</div>
      <div className="slider-track-wrap">
        <input
          type="range"
          className="slider-input"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ '--slider-pct': `${pct}%` } as React.CSSProperties}
        />
        <div className="slider-labels">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </>
  )
}
