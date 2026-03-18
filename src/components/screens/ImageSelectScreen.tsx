import type { FlowScreen, Answer } from '../../types'

function isUrl(s: string): boolean {
  return s.startsWith('http') || s.startsWith('data:')
}

export default function ImageSelectScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const selected: string[] = Array.isArray(value) ? value : []

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt],
    )
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <p className="subtitle">{screen.subtitle ?? 'Select all that apply'}</p>
      <div className="image-grid">
        {screen.options?.map((opt, i) => {
          const img = screen.images?.[i]
          const isSelected = selected.includes(opt)

          return (
            <button
              key={opt}
              className={`image-card ${isSelected ? 'image-card--selected' : ''}`}
              onClick={() => toggle(opt)}
              type="button"
            >
              <div className="image-card-visual">
                {img && isUrl(img) ? (
                  <img src={img} alt={opt} className="image-card-img" />
                ) : (
                  <span className="image-card-emoji">{img ?? '✨'}</span>
                )}
                {isSelected && (
                  <span className="image-card-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </div>
              <span className="image-card-label">{opt}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
