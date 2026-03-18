# Weave Fabric Forms

## Project Overview
Multi-flow form engine for the Weave Fabric AI assistant. Collects user profile data across 15+ structured onboarding flows (131+ screens) to build personalized memory profiles. Zero runtime dependencies beyond React 19.

## Tech Stack
- React 19.1.0 + TypeScript 5.8.3 (strict mode)
- Vite 6.3.5 (build tool)
- Pure CSS with custom properties (no CSS frameworks)
- Mobile-first design (430px max-width, iPhone form factor)

## Commands
- `npm run dev` — Start dev server with HMR
- `npm run build` — Type-check (`tsc -b`) + Vite build to `dist/`
- `npm run preview` — Preview production build

## Architecture
```
App (state: activeFlow)
├── FlowList (grid of flows)
└── FlowEngine (orchestrates screen navigation)
    ├── NavBar (category title + back)
    ├── ProgressBar (segmented, main screens only)
    ├── ScreenRenderer (switches on screen.type)
    │   └── Screen components (one per type)
    └── BottomNav (Done · Skip · Next)
```

## Key Files
- `src/types.ts` — Core type definitions (ScreenType, Flow, FlowScreen, Answer)
- `src/data/flows.ts` — All flow definitions
- `src/components/FlowEngine.tsx` — Main orchestration engine
- `src/components/screens/` — Screen type components
- `src/App.css` — Complete design system

## Screen Types
intro, text-input, multi-input, multi-select, single-select, binary-choice, checkbox, number-stepper

## Design Tokens
- Brand: `--bg: #EF3B3B`, `--card: #E63535`
- Text: `--text-primary: #FFFFFF`, `--text-secondary: rgba(255,255,255,0.55)`
- Font: Inter (Google Fonts), weights 400-800

## Conventions
- All state management via React hooks (no external state library)
- Memory tags (`memoryTags` on screens) provide semantic labels for backend integration
- Sub-screens share progress counter with preceding main screen
- Skip rules enable conditional navigation (SkipRule: values[] → targetIndex)
- TypeScript strict mode — all code must pass `tsc -b`
- Zero external runtime dependencies beyond React 19
- Pure CSS only — no CSS frameworks, no CSS-in-JS
- Mobile-first — all layouts target 430px max-width

## Verification Requirements
Before ANY commit:
1. `npm run build` must pass with zero errors (this runs `tsc -b` + Vite)
2. If tests exist: `npx vitest run` must pass
3. No new TypeScript `any` types — use proper typing
4. No console.log left in committed code

## Context Preservation (for compaction)
When context is compacted, always preserve:
- The current improvement being worked on
- Which items from loop-prompts.md are already completed (check git log)
- Any build errors encountered and their fixes
- The file(s) currently being modified

## Self-Improving Loop Prompts
See `loop-prompts.md` for automated improvement prompts designed to run with `/loop`.
