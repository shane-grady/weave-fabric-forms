import type { FlowScreen, Answer } from '../../types'

export default function TextInputScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <textarea
        className="text-input-area"
        placeholder={screen.placeholder}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
    </>
  )
}
