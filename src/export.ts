import type { Flow, Answer, FlowExport, MemoryEntry } from './types'

const MEMORIES_PREFIX = 'weave-memories-'

export function serializeFlow(
  flow: Flow,
  answers: Record<number, Answer>,
): FlowExport {
  const memories: MemoryEntry[] = []

  for (let i = 0; i < flow.screens.length; i++) {
    const screen = flow.screens[i]
    const answer = answers[i]
    if (!screen.memoryTags || answer == null) continue

    if (screen.type === 'multi-input' && Array.isArray(answer)) {
      screen.memoryTags.forEach((tag, idx) => {
        const val = answer[idx]
        if (val) memories.push({ tag, value: val, question: screen.question })
      })
    } else {
      for (const tag of screen.memoryTags) {
        memories.push({ tag, value: answer as string | string[] | number, question: screen.question })
      }
    }
  }

  return {
    flowId: flow.id,
    flowTitle: flow.title,
    completedAt: new Date().toISOString(),
    memories,
  }
}

export function saveFlowExport(data: FlowExport) {
  try {
    localStorage.setItem(MEMORIES_PREFIX + data.flowId, JSON.stringify(data))
  } catch {
    // Storage full — silently fail
  }
}

export function loadFlowExport(flowId: string): FlowExport | null {
  try {
    const raw = localStorage.getItem(MEMORIES_PREFIX + flowId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function loadAllExports(): FlowExport[] {
  const exports: FlowExport[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(MEMORIES_PREFIX)) {
      try {
        exports.push(JSON.parse(localStorage.getItem(key)!))
      } catch {
        // Skip corrupt entries
      }
    }
  }
  return exports
}
