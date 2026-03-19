import type { FlowScreen, Answer } from '../../types'

export default function MultiInputScreen({
  screen,
  value,
  onChange,
  onFieldFocus,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
  onFieldFocus?: (index: number) => void
}) {
  const values = (value as string[]) ?? screen.fields?.map(() => '') ?? []

  const update = (idx: number, v: string) => {
    const next = [...values]
    next[idx] = v
    onChange(next)
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      {screen.subtitle && <p className="subtitle">{screen.subtitle}</p>}
      <div className="multi-input-fields">
        {screen.fields?.map((field, i) => (
          <div key={field.label} className="multi-input-field">
            <label>{field.label}</label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[i] ?? ''}
              onChange={(e) => update(i, e.target.value)}
              onFocus={() => onFieldFocus?.(i)}
            />
          </div>
        ))}
      </div>
    </>
  )
}
