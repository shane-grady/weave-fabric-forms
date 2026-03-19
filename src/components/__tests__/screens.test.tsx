import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextInputScreen from '../screens/TextInputScreen'
import MultiSelectScreen from '../screens/MultiSelectScreen'
import SingleSelectScreen from '../screens/SingleSelectScreen'
import BinaryChoiceScreen from '../screens/BinaryChoiceScreen'
import NumberStepperScreen from '../screens/NumberStepperScreen'
import type { FlowScreen } from '../../types'

const makeScreen = (overrides: Partial<FlowScreen>): FlowScreen => ({
  type: 'text-input',
  question: 'Test question',
  ...overrides,
})

describe('TextInputScreen', () => {
  it('renders question and updates value on input', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <TextInputScreen
        screen={makeScreen({ placeholder: 'Write...' })}
        value={null}
        onChange={onChange}
      />,
    )

    expect(screen.getByText('Test question')).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('Write...'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })
})

describe('MultiSelectScreen', () => {
  const ms = makeScreen({
    type: 'multi-select',
    question: 'Pick many',
    options: ['a', 'b', 'c'],
  })

  it('toggles options on click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MultiSelectScreen screen={ms} value={[]} onChange={onChange} />)

    await user.click(screen.getByText('a'))
    expect(onChange).toHaveBeenCalledWith(['a'])
  })

  it('deselects already-selected options', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MultiSelectScreen screen={ms} value={['a', 'b']} onChange={onChange} />)

    await user.click(screen.getByText('a'))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })
})

describe('SingleSelectScreen', () => {
  const ss = makeScreen({
    type: 'single-select',
    question: 'Pick one',
    options: ['x', 'y', 'z'],
  })

  it('selects an option on click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SingleSelectScreen screen={ss} value={null} onChange={onChange} />)

    await user.click(screen.getByText('y'))
    expect(onChange).toHaveBeenCalledWith('y')
  })
})

describe('BinaryChoiceScreen', () => {
  const bc = makeScreen({ type: 'binary-choice', question: 'Yes or no?' })

  it('calls onChange with yes/no', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<BinaryChoiceScreen screen={bc} value={null} onChange={onChange} />)

    await user.click(screen.getByText('Yes'))
    expect(onChange).toHaveBeenCalledWith('yes')

    await user.click(screen.getByText('No'))
    expect(onChange).toHaveBeenCalledWith('no')
  })
})

describe('NumberStepperScreen', () => {
  const ns = makeScreen({ type: 'number-stepper', question: 'How many?' })

  it('increments on plus click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<NumberStepperScreen screen={ns} value={3} onChange={onChange} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    await user.click(screen.getByText('+'))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('decrements on minus click but floors at 0', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<NumberStepperScreen screen={ns} value={0} onChange={onChange} />)

    await user.click(screen.getByText('−'))
    expect(onChange).toHaveBeenCalledWith(0)
  })
})
