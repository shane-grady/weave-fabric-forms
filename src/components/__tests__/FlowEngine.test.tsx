import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Flow } from '../../types'
import FlowEngine from '../FlowEngine'

const testFlow: Flow = {
  id: 'test-flow',
  title: 'Test Flow',
  category: 'Test',
  introCopy: 'Test intro copy',
  icon: '🧪',
  screens: [
    {
      type: 'intro',
      question: 'Welcome',
      introCopy: 'Intro text',
    },
    {
      type: 'single-select',
      question: 'Pick one',
      options: ['alpha', 'beta', 'gamma'],
      memoryTags: ['#test-pick'],
    },
    {
      type: 'text-input',
      question: 'Tell us more',
      placeholder: 'Type here',
      memoryTags: ['#test-text'],
    },
  ],
}

const noop = () => {}

describe('FlowEngine', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the first screen (intro)', async () => {
    render(<FlowEngine flow={testFlow} onExit={noop} />)
    expect(await screen.findByText('Welcome')).toBeInTheDocument()
    expect(await screen.findByText('Intro text')).toBeInTheDocument()
  })

  it('advances to next screen on Next click', async () => {
    const user = userEvent.setup()
    render(<FlowEngine flow={testFlow} onExit={noop} />)

    expect(await screen.findByText('Welcome')).toBeInTheDocument()
    await user.click(screen.getByText('Next'))

    expect(await screen.findByText('Pick one')).toBeInTheDocument()
  })

  it('goes back on back button click', async () => {
    const user = userEvent.setup()
    render(<FlowEngine flow={testFlow} onExit={noop} />)

    await screen.findByText('Welcome')
    await user.click(screen.getByText('Next'))
    expect(await screen.findByText('Pick one')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Go back'))
    expect(await screen.findByText('Welcome')).toBeInTheDocument()
  })

  it('calls onExit when back is pressed on first screen', async () => {
    const onExit = vi.fn()
    const user = userEvent.setup()
    render(<FlowEngine flow={testFlow} onExit={onExit} />)

    await screen.findByText('Welcome')
    await user.click(screen.getByLabelText('Go back'))
    expect(onExit).toHaveBeenCalledOnce()
  })

  it('shows completion screen after last question', async () => {
    const user = userEvent.setup()
    render(<FlowEngine flow={testFlow} onExit={noop} />)

    // Intro → Next
    await screen.findByText('Welcome')
    await user.click(screen.getByText('Next'))
    // Select an option
    await user.click(await screen.findByText('alpha'))
    await user.click(screen.getByText('Next'))
    // Type something
    const input = await screen.findByPlaceholderText('Type here')
    await user.type(input, 'hello')
    await user.click(screen.getByText('Next'))

    expect(await screen.findByText('All done!')).toBeInTheDocument()
  })
})
