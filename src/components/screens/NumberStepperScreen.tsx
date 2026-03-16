import type { FlowScreen, Answer } from '../../types'

export default function NumberStepperScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const num = (value as number) ?? 0

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <div className="stepper">
        <button
          className="stepper-btn stepper-btn--minus"
          onClick={() => onChange(Math.max(0, num - 1))}
          type="button"
        >
          −
        </button>
        <div className="stepper-value">{num}</div>
        <button
          className="stepper-btn stepper-btn--plus"
          onClick={() => onChange(num + 1)}
          type="button"
        >
          +
        </button>
      </div>
    </>
  )
}
