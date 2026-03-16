import type { FlowScreen, Answer } from '../../types'

export default function SingleSelectScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const selected = value as string | null

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <p className="subtitle">Select one</p>
      <div className="radios">
        {screen.options?.map((opt) => (
          <button
            key={opt}
            className={`radio-option ${selected === opt ? 'radio-option--selected' : ''}`}
            onClick={() => onChange(opt)}
            type="button"
          >
            <span className="radio-circle">
              <span className="radio-dot" />
            </span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
    </>
  )
}
