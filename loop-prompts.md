# Self-Improving Loop Prompts for Weave Fabric Forms

Automated improvement prompts designed for Claude Code's `/loop` command. Built on 2026 best practices: verification-first design, compaction awareness, narrow scope, and deterministic hooks.

---

## Quick Start

**Run the main improvement loop (recommended):**
```
/loop 10m Read CLAUDE.md for project context. Run git log --oneline -30 to see what's already been done. Pick the NEXT unfinished item from loop-prompts.md Section 1 "Feature Backlog" (skip items whose git log messages indicate completion). Implement ONE item. Run npm run build — if it fails, fix until it passes. Commit with a descriptive message and push to the current branch. If ALL items are done, pick from Section 2 instead.
```

**Run a specialized loop alongside it:**
```
/loop 20m Read CLAUDE.md. Check git log --oneline -20. Pick the next unfinished item from loop-prompts.md Section 3 "New Flows". Design and implement ONE new flow in src/data/flows.ts following existing patterns. Run npm run build. Commit and push.
```

---

## How These Prompts Are Designed

Each prompt follows the **Verify → Assess → Act → Verify → Commit** pattern:

1. **Verify context** — Read CLAUDE.md, check git log (survives compaction)
2. **Assess state** — Determine what's already done via commit messages
3. **Act** — Implement exactly ONE focused change
4. **Verify** — `npm run build` must pass with zero errors
5. **Commit & push** — Clear message describing the change

Key principles:
- **One change per cycle** — small, reviewable, git-bisectable commits
- **Idempotent** — safe to re-run; checks git log to skip completed work
- **Compaction-safe** — reads CLAUDE.md fresh each cycle (no reliance on conversation memory)
- **Fail-safe** — if build fails, fix it; if fix fails 3 times, skip and move to next item

---

## Section 1: Feature Backlog (Priority Order)

These are the core improvements, ordered by impact. The main `/loop` prompt works through this list sequentially.

### Priority A — Core Infrastructure
1. **localStorage persistence** — Save answers per flow to localStorage so users can resume incomplete flows. Use a `useLocalStorage` hook. Key format: `weave-flow-{flowId}`.
2. **Flow completion tracking** — Track completed flows in localStorage. Show a checkmark overlay on completed flow cards in FlowList. Add a `completedFlows` state to App.
3. **Data export** — Add an `exportFlowData()` utility that serializes all answers with their memoryTags into a structured JSON payload. Wire it to the completion screen as a "Copy to clipboard" action.
4. **Input validation** — Add optional `validation` config to FlowScreen (required, minLength, maxLength, pattern). Show inline error messages. Disable Next when invalid.
5. **Keyboard navigation** — Enter advances to next screen, Escape goes back. Arrow keys navigate options in select screens. Tab focuses interactive elements.

### Priority B — New Screen Types
6. **DatePickerScreen** — Three-column scroll selector for month/day/year. Add `'date-picker'` to ScreenType union. Create `src/components/screens/DatePickerScreen.tsx`. Wire into ScreenRenderer.
7. **SliderScreen** — Range slider with min/max/step labels. Add `'slider'` to ScreenType. Add `min`, `max`, `step` optional fields to FlowScreen type.
8. **RankingScreen** — Draggable list for ordering preferences. Add `'ranking'` to ScreenType. Use touch events for mobile drag-and-drop (no library).
9. **TagInputScreen** — Free-form tag chips with autocomplete suggestions. Add `'tag-input'` to ScreenType. Enter/comma creates new tag.
10. **ImageSelectScreen** — Grid of image cards with labels. Add `'image-select'` to ScreenType. Add optional `imageUrl` to options.

### Priority C — UX Enhancements
11. **Directional transitions** — Slide left when advancing, slide right when going back. Track direction in FlowEngine state. Use CSS `@keyframes` only.
12. **Character count** — Show "X/Y characters" on text-input screens when maxLength is set. Subtle counter below the input.
13. **Progress summary on FlowList** — Show "X of Y answered" on each flow card using localStorage data. Add an overall progress bar at the top of FlowList.
14. **Search & filter on FlowList** — Sticky search bar at top of FlowList. Filter flows by title and category as user types. CSS-only show/hide animation.
15. **Dark mode** — Toggle button on FlowList. Store preference in localStorage. Swap CSS custom properties via `[data-theme="dark"]` on root element. Dark palette: bg #1A1A2E, card #16213E, accent #E94560.
16. **Undo toast** — After advancing, show a brief "Undo" toast (3s) that lets the user revert to previous screen with their answer restored.

### Priority D — Code Quality & Robustness
17. **Error boundary** — Create `ErrorBoundary.tsx` wrapping FlowEngine. Show friendly "Something went wrong" UI with "Back to flows" button. Log error details to console.
18. **Component extraction** — Extract NavBar, ProgressBar, BottomNav from FlowEngine.tsx into `src/components/NavBar.tsx`, `ProgressBar.tsx`, `BottomNav.tsx`. Update imports.
19. **ARIA accessibility** — Add aria-label to icon buttons, role="progressbar" to ProgressBar, aria-live="polite" to screen content area, proper form labels on inputs.
20. **prefers-reduced-motion** — Add `@media (prefers-reduced-motion: reduce)` that disables all animations and transitions. Respect user's OS setting.

---

## Section 2: Extended Improvements

Work through these after Section 1 is complete.

21. **React.lazy + Suspense** — Lazy-load screen components for better initial bundle size. Add a minimal loading spinner.
22. **useFlowNavigation hook** — Extract all navigation logic (next, back, skip, getNextIndex) from FlowEngine into a custom hook.
23. **Haptic feedback** — Call `navigator.vibrate(10)` on chip select, button press, and screen transitions. Feature-detect first.
24. **Long-press stepper** — NumberStepperScreen increments/decrements rapidly when button is held. Use `setInterval` on pointerdown, clear on pointerup.
25. **Swipe gestures** — Touch swipe left = next, swipe right = back. Use `touchstart`/`touchend` delta detection. Min 50px threshold.
26. **Completion confetti** — CSS-only confetti animation on the completion screen. Use `@keyframes` with pseudo-elements.
27. **Flow categories grouping** — Group flows by category on FlowList with collapsible section headers.
28. **Animated checkmark** — SVG stroke animation on the completion screen checkmark icon.
29. **Focus indicators** — Add `:focus-visible` outlines on all interactive elements. Use brand color with 2px offset.
30. **Screen reader progress** — Add visually-hidden text "Step X of Y" alongside the visual progress bar.

---

## Section 3: New Onboarding Flows

Each flow should have 6-10 screens, an intro screen, memoryTags on all data screens, and skip rules where natural.

31. **"your-goals"** — Goals & Aspirations: life goals, bucket list, 5-year plan, current priorities, what success means
32. **"daily-routine"** — Daily Routine: wake time, morning habits, work hours, lunch preferences, evening wind-down, sleep schedule
33. **"social-life"** — Social Life: introvert/extrovert scale, ideal weekend, how you make friends, social media usage, group size preference
34. **"learning-growth"** — Learning & Growth: learning style, current courses/books, skills to develop, knowledge gaps, mentors
35. **"creativity"** — Creativity & Expression: creative outlets, instruments played, writing habits, art preferences, creative goals
36. **"pets-animals"** — Pets & Animals (detailed): pet names and breeds, care routine, vet preferences, pet food brands, animal causes
37. **"spirituality"** — Spirituality & Mindfulness: meditation practice, spiritual traditions, gratitude habits, mindfulness tools, retreat interest
38. **"sports-fitness"** — Sports & Fitness: favorite sports, workout routine, fitness goals, teams supported, sports to try
39. **"music-taste"** — Music Taste: top genres, favorite artists, instruments, concert frequency, playlist style, music discovery method
40. **"tech-gadgets"** — Tech & Gadgets: devices owned, OS preference, favorite apps, smart home setup, tech wishlist

---

## Section 4: Testing (Run Separately)

```
/loop 20m Read CLAUDE.md. Check if vitest is in package.json. If not: install vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom as dev deps, add test config to vite.config.ts, create src/test-setup.ts, add "test" script to package.json. If vitest exists: check git log for test files already written, then write the next missing test from this list — FlowEngine navigation forward/back/skip, skip rules routing, completion screen, ProgressBar step count, TextInputScreen, MultiSelectScreen, SingleSelectScreen, BinaryChoiceScreen, NumberStepperScreen, FlowList rendering and selection. Run npm run build && npx vitest run. Commit and push.
```

---

## Hooks Setup (Optional — Recommended)

Add to `.claude/settings.json` for deterministic enforcement alongside loops:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Remember: run npm run build before committing. TypeScript strict mode — no errors allowed.'"
          }
        ]
      }
    ]
  }
}
```

This reminds Claude to verify after every file edit — a safety net for the autonomous loops.

---

## Tips for Running Loops

### Recommended: Single focused loop
```
/loop 10m <main loop prompt>
```
One loop at 10-minute intervals produces ~6 commits/hour. Over 8 hours that's ~48 improvements.

### Intensive: Parallel specialized loops
```
/loop 10m <Section 1 feature backlog prompt>
/loop 15m <Section 3 new flows prompt>
/loop 20m <Section 4 testing prompt>
```
Stagger intervals so they don't collide. Each checks git log independently.

### Monitoring
Ask Claude anytime:
```
what scheduled tasks do I have?
```
```
cancel the deploy check job
```

### Important Notes
- **Session-scoped**: Loops stop when you close the terminal. Use Desktop Scheduled Tasks for overnight/multi-day runs.
- **3-day expiry**: Recurring tasks auto-delete after 3 days. Recreate if needed.
- **Compaction-safe**: Prompts read CLAUDE.md fresh each cycle — they don't rely on conversation memory.
- **Cost**: Each 10-minute cycle consumes API tokens. Monitor usage for long sessions.
