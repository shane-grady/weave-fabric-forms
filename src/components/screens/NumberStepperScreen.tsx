import { useRef, useCallback } from 'react'
import type { FlowScreen, Answer } from '../../types'
import { haptic } from '../../haptic'

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
  const valRef = useRef(num)
  valRef.current = num

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startHold = useCallback(
    (delta: number) => {
      stop()
      intervalRef.current = setInterval(() => {
        const next = delta > 0 ? valRef.current + 1 : Math.max(0, valRef.current - 1)
        if (next !== valRef.current) {
          haptic()
          onChange(next)
        }
      }, 120)
    },
    [onChange, stop],
  )

  const tap = (delta: number) => {
    haptic()
    onChange(delta > 0 ? num + 1 : Math.max(0, num - 1))
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      <div className="stepper">
        <button
          className="stepper-btn stepper-btn--minus"
          onClick={() => tap(-1)}
          onPointerDown={() => startHold(-1)}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          type="button"
          style={{ touchAction: 'none' }}
        >
          −
        </button>
        <div className="stepper-value">{num}</div>
        <button
          className="stepper-btn stepper-btn--plus"
          onClick={() => tap(1)}
          onPointerDown={() => startHold(1)}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          type="button"
          style={{ touchAction: 'none' }}
        >
          +
        </button>
      </div>
    </>
  )
}
