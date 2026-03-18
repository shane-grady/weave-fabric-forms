export default function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="progress-bar">
      <div className="progress-segments">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-segment ${
              i < current ? 'progress-segment--filled' : 'progress-segment--empty'
            }`}
          />
        ))}
      </div>
      <span className="progress-label">
        {current}/{total}
      </span>
    </div>
  )
}
