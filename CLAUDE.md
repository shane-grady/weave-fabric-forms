# Weave Fabric Forms

## Project Overview
Multi-flow form engine for the Weave Fabric AI assistant. Collects user profile data across 15 structured onboarding flows (131 screens) to build personalized memory profiles. Zero runtime dependencies beyond React 19.

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
├── FlowList (grid of 15 flows)
└── FlowEngine (orchestrates screen navigation)
    ├── NavBar (category title + back)
    ├── ProgressBar (segmented, main screens only)
    ├── ScreenRenderer (switches on screen.type)
    │   └── 8 screen components
    └── BottomNav (Done · Skip · Next)
```

## Key Files
- `src/types.ts` — Core type definitions (ScreenType, Flow, FlowScreen, Answer)
- `src/data/flows.ts` — All 15 flow definitions (1265 lines)
- `src/components/FlowEngine.tsx` — Main orchestration engine
- `src/components/screens/` — 8 screen type components
- `src/App.css` — Complete design system (809 lines)

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
- No test framework configured yet

## Self-Improving Loop Prompts
See `loop-prompts.md` for automated improvement prompts designed to run with `/loop`.
