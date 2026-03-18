import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  onReset: () => void
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FlowEngine error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="app">
        <div className="screen-card">
          <div className="completion">
            <div className="completion-icon">!</div>
            <h1 className="completion-title">Something went wrong</h1>
            <p className="completion-desc">
              An unexpected error occurred. Your progress has been saved.
            </p>
            <button
              className="completion-btn"
              onClick={() => {
                this.setState({ hasError: false })
                this.props.onReset()
              }}
              type="button"
            >
              Back to flows
            </button>
          </div>
        </div>
      </div>
    )
  }
}
