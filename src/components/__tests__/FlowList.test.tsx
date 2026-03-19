import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Flow } from '../../types'
import FlowList from '../FlowList'

const testFlows: Flow[] = [
  {
    id: 'flow-a',
    title: 'Flow Alpha',
    category: 'Category A',
    introCopy: 'Alpha intro',
    icon: '🅰️',
    screens: [
      { type: 'intro', question: 'A Intro', introCopy: 'A' },
      { type: 'text-input', question: 'Q1', memoryTags: ['#q1'] },
    ],
  },
  {
    id: 'flow-b',
    title: 'Flow Beta',
    category: 'Category B',
    introCopy: 'Beta intro',
    icon: '🅱️',
    screens: [
      { type: 'intro', question: 'B Intro', introCopy: 'B' },
    ],
  },
]

describe('FlowList', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders all flow cards', () => {
    render(<FlowList flows={testFlows} onSelect={() => {}} />)
    expect(screen.getByText('Flow Alpha')).toBeInTheDocument()
    expect(screen.getByText('Flow Beta')).toBeInTheDocument()
  })

  it('calls onSelect when a flow card is clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<FlowList flows={testFlows} onSelect={onSelect} />)

    await user.click(screen.getByText('Flow Alpha'))
    expect(onSelect).toHaveBeenCalledWith(testFlows[0])
  })

  it('shows overall progress bar', () => {
    render(<FlowList flows={testFlows} onSelect={() => {}} />)
    expect(screen.getByText('0 of 2 complete')).toBeInTheDocument()
  })

  it('filters flows by search query', async () => {
    const user = userEvent.setup()
    render(<FlowList flows={testFlows} onSelect={() => {}} />)

    await user.type(screen.getByPlaceholderText('Search flows...'), 'Beta')
    expect(screen.queryByText('Flow Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Flow Beta')).toBeInTheDocument()
  })
})
