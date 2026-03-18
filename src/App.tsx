import { useState } from 'react'
import type { Flow } from './types'
import { allFlows } from './data/flows'
import FlowList from './components/FlowList'
import FlowEngine from './components/FlowEngine'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  const [activeFlow, setActiveFlow] = useState<Flow | null>(null)

  if (activeFlow) {
    return (
      <ErrorBoundary onReset={() => setActiveFlow(null)}>
        <FlowEngine flow={activeFlow} onExit={() => setActiveFlow(null)} />
      </ErrorBoundary>
    )
  }

  return <FlowList flows={allFlows} onSelect={setActiveFlow} />
}
