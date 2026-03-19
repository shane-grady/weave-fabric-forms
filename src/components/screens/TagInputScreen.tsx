import { useState, useMemo, useEffect } from 'react'
import type { FlowScreen, Answer } from '../../types'

export default function TagInputScreen({
  screen,
  value,
  onChange,
  voiceInterimTranscript,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
  voiceInterimTranscript?: string
}) {
  const tags: string[] = Array.isArray(value) ? value : []
  const [input, setInput] = useState('')

  // Show voice interim transcript as preview in the input field
  useEffect(() => {
    if (voiceInterimTranscript) {
      setInput(voiceInterimTranscript)
    }
  }, [voiceInterimTranscript])

  const suggestions = useMemo(() => {
    if (!screen.options || !input.trim()) return []
    const q = input.toLowerCase()
    return screen.options.filter(
      (opt) => opt.toLowerCase().includes(q) && !tags.includes(opt),
    )
  }, [screen.options, input, tags])

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      e.stopPropagation()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <p className="subtitle">{screen.subtitle ?? 'Type and press Enter to add'}</p>

      {tags.length > 0 && (
        <div className="tag-chips">
          {tags.map((tag) => (
            <span key={tag} className="tag-chip">
              <span>{tag}</span>
              <button
                className="tag-chip-remove"
                onClick={() => removeTag(tag)}
                type="button"
                aria-label={`Remove ${tag}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        className="tag-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.replace(',', ''))}
        onKeyDown={handleKeyDown}
        placeholder={screen.placeholder ?? 'Add a tag...'}
        autoFocus
      />

      {suggestions.length > 0 && (
        <div className="tag-suggestions">
          {suggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              className="tag-suggestion"
              onClick={() => addTag(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
