import { useState } from 'react'
import type { Flow } from './types'
import { allFlows } from './data/flows'
import FlowList from './components/FlowList'
import FlowEngine from './components/FlowEngine'

export default function App() {
  const [activeFlow, setActiveFlow] = useState<Flow | null>(null)

  if (activeFlow) {
    return (
      <FlowEngine flow={activeFlow} onExit={() => setActiveFlow(null)} />
    )
  }

  return <FlowList flows={allFlows} onSelect={setActiveFlow} />
}
