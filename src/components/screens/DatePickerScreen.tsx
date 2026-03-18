import { useMemo } from 'react'
import type { FlowScreen, Answer } from '../../types'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function daysInMonth(month: number, year: number): number {
  if (!month || !year) return 31
  return new Date(year, month, 0).getDate()
}

function parseDate(value: Answer): { month: number; day: number; year: number } {
  if (typeof value !== 'string' || !value) return { month: 0, day: 0, year: 0 }
  const [y, m, d] = value.split('-').map(Number)
  return { month: m || 0, day: d || 0, year: y || 0 }
}

function formatDate(month: number, day: number, year: number): string {
  if (!month || !day || !year) return ''
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i)

export default function DatePickerScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  const { month, day, year } = parseDate(value)

  const maxDays = useMemo(() => daysInMonth(month, year || currentYear), [month, year])
  const days = useMemo(() => Array.from({ length: maxDays }, (_, i) => i + 1), [maxDays])

  const update = (m: number, d: number, y: number) => {
    const clamped = Math.min(d, daysInMonth(m, y || currentYear))
    onChange(formatDate(m, clamped, y))
  }

  return (
    <>
      <h1 className="question">{screen.question}</h1>
      {screen.subtitle && <p className="subtitle">{screen.subtitle}</p>}
      <div className="date-picker">
        <div className="date-picker-col">
          <label className="date-picker-label">Month</label>
          <select
            className="date-picker-select"
            value={month}
            onChange={(e) => update(Number(e.target.value), day, year)}
          >
            <option value={0} disabled>—</option>
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </div>
        <div className="date-picker-col">
          <label className="date-picker-label">Day</label>
          <select
            className="date-picker-select"
            value={day}
            onChange={(e) => update(month, Number(e.target.value), year)}
          >
            <option value={0} disabled>—</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="date-picker-col">
          <label className="date-picker-label">Year</label>
          <select
            className="date-picker-select"
            value={year}
            onChange={(e) => update(month, day, Number(e.target.value))}
          >
            <option value={0} disabled>—</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
