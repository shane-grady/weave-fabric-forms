# Self-Improving Loop Prompts for Weave Fabric Forms

These prompts are designed to run with `/loop` in Claude Code to continuously improve and expand the Weave Fabric Forms project. Each prompt is self-contained and idempotent — Claude will analyze the current state, pick the next improvement, implement it, verify it builds, and commit.

---

## How to Use

Copy any prompt below and run it with `/loop` at your desired interval:

```
/loop 30m <paste prompt here>
```

Or run a one-shot improvement:

```
<paste prompt here>
```

---

## 1. Daily Feature Builder (Recommended — Main Loop)

```
You are the self-improving engine for weave-fabric-forms. Your job is to pick ONE meaningful improvement, implement it, verify it builds with `npm run build`, commit, and push.

STEP 1 — Assess current state:
- Read CLAUDE.md, loop-prompts.md, and src/types.ts
- Scan src/components/ and src/data/flows.ts for what exists
- Check git log for recent improvements already made (avoid duplicates)

STEP 2 — Pick the NEXT improvement from this priority list (skip any already done):

Priority A — Core Missing Features:
1. localStorage persistence: save/restore answers per flow so users can resume
2. Flow completion tracking: track which flows are done, show checkmarks on FlowList
3. Data export: serialize all answers + memoryTags into a JSON payload for backend
4. Input validation: required fields, min/max length, format patterns
5. Keyboard navigation: Enter to advance, Escape to go back, tab focus management

Priority B — New Screen Types:
6. DatePickerScreen: month/day/year selector for birthdays, dates
7. SliderScreen: range slider with min/max/step for numeric preferences
8. RankingScreen: drag-to-reorder list for ranking preferences
9. ImageSelectScreen: grid of image cards for visual preference selection
10. TagInputScreen: free-form tag entry with suggestions (for skills, interests)

Priority C — UX Enhancements:
11. Search/filter on FlowList page
12. Animated transitions between screens (slide left/right based on direction)
13. Haptic feedback patterns for mobile (navigator.vibrate)
14. Progress summary: show answered vs total across all flows on landing page
15. Dark mode toggle with CSS custom property swap
16. Undo last answer (brief toast with undo button after advancing)

Priority D — Code Quality:
17. Add Vitest + React Testing Library, write tests for FlowEngine navigation logic
18. Add ARIA labels and roles for screen reader accessibility
19. Error boundary component wrapping FlowEngine
20. Performance: React.lazy + Suspense for screen components

STEP 3 — Implement the chosen improvement:
- Keep changes minimal and focused on ONE item
- Follow existing code style (React hooks, pure CSS, TypeScript strict)
- Update types.ts if adding new screen types
- Update CLAUDE.md if the architecture changes

STEP 4 — Verify:
- Run `npm run build` — must pass with zero errors
- If build fails, fix the errors before committing

STEP 5 — Commit and push:
- Commit with a clear message describing what was added/changed
- Push to the current branch
```

---

## 2. New Flow Creator

```
You are a flow creator for weave-fabric-forms. Your job is to design and add ONE new onboarding flow.

STEP 1 — Check what flows already exist:
- Read src/data/flows.ts to see all current flow IDs and categories
- Check git log for recently added flows (avoid duplicates)

STEP 2 — Pick the next flow to create from this list (skip any already done):
1. "your-goals" — Goals & Aspirations (life goals, bucket list, 5-year plan, current priorities)
2. "daily-routine" — Daily Routine (wake time, morning habits, work schedule, evening wind-down)
3. "social-life" — Social Life (introvert/extrovert, ideal weekend, social media usage, friend groups)
4. "learning-growth" — Learning & Growth (learning style, current courses, skills wanted, books reading)
5. "creativity" — Creativity & Expression (creative outlets, instruments, writing, art preferences)
6. "pets-animals" — Pets & Animals (current pets detail, dream pets, animal causes, pet care style)
7. "spirituality" — Spirituality & Mindfulness (meditation, spiritual practices, gratitude habits)
8. "sports-fitness" — Sports & Fitness (favorite sports, workout routine, fitness goals, teams)
9. "music-taste" — Music Taste (genres, artists, instruments, concert preferences, playlists)
10. "tech-gadgets" — Tech & Gadgets (devices, OS preference, favorite apps, smart home setup)

STEP 3 — Design the flow:
- Create 6-10 screens using existing screen types
- Include an intro screen with icon and description
- Use appropriate screen types (text-input, multi-select, single-select, binary-choice, etc.)
- Add skip rules for conditional sub-screens where natural
- Include memoryTags on every data-collecting screen
- Follow the pattern and tone of existing flows

STEP 4 — Implement:
- Add the new flow to src/data/flows.ts in the allFlows array
- Follow existing code style exactly

STEP 5 — Verify and commit:
- Run `npm run build` — must pass
- Commit with message like "Add [flow-name] onboarding flow"
- Push to current branch
```

---

## 3. UX Polish Loop

```
You are a UX polisher for weave-fabric-forms. Your job is to find and fix ONE UX issue or add ONE small polish improvement.

STEP 1 — Audit the current UX:
- Read src/App.css, src/components/FlowEngine.tsx, and all screen components
- Check git log for recent UX improvements

STEP 2 — Pick ONE improvement (skip already done):
1. Add smooth directional slide animations (left when advancing, right when going back)
2. Add subtle press/active states to all interactive elements
3. Add a "shake" animation on validation errors
4. Improve the completion screen with confetti or animated checkmark
5. Add loading skeleton on FlowList while flows initialize
6. Add character count indicator on text-input screens
7. Add "X of Y answered" subtitle per flow card on FlowList
8. Add subtle gradient overlays on scroll overflow areas
9. Improve chip wrapping and spacing on multi-select screens
10. Add a "clear selection" button on multi-select and single-select screens
11. Add micro-interactions: scale bounce on chip select, fade on skip
12. Improve number-stepper with long-press to increment/decrement rapidly
13. Add swipe gestures for next/back navigation on mobile
14. Add a subtle parallax effect on the intro screen icon
15. Smooth scroll to top on screen transitions

STEP 3 — Implement with pure CSS + minimal JS. Keep changes small and focused.

STEP 4 — Verify build passes with `npm run build`.

STEP 5 — Commit and push with a descriptive message.
```

---

## 4. Accessibility Improver

```
You are an accessibility specialist for weave-fabric-forms. Your job is to find and fix ONE accessibility issue.

STEP 1 — Audit accessibility:
- Read all screen components in src/components/screens/
- Read FlowEngine.tsx for navigation and focus management
- Check git log for recent a11y fixes

STEP 2 — Pick ONE improvement (skip already done):
1. Add aria-label to all icon-only buttons (back button, next arrow)
2. Add role="progressbar" with aria-valuenow/max to ProgressBar
3. Add aria-live="polite" region for screen transitions so screen readers announce new content
4. Add proper fieldset/legend grouping for multi-select and single-select options
5. Add focus management: auto-focus first input when screen transitions
6. Add keyboard support: Enter to select chips, Space for checkboxes
7. Add skip-to-content link for keyboard users
8. Add aria-selected/aria-checked states to chips and checkboxes
9. Add proper heading hierarchy (h1 for question, h2 for subtitle)
10. Add visible focus indicators (focus-visible outlines) for keyboard navigation
11. Add aria-describedby linking subtitles to their questions
12. Add prefers-reduced-motion media query to disable animations
13. Ensure color contrast meets WCAG AA (check text-secondary opacity)
14. Add proper form labels for all text inputs
15. Add screen reader only text for progress ("Step 3 of 12")

STEP 3 — Implement the fix. Follow WAI-ARIA best practices.

STEP 4 — Verify build passes with `npm run build`.

STEP 5 — Commit and push.
```

---

## 5. Test Writer

```
You are a test engineer for weave-fabric-forms. Your job is to add or expand the test suite.

STEP 1 — Check current test state:
- Look for any test files (*.test.ts, *.test.tsx, *.spec.ts)
- Check if Vitest is configured in package.json/vite.config.ts
- Check git log for recent test additions

STEP 2 — If no test framework exists yet:
- Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom as dev dependencies
- Configure vitest in vite.config.ts
- Create a test setup file

STEP 3 — If framework exists, pick the next test to write (skip already done):
1. FlowEngine: test forward navigation advances screen index
2. FlowEngine: test back navigation decreases screen index
3. FlowEngine: test skip logic jumps past sub-screens
4. FlowEngine: test skip rules route to correct targetIndex
5. FlowEngine: test completion screen renders at end of flow
6. FlowEngine: test progress bar shows correct step count
7. TextInputScreen: test value changes on input
8. MultiSelectScreen: test toggling options on/off
9. SingleSelectScreen: test selecting one option deselects others
10. BinaryChoiceScreen: test yes/no selection
11. NumberStepperScreen: test increment/decrement
12. FlowList: test rendering all flows
13. FlowList: test selecting a flow calls onSelect
14. Integration: test completing a full short flow end-to-end

STEP 4 — Write the test. Use React Testing Library idioms (getByRole, userEvent).

STEP 5 — Run `npm run build` and `npx vitest run` — both must pass.

STEP 6 — Commit and push.
```

---

## 6. Code Quality & Refactoring

```
You are a code quality engineer for weave-fabric-forms. Your job is to find and fix ONE code quality issue.

STEP 1 — Audit the codebase:
- Read FlowEngine.tsx, App.tsx, types.ts, and screen components
- Check git log for recent refactors

STEP 2 — Pick ONE improvement (skip already done):
1. Extract NavBar, ProgressBar, BottomNav from FlowEngine.tsx into separate files
2. Create a useFlowNavigation custom hook extracting navigation logic from FlowEngine
3. Add an ErrorBoundary component wrapping FlowEngine with a friendly error UI
4. Create a useLocalStorage hook for persisting answers
5. Add React.memo to screen components to prevent unnecessary re-renders
6. Extract screen rendering logic into a screenRegistry map instead of switch statement
7. Add proper TypeScript discriminated unions for screen props (each type gets exact props)
8. Create a useKeyboardNavigation hook for Enter/Escape/Arrow key handling
9. Add CSS modules or scoped class naming to prevent style collisions
10. Extract animation logic into a useScreenTransition hook

STEP 3 — Implement the refactor. Ensure no behavior changes (pure refactor).

STEP 4 — Verify build passes with `npm run build`.

STEP 5 — Commit and push.
```

---

## 7. Documentation & DX Loop

```
You are a developer experience engineer for weave-fabric-forms. Your job is to improve ONE aspect of documentation or developer experience.

STEP 1 — Check current state of docs and DX tooling:
- Read CLAUDE.md, README.md, package.json
- Check for any linting, formatting, or pre-commit configs
- Check git log for recent DX improvements

STEP 2 — Pick ONE improvement (skip already done):
1. Add ESLint with recommended React + TypeScript rules
2. Add Prettier with consistent formatting config
3. Add a pre-commit hook (husky + lint-staged) for type-checking
4. Add npm scripts: "test", "lint", "format"
5. Add JSDoc comments to all exported types in types.ts
6. Add a CONTRIBUTING.md with development workflow
7. Add a storybook-like dev page that renders all screen types with sample data
8. Update CLAUDE.md with new features as they are added
9. Add a changelog or version tracking
10. Add GitHub issue templates for bug reports and feature requests

STEP 3 — Implement the improvement.

STEP 4 — Verify build passes with `npm run build`.

STEP 5 — Commit and push.
```

---

## Suggested Daily Schedule

Run these loops at staggered intervals for continuous improvement:

```
/loop 30m <Daily Feature Builder prompt>
```

This single loop is enough for most days — it systematically works through the priority list. For intensive improvement sessions, you can run multiple loops:

```
/loop 30m <Daily Feature Builder prompt>
/loop 1h <New Flow Creator prompt>
/loop 2h <UX Polish Loop prompt>
```

Each loop checks git log to avoid duplicate work, so they're safe to run concurrently.
