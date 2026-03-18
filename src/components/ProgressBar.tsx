export default function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
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
