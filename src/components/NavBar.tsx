export default function NavBar({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="nav-bar">
      <button className="nav-back" onClick={onBack} type="button" aria-label="Go back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span className="nav-title">{title}</span>
    </div>
  )
}
