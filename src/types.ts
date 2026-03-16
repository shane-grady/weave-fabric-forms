export type ScreenType =
  | 'intro'
  | 'multi-select'
  | 'single-select'
  | 'binary-choice'
  | 'text-input'
  | 'multi-input'
  | 'checkbox'
  | 'number-stepper'

export interface Field {
  label: string
  placeholder: string
}

export interface SkipRule {
  values: string[]
  targetIndex: number
}

export interface FlowScreen {
  type: ScreenType
  question: string
  subtitle?: string
  options?: string[]
  placeholder?: string
  fields?: Field[]
  memoryTags?: string[]
  introCopy?: string
  isSubScreen?: boolean
  skipRules?: SkipRule[]
}

export interface Flow {
  id: string
  title: string
  category: string
  introCopy: string
  icon: string
  screens: FlowScreen[]
}

export type Answer = string | string[] | number | null
