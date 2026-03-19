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

const skipFlow: Flow = {
  id: 'skip-flow',
  title: 'Skip Flow',
  category: 'Test',
  introCopy: 'Test skip rules',
  icon: '🧪',
  screens: [
    {
      type: 'intro',
      question: 'Start',
      introCopy: 'Skip test',
    },
    {
      type: 'binary-choice',
      question: 'Do you have pets?',
      memoryTags: ['#has-pets'],
      skipRules: [{ values: ['no'], targetIndex: 3 }],
    },
    {
      type: 'text-input',
      question: 'Pet names',
      placeholder: 'Names...',
      memoryTags: ['#pet-names'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Final question',
      placeholder: 'Final...',
      memoryTags: ['#final'],
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

  it('skip rules route to the correct target screen', async () => {
    const user = userEvent.setup()
    render(<FlowEngine flow={skipFlow} onExit={noop} />)

    await screen.findByText('Start')
    await user.click(screen.getByText('Next'))

    // Select "no" which triggers skip rule → targetIndex 3
    await user.click(await screen.findByText('No'))
    await user.click(screen.getByText('Next'))

    // Should skip "Pet names" (index 2) and land on "Final question" (index 3)
    expect(await screen.findByText('Final question')).toBeInTheDocument()
  })

  it('skip rules do not trigger for non-matching answers', async () => {
    const user = userEvent.setup()
    render(<FlowEngine flow={skipFlow} onExit={noop} />)

    await screen.findByText('Start')
    await user.click(screen.getByText('Next'))

    // Select "yes" — should NOT trigger skip rule
    await user.click(await screen.findByText('Yes'))
    await user.click(screen.getByText('Next'))

    // Should go to "Pet names" (index 2), not skip
    expect(await screen.findByText('Pet names')).toBeInTheDocument()
  })

  it('skip button jumps past sub-screens', async () => {
    const user = userEvent.setup()
    render(<FlowEngine flow={skipFlow} onExit={noop} />)

    await screen.findByText('Start')
    await user.click(screen.getByText('Next'))

    // On binary-choice screen, click Skip
    await screen.findByText('Do you have pets?')
    await user.click(screen.getByText('Skip'))

    // Skip should jump past the sub-screen to "Final question"
    expect(await screen.findByText('Final question')).toBeInTheDocument()
  })
})
