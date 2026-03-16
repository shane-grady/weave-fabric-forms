import type { FlowScreen, Answer } from '../../types'

export default function BinaryChoiceScreen({
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
      <div className="binary-choices">
        <button
          className={`binary-btn binary-btn--yes ${selected === 'yes' ? 'binary-btn--selected' : ''}`}
          onClick={() => onChange('yes')}
          type="button"
        >
          Yes
        </button>
        <button
          className={`binary-btn binary-btn--no ${selected === 'no' ? 'binary-btn--selected' : ''}`}
          onClick={() => onChange('no')}
          type="button"
        >
          No
        </button>
      </div>
    </>
  )
}
