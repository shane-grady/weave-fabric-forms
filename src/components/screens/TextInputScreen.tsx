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
  const text = (value as string) ?? ''
  const max = screen.maxLength

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <textarea
        className="text-input-area"
        placeholder={screen.placeholder}
        value={text}
        onChange={(e) => onChange(max ? e.target.value.slice(0, max) : e.target.value)}
        maxLength={max}
        autoFocus
      />
      {max != null && (
        <div className={`char-count ${text.length >= max ? 'char-count--limit' : ''}`}>
          {text.length}/{max}
        </div>
      )}
    </>
  )
}
