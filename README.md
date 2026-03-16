# Weave Fabric Forms

Multi-flow form engine for the Weave Fabric AI assistant — collects user profile data across 15 structured flows to build personalized memory.

- **15 onboarding flows** covering identity, work, lifestyle, preferences, and more
- **8 reusable screen types** with skip logic and conditional navigation
- **Mobile-first design** optimized for a 430px phone form factor
- **Zero runtime dependencies** beyond React 19

---

## Tech Stack

| Category  | Technology     | Version        |
| --------- | -------------- | -------------- |
| Framework | React          | 19.1.0         |
| Language  | TypeScript     | 5.8.3 (strict) |
| Build     | Vite           | 6.3.5          |
| Styling   | Pure CSS       | Custom props   |
| Font      | Inter          | 400–800        |

No state management library, no CSS framework, no router. The entire app is self-contained.

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone <repo-url>
cd weave-fabric-forms
npm install
npm run dev
```

### Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR           |
| `npm run build`     | Type-check with `tsc`, then build for production |
| `npm run preview`   | Preview the production build locally     |

---

## Project Structure

```
weave-fabric-forms/
├── src/
│   ├── main.tsx                     # Entry point — renders <App /> in StrictMode
│   ├── App.tsx                      # Root — routes between FlowList and FlowEngine
│   ├── App.css                      # Design system (CSS custom properties)
│   ├── types.ts                     # TypeScript interfaces
│   ├── vite-env.d.ts                # Vite client types
│   ├── data/
│   │   └── flows.ts                 # All 15 flow definitions
│   └── components/
│       ├── FlowList.tsx             # Landing page — grid of flow cards
│       ├── FlowEngine.tsx           # Core engine — state, navigation, skip logic
│       └── screens/
│           ├── IntroScreen.tsx      # Flow introduction
│           ├── TextInputScreen.tsx   # Free-text textarea
│           ├── MultiInputScreen.tsx  # Multiple labeled text fields
│           ├── MultiSelectScreen.tsx # Chip-based multi-select
│           ├── SingleSelectScreen.tsx# Radio-style single select
│           ├── BinaryChoiceScreen.tsx# Yes / No buttons
│           ├── CheckboxScreen.tsx   # Checkbox list
│           └── NumberStepperScreen.tsx # +/− numeric stepper
├── index.html                       # HTML shell with PWA meta tags
├── package.json
├── tsconfig.json                    # Strict mode, ES2020 target
├── vite.config.ts                   # React plugin
└── .gitignore
```

---

## Architecture

### Component Hierarchy

```
App
├── FlowList                  (when no flow is active)
│   └── flow cards            one per flow in allFlows
│
└── FlowEngine                (when a flow is active)
    ├── NavBar                category title + back button
    ├── ProgressBar           segmented bar + step counter
    ├── ScreenRenderer        switches on screen.type
    │   └── <Screen>          one of the 8 screen components
    └── BottomNav             Done · Skip · Next
```

### Data Flow

1. `App` holds `activeFlow: Flow | null` in state.
2. `FlowList` renders a card for each flow. Tapping a card calls `onSelect(flow)`.
3. `FlowEngine` initializes with `currentIndex = 0` and `answers: Record<number, Answer> = {}`.
4. `ScreenRenderer` reads `screen.type` and renders the matching screen component, passing `value` and `onChange`.
5. On **Next**, `FlowEngine` evaluates skip rules, advances the index, and re-renders.

### Skip Logic

Each screen can define `skipRules`:

```typescript
skipRules: [
  { values: ['No'], targetIndex: 8 }
]
```

When the user's answer matches a value in `values`, navigation jumps to `targetIndex` instead of `currentIndex + 1`. All sub-screens between are skipped.

### Sub-Screens and Progress

Screens with `isSubScreen: true` are conditional detail screens that don't increment the progress counter. The progress bar shows only main screen count — sub-screens share the step number of the preceding main screen.

---

## Type Reference

All types are defined in `src/types.ts`:

```typescript
type ScreenType =
  | 'intro'
  | 'multi-select'
  | 'single-select'
  | 'binary-choice'
  | 'text-input'
  | 'multi-input'
  | 'checkbox'
  | 'number-stepper'

interface Field {
  label: string
  placeholder: string
}

interface SkipRule {
  values: string[]
  targetIndex: number
}

interface FlowScreen {
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

interface Flow {
  id: string
  title: string
  category: string
  introCopy: string
  icon: string
  screens: FlowScreen[]
}

type Answer = string | string[] | number | null
```

### Screen Type → Answer Shape

| Screen Type      | Answer Type          | `options` | `fields` | `placeholder` |
| ---------------- | -------------------- | --------- | --------- | ------------- |
| `intro`          | *(none)*             | —         | —         | —             |
| `text-input`     | `string`             | —         | —         | Yes           |
| `multi-input`    | `string[]`           | —         | Yes       | —             |
| `multi-select`   | `string[]`           | Yes       | —         | —             |
| `single-select`  | `string`             | Yes       | —         | —             |
| `binary-choice`  | `string` (Yes / No)  | —         | —         | —             |
| `checkbox`       | `string[]`           | Yes       | —         | —             |
| `number-stepper` | `number`             | —         | —         | —             |

---

## Flows

15 flows defined in `src/data/flows.ts`:

| #  | ID                     | Title                | Category                       | Screens |
| -- | ---------------------- | -------------------- | ------------------------------ | ------- |
| 1  | `about-you`            | About You            | Identity & Personal Profile    | 13      |
| 2  | `your-work`            | Your Work            | Professional Context           | 13      |
| 3  | `how-you-communicate`  | How You Communicate  | Communication Style            | 8       |
| 4  | `your-people`          | Your People          | Relationships & People         | 8       |
| 5  | `food-dining`          | Food & Dining        | Preferences — Food             | 7       |
| 6  | `travel`               | Travel               | Preferences — Travel           | 6       |
| 7  | `entertainment`        | Entertainment        | Preferences — Entertainment    | 8       |
| 8  | `shopping-hobbies`     | Shopping & Hobbies   | Preferences — Shopping         | 7       |
| 9  | `money-finances`       | Money & Finances     | Financial Context              | 8       |
| 10 | `health-wellness`      | Health & Wellness    | Health & Wellness              | 11      |
| 11 | `what-you-know`        | What You Know        | Knowledge & Expertise          | 7       |
| 12 | `what-matters`         | What Matters to You  | Values & Beliefs               | 7       |
| 13 | `digital-life`         | Your Digital Life    | Digital Life & Tools           | 11      |
| 14 | `your-space`           | Your Space           | Home & Environment             | 7       |
| 15 | `important-stuff`      | Your Important Stuff | Documents & Records            | 10      |

**Total: 131 screens across 15 flows.**

---

## Adding a New Flow

1. Define a `Flow` object in `src/data/flows.ts`:

```typescript
const myFlow: Flow = {
  id: 'my-flow',
  title: 'My Flow',
  category: 'My Category',
  introCopy: 'A short description shown on the card and intro screen.',
  icon: '🎯',
  screens: [
    {
      type: 'intro',
      question: 'My Flow',
      introCopy: 'A short description shown on the intro screen.',
    },
    {
      type: 'text-input',
      question: 'What is your favorite color?',
      placeholder: 'Blue, green, ...',
      memoryTags: ['#favorite-color'],
    },
    {
      type: 'binary-choice',
      question: 'Do you like patterns?',
      memoryTags: ['#likes-patterns'],
      skipRules: [{ values: ['No'], targetIndex: 4 }],
    },
    {
      type: 'multi-select',
      question: 'Which patterns?',
      options: ['Stripes', 'Polka dots', 'Plaid', 'Floral'],
      memoryTags: ['#pattern-preferences'],
      isSubScreen: true,
    },
    {
      type: 'text-input',
      question: 'Anything else about your style?',
      placeholder: 'I tend to prefer...',
      memoryTags: ['#style-notes'],
    },
  ],
}
```

2. Add it to the `allFlows` export array at the bottom of the file.

3. Add an icon mapping in `FlowList.tsx`:

```typescript
const FLOW_ICONS: Record<string, string> = {
  // ...existing entries
  'my-flow': '🎯',
}
```

---

## Adding a New Screen Type

1. **Add the type** to `ScreenType` in `src/types.ts`:

```typescript
export type ScreenType =
  | 'intro'
  // ...existing types
  | 'my-new-type'
```

2. **Create the component** in `src/components/screens/`:

```typescript
// src/components/screens/MyNewScreen.tsx
import type { FlowScreen, Answer } from '../../types'

export default function MyNewScreen({
  screen,
  value,
  onChange,
}: {
  screen: FlowScreen
  value: Answer
  onChange: (v: Answer) => void
}) {
  // Render your screen UI here
}
```

3. **Register in ScreenRenderer** — add the import and `case` in `FlowEngine.tsx`:

```typescript
case 'my-new-type':
  return <MyNewScreen screen={screen} value={value} onChange={onChange} />
```

4. **Extend `FlowScreen`** if your screen type needs new fields in `types.ts`.

5. **Add styles** to `src/App.css`.

---

## Memory Tags

Each screen can define `memoryTags` — semantic labels that identify what data the screen collects:

```typescript
{
  type: 'text-input',
  question: "When's your birthday?",
  placeholder: 'March 14, 1990',
  memoryTags: ['#birthday'],
}
```

Tags like `#full-name`, `#job-title`, `#languages`, and `#dietary-restrictions` form a contract between the form engine and any backend memory system. The front-end defines these tags but does not consume them — they are designed for integration with Weave Fabric's memory layer.

---

## Design System

All design tokens live as CSS custom properties in `src/App.css`.

### Colors

| Token                 | Value                          | Usage                |
| --------------------- | ------------------------------ | -------------------- |
| `--bg`                | `#EF3B3B`                      | Brand red background |
| `--card`              | `#E63535`                      | Card surface         |
| `--text-primary`      | `#FFFFFF`                      | Primary text         |
| `--text-secondary`    | `rgba(255, 255, 255, 0.55)`   | Secondary text       |
| `--chip`              | `rgba(0, 0, 0, 0.13)`         | Unselected chip      |
| `--chip-selected`     | `#FFF5F0`                      | Selected chip        |
| `--btn-next`          | `#2A1414`                      | Next button          |
| `--input-bg`          | `rgba(255, 230, 220, 0.25)`   | Input background     |
| `--progress-filled`   | `#3D1515`                      | Filled progress bar  |

### Layout

- **Max-width:** 430px (phone form factor)
- **Viewport:** `viewport-fit=cover`, `user-scalable=no`
- **Safe areas:** `env(safe-area-inset-*)` support for notched devices

### Border Radii

| Token             | Value  |
| ----------------- | ------ |
| `--radius-card`   | 24px   |
| `--radius-chip`   | 26px   |
| `--radius-btn`    | 999px  |
| `--radius-input`  | 16px   |

### Typography

**Font:** Inter via Google Fonts, with system fallbacks (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`). Weights 400 through 800.

### Animations

Screen transitions use a `screenIn` keyframe (0.25s ease-out). Buttons use `scale(0.97)` press feedback via `:active`.

---

## Build & Deployment

```bash
npm run build     # outputs to dist/
```

The build runs `tsc -b` (type-check) then `vite build` (bundle and optimize). Output is a static SPA in `dist/` — deploy to any static host: Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc.

PWA meta tags are already configured in `index.html`:
- `apple-mobile-web-app-capable`
- `theme-color: #EF3B3B`
- `viewport-fit=cover`

---

## License

Private. This project is not currently licensed for public distribution.
