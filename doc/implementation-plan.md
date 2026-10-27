# CivicSeed — Implementation Plan

Spec source: [`projectcivicseed.pdf`](./projectcivicseed.pdf) (congressional app challenge, due 9pm).
Companion docs: [`architecture.md`](./architecture.md), [`data-model.md`](./data-model.md), [`scoring-engine.md`](./scoring-engine.md), [`solutions-and-brief.md`](./solutions-and-brief.md), [`../code-style.md`](../code-style.md).

## 1. Goal

A polished, functional, responsive web app that guides high school students from a school/community
problem to an evidence-based, editable **policy brief**, plus a real (rule-based, 0–100) **Policy
Readiness Check**. It is a *real interactive prototype* — no static mockups, no dead buttons.

## 2. Key architectural decision: SPA on top of Next.js App Router

The spec bans backends, logins, paid APIs, and env vars. All data lives in the browser
(localStorage). Therefore:

| Constraint (spec) | Consequence |
|---|---|
| No backend / env vars / paid APIs | No API routes, no server data fetching, no server actions |
| Browser localStorage persistence | All reads/writes in client components, behind a `mounted` guard |
| "SPA" behavior in App Router | Every page renders a `"use client"` component; Next only provides file-based routing + code splitting |
| Must run in a constrained challenge environment | No build-time network needs (fonts via system stacks, not `next/font/google`) |

**Hydration-safe storage pattern (used everywhere):**

```tsx
const [ready, setReady] = useState(false);
useEffect(() => setReady(true), []);
// render empty/placeholder state until `ready`, then read localStorage
```

This prevents SSR/client HTML mismatches and React hydration warnings.

## 3. Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19, TypeScript `strict` | Spec requirement; scaffolded 2026-10-27 (see Phase 0) |
| Directory | `src/` layout, import alias `@/*` | Keeps app code separate from docs/tools |
| Styling | One clean global `globals.css` with CSS custom-property design tokens | Spec allows "CSS modules or a clean global CSS file"; global keeps it simple for a student to explain |
| Icons | `lucide-react` (fallback: small inline SVG set) | Spec: "Lucide icons, if available"; if the package can't be installed offline, inline SVGs |
| Fonts | System stacks: `Inter, system-ui, ...` body; `Georgia, "Iowan Old Style", ...` editorial serif for headlines | No network needed at build time; matches "Inter or a similar sans-serif" |
| State | React hooks + context-free data flow via `useProject(id)` / `useProjects()` | Simplest thing that works; no Redux |
| IDs | `crypto.randomUUID()` | Built-in, no dependency |
| Persistence | `localStorage`, versioned key `civicseed.projects.v1` | Spec requirement |
| Testing | Manual (completion checklist) — no test framework | Keeps footprint small; pure `lib/` functions are the testable core |

## 4. File map (target state)

```
CivicSeed/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout: metadata, global shell
│   │   ├── globals.css                # Design tokens + all global styles
│   │   ├── page.tsx                   # Home
│   │   └── project/[id]/
│   │       ├── page.tsx               # Redirects to the project's current step
│   │       ├── define/page.tsx        # Step 1 — Define the problem
│   │       ├── investigate/page.tsx   # Steps 2+3 — Stakeholders & Evidence
│   │       ├── solutions/page.tsx     # Step 4 — Compare solutions
│   │       └── brief/page.tsx         # Step 5 — Policy brief
│   ├── components/
│   │   ├── SproutLogo.tsx
│   │   ├── Stepper.tsx                # Five-step progress indicator
│   │   ├── ReadinessPanel.tsx         # Live score + dimension breakdown
│   │   ├── ui/                        # Button, TextField, TextArea, Select,
│   │   │                              # Card, SectionHeading, EmptyState, ConfirmDialog
│   │   ├── home/                      # Hero, ContinueDraft, ProjectList, SampleProject
│   │   ├── define/DefineStep.tsx
│   │   ├── investigate/               # EvidenceEditor, StakeholderEditor,
│   │   │                              # AssumptionsEditor, DecisionMakerField, ResearchQuestions
│   │   ├── solutions/                 # SolutionCard, SolutionPicker
│   │   └── brief/BriefDocument.tsx
│   ├── lib/                           # Pure, framework-free logic (the explainable core)
│   │   ├── types.ts                   # Project, EvidenceNote, SolutionOption, ReadinessReport…
│   │   ├── storage.ts                 # Versioned localStorage load/save/CRUD + error handling
│   │   ├── scoring.ts                 # scoreReadiness(project) → ReadinessReport (0–100)
│   │   ├── solution-templates.ts      # Rule-based 3-approach suggestions per category
│   │   ├── brief.ts                   # buildBrief(project) → BriefSection[] (+ plain text for Copy)
│   │   └── sample-project.ts          # The preloaded "Reducing School Lunch Wait Times" demo
│   └── hooks/
│       ├── useProject.ts              # Load one project by id, auto-save on change
│       └── useProjects.ts             # List/create/delete projects for Home
├── doc/                               # This documentation set (spec + architecture)
├── docs/okf/                          # OKF v0.2 knowledge bundle (see AGENTS.md)
├── tools/okf/okf.py                   # OKF CLI
├── code-style.md
└── AGENTS.md
```

## 5. Phases, in build order

> Spec priority rule: *"finish the scoring, persistence, and policy brief before adding
> decorative details."* Phases 2, 6, 7, 8 are the critical path.

### Phase 0 — Scaffold (≈30 min, do first)
`npx create-next-app@latest` with TypeScript, App Router, `src/` dir, no Tailwind, ESLint on,
alias `@/*`. If `create-next-app` refuses the non-empty repo, scaffold into a temp dir and copy
in (preserve `doc/`, `docs/`, `tools/`). Verify `npm run dev` serves a page.
- **Done when:** dev server runs, `npx tsc --noEmit` and `npm run build` pass on the empty app.

### Phase 1 — Design foundation
`globals.css` design tokens (forest green `#173F35`, sage `#B7D7A8`, cream `#F7F3E9`,
muted blue `#8CAFC1`, body text `#29352F`), root layout, `SproutLogo`, and the `ui/` primitives
(Button, fields, Card, headings, EmptyState, ConfirmDialog) with visible focus states.
**Also:** replace the scaffold's `next/font/google` (Geist) and CSS-module `page.tsx` with the
system-font global-CSS approach below — the Google font downloads at build time, which breaks
offline builds in the challenge environment.
- **Done when:** an unstyled-feature home shell renders; buttons/fields show clear focus rings;
  typography is editorial (serif headlines, sans body).

### Phase 2 — Data + persistence (critical path)
`lib/types.ts`, `lib/storage.ts` (versioned key, corrupt-JSON + quota handling, sample seeding),
`useProjects` / `useProject` with debounced auto-save.
- **Done when:** create → reload browser → project is still there → delete works with
  confirmation → corrupted localStorage doesn't crash the app.

### Phase 3 — Home screen
Wordmark + sprout, headline "Every big change starts somewhere.", "Plant your first idea",
Continue-draft section, My Projects list, five-step progress indicator, sample-project preview
clearly labeled as a demonstration.
- **Done when:** both empty state and populated state look right on desktop and mobile.

### Phase 4 — Step 1: Define the problem
Title, problem description, category select (7 options), "Who is affected?", "What have you
personally observed?", "What do you still need to find out?". Includes the lunch-line example.
- **Done when:** every field round-trips through localStorage; step advances via stepper.

### Phase 5 — Step 2/3: Investigate (stakeholders + evidence)
Evidence notes (add/remove, source title + URL, kind: **observation / verified / unverified
assumption** — visually distinguished), research-question checklist, stakeholder groups,
decision-maker field, assumptions list.
- **Done when:** the three note kinds are unmistakably different in the UI; nothing is presented
  as fact that the user didn't enter.

### Phase 6 — Step 4: Compare solutions (critical path)
Rule-based templates produce **three** approaches from category + description
(`solution-templates.ts`). Each shows action, benefits, limitations, difficulty (Low/Medium/High),
unintended consequences. User can select one, edit fields, and explain why. All suggestions are
labeled *"starting points that require research."*
- **Done when:** changing category re-suggests; edits persist; selection drives the brief.

### Phase 7 — Step 5: Policy brief (critical path)
`buildBrief()` assembles the 10 required sections **from the user's actual saved answers**
(empty fields get an honest "(not yet defined)" placeholder, never invented content). Editable
fields, **Copy Brief**, **Print / Save as PDF** via `window.print()` + print CSS, **Back to
Editing**. No language implying the proposal is approved/validated/proven.
- **Done when:** every section in the printed brief traces back to a user-entered value.

### Phase 8 — Policy Readiness Check (critical path)
`scoreReadiness()` — pure TS function, 5 dimensions × 20 points with **explicit rubric**
(see [`scoring-engine.md`](./scoring-engine.md)). `ReadinessPanel` shows total, per-dimension
scores, label ("Early draft" / "Developing proposal" / "Ready for further review"), and concrete
next steps. Recomputed via `useMemo` on every relevant change; disclaimer that the score does not
predict real-world outcomes.
- **Done when:** each of the spec's example triggers (better description, added sourced evidence,
  named stakeholders, decision-maker + steps, measurable indicator) measurably moves the score.

### Phase 9 — Responsive, accessible, polished
Mobile layouts (stepper → progress bar, cards stack), semantic HTML audit, contrast check,
`window.print` layout, remove all console errors/warnings.
- **Done when:** checklist items 7 and 8 pass.

### Phase 10 — Demo prep
Run the full completion checklist below, write the 2-minute demo script, and the short
"known limitations" list.
- **Done when:** checklist items 1–10 all ticked.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Hydration mismatch from localStorage | `mounted` guard pattern (Phase 1); never read storage during render |
| `create-next-app` / npm need network | Do Phase 0 first; fallback: hand-scaffold (~15 files) with pinned versions |
| Build-time font download fails offline | System font stacks only; no `next/font/google` |
| localStorage corruption / quota | Versioned key + try/catch + corrupt-key backup + non-fatal UI warning |
| Scope creep (challenge time limit) | Cut decorative work first; scoring + persistence + brief are untouchable |
| "Dead buttons" bug class | Code-review rule: no control renders without a working handler |
| Accidental fabricated content | Templates/placement copy are reviewed for "starting point" and "hypothetical" labels |

## 7. Completion checklist (from the spec)

1. Dev server starts; pages load.
2. Full sample workflow completed end-to-end.
3. Readiness score changes when answers change.
4. Save / reload / reopen / delete all verified.
5. Brief contains the user's actual inputs.
6. Copy Brief and Print / Save as PDF verified.
7. Desktop and mobile widths tested.
8. No console errors or broken interactions.
9. Main files + scoring explanation prepared for the demo.
10. Known-limitations list written.

## 8. Out of scope

Accounts/auth, any server, real AI generation, share/export beyond copy+print, analytics, i18n,
mobile native apps, unit-test infrastructure.
