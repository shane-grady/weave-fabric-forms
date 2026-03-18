import type { FlowScreen, Answer } from '../../types'
import { haptic } from '../../haptic'

export default function MultiSelectScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const selected = (value as string[]) ?? []

  const toggle = (opt: string) => {
    haptic()
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt],
    )
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <p className="subtitle">Select all that apply</p>
      <div className="chips">
        {screen.options?.map((opt) => (
          <button
            key={opt}
            className={`chip ${selected.includes(opt) ? 'chip--selected' : ''}`}
            onClick={() => toggle(opt)}
            type="button"
          >
            <span>{opt}</span>
            <svg
              className="chip-check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ))}
      </div>
    </>
  )
}
