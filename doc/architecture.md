# CivicSeed — Architecture

> Part of the CivicSeed doc set. Related: [`implementation-plan.md`](./implementation-plan.md) ·
> [`data-model.md`](./data-model.md) · [`scoring-engine.md`](./scoring-engine.md) ·
> [`solutions-and-brief.md`](./solutions-and-brief.md). OKF mirror: [`docs/okf/architecture.md`](../docs/okf/architecture.md).

## 1. System overview

CivicSeed is a **100% client-side single-page app** that uses Next.js only for file-based routing
and code organization. Nothing leaves the browser.

```
Browser
┌────────────────────────────────────────────────────────────┐
│  Next.js App Router  (pages = client-rendered views)       │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React client components                              │  │
│  │  ui/ primitives · Stepper · ReadinessPanel           │  │
│  │  DefineStep · EvidenceEditor · SolutionPicker ·      │  │
│  │  BriefDocument · ProjectList                         │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │ calls (pure, deterministic)              │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │ lib/  (framework-free core)                          │  │
│  │  scoring.ts · brief.ts · solution-templates.ts       │  │
│  └──────────────▲───────────────────────────────────────┘  │
│                 │ reads / writes                            │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │ hooks/ useProject(id) · useProjects()                │  │
│  │  → storage.ts → localStorage["civicseed.projects.v1"]│  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

Two hard layers:
1. **`lib/`** — pure functions, no React, no DOM, no `Math.random`, no `Date.now()` in outputs.
   This is the part a student explains in the demo.
2. **`components/` + `hooks/`** — the only code allowed to touch React, the DOM, and
   `localStorage`.

## 2. Why "SPA" on the App Router (and how it stays correct)

- Next.js still SSRs initial HTML, so **no code may read `localStorage` during render**.
  All storage reads happen in `useEffect` behind a `mounted` flag; until then the UI renders a
  deterministic placeholder (empty states), so server and first client paint match.
- Pages are thin: `app/**/page.tsx` files just render one client component. Interactivity,
  forms, and navigation (`router.push`) all live in the client component.
- No `API routes`, no server actions, no `fetch`, no env vars anywhere.

## 3. Routing map

| Route | Purpose | Stepper step |
|---|---|---|
| `/` | Home: hero, continue draft, my projects, 5-step indicator, sample preview | — |
| `/project/[id]` | Redirects (client-side effect) to the project's saved `step` | — |
| `/project/[id]/define` | Step 1 — Define the problem | 1 |
| `/project/[id]/investigate` | Steps 2+3 — Stakeholders **and** Evidence on one screen (two sections) | 2, 3 |
| `/project/[id]/solutions` | Step 4 — Compare solutions | 4 |
| `/project/[id]/brief` | Step 5 — Policy brief (generate, edit, copy, print) | 5 |

The **five-step indicator** is: `Define → Stakeholders → Evidence → Solutions → Brief`. The
Investigate page intentionally covers two indicator steps (2 and 3); the stepper marks them by
content (stakeholders named / evidence added), not by URL.

## 4. State management

No global store. One project is edited per page:

- `useProjects()` — Home only. Returns `{ projects, create(), remove(id) }`. Reads the store once
  after mount; mutates via `storage.ts` and refreshes local state.
- `useProject(id)` — step pages. Loads the project after mount; returns
  `{ project, update(patch), ready }`. `update` merges a partial change, stamps `updatedAt`,
  writes through `storage.ts` (debounced ~300 ms), and updates React state.
- Derived values (`ReadinessReport`, brief sections, suggested solutions) are computed with
  `useMemo` from the project — **never stored**. If `lib/` functions are correct, there is no
  stale-state class of bug.

Data flow is strictly: `user input → update(patch) → state + localStorage → re-render →
recomputed score/brief`. There is no second copy of truth.

## 5. Pure logic core (the explainable part)

| Module | Signature | Responsibility |
|---|---|---|
| `lib/scoring.ts` | `scoreReadiness(p: Project): ReadinessReport` | 5 dimensions × 20 pts, explicit rubric, next-step hints |
| `lib/brief.ts` | `buildBrief(p: Project): BriefSection[]` + `briefToPlainText(p)` | 10-section brief from real answers; plain text for Copy |
| `lib/solution-templates.ts` | `suggestSolutions(category, description): SolutionOption[]` | 3 rule-based draft approaches; labeled starting points |
| `lib/sample-project.ts` | `makeSampleProject(): Project` | The preloaded lunch-line demo, clearly marked `isSample: true` |

## 6. Component tree (per screen)

```
RootLayout (wordmark nav, sprout logo, <Stepper> on project pages)
├── HomePage
│   ├── Hero (headline, tagline, "Plant your first idea")
│   ├── ContinueDraft (most recent project, or EmptyState)
│   ├── ProjectList (cards: title, updated, step, delete-with-confirm)
│   ├── StepIndicator (5 steps)
│   └── SampleProjectPreview (labeled "demonstration")
├── DefineStep
│   ├── ProjectTitleField · ProblemDescriptionField
│   ├── CategorySelect · WhoAffectedField
│   ├── ObservationsField · OpenQuestionsField
│   └── [ReadinessPanel] [NavButtons]
├── InvestigateStep
│   ├── StakeholderEditor (chips, add/remove)
│   ├── DecisionMakerField
│   ├── ResearchQuestions (checklist, add/remove, mark complete)
│   ├── EvidenceEditor (notes: kind toggle observation|verified|assumption, source title/URL)
│   └── AssumptionsEditor
├── SolutionsStep
│   ├── SolutionPicker → 3 × SolutionCard (select, edit, difficulty badge, why-chosen)
│   └── ImplementationStepsEditor + SuccessIndicatorsEditor + NextStepsEditor
└── BriefPage
    ├── BriefDocument (10 editable sections)
    ├── ReadinessPanel (final)
    └── Actions: Copy Brief · Print/Save as PDF · Back to Editing
```

`ReadinessPanel` is mounted on every step page, so the score updates live as students work.

## 7. Styling

- Single `globals.css`. Design tokens as CSS custom properties:
  `--color-forest: #173F35; --color-sage: #B7D7A8; --color-cream: #F7F3E9;
  --color-blue: #8CAFC1; --color-ink: #29352F; --color-paper: #FFFFFF;`
- Naming: BEM-lite (`.project-card__title--sample`). No utility framework.
- Print stylesheet (`@media print`) hides nav/stepper/panel and prints only the brief.
- Visual direction: generous whitespace, fine dividers, restrained palette, subtle transitions,
  serif headlines (`Georgia` stack), sans body (`Inter` stack). No neon gradients, no emoji nav,
  no over-rounded corners (≤ 8 px radii).

## 8. Sample project & empty states

- On first run (no storage key), `storage.ts` seeds exactly one project:
  *"Reducing School Lunch Wait Times"* (`isSample: true`), built by `makeSampleProject()`.
  Its stakeholder/solution content is the spec's hypothetical list, and every screen that shows
  it carries a "demonstration — hypothetical, not established fact" label.
- After the sample is deleted, the home shows a friendly empty state with the CTA.

## 9. Error handling & privacy

- `storage.load()`: missing key → empty store (then seed sample). Malformed JSON → park the raw
  string under `civicseed.projects.v1.corrupt-<ts>` and return a fresh store. Quota errors on
  save → non-blocking warning banner, app keeps working in memory.
- Every page handles "project id not found" with a back-to-home card, not a crash.
- Privacy: no network, no analytics; a footer line states data stays in the student's browser.
