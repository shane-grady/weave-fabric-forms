import { render, screen } from '@testing-library/react'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  it('renders the correct label', () => {
    render(<ProgressBar current={3} total={10} />)
    expect(screen.getByText('3/10')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<ProgressBar current={5} total={12} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '5')
    expect(bar).toHaveAttribute('aria-valuemax', '12')
    expect(bar).toHaveAttribute('aria-label', 'Step 5 of 12')
  })

  it('renders the correct number of segments', () => {
    const { container } = render(<ProgressBar current={2} total={7} />)
    const filled = container.querySelectorAll('.progress-segment--filled')
    const empty = container.querySelectorAll('.progress-segment--empty')
    expect(filled).toHaveLength(2)
    expect(empty).toHaveLength(5)
  })

  it('renders sr-only text', () => {
    render(<ProgressBar current={1} total={4} />)
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
  })
})
