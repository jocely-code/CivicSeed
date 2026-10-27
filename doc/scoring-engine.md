# CivicSeed — Policy Readiness Check (Scoring Engine)

> Part of the CivicSeed doc set. Related: [`data-model.md`](./data-model.md) ·
> [`architecture.md`](./architecture.md). OKF mirror: [`docs/okf/readiness-scoring.md`](../docs/okf/readiness-scoring.md).

`src/lib/scoring.ts` exports one pure function:

```ts
export function scoreReadiness(p: Project): ReadinessReport
```

**Contract:** deterministic (no `Date.now()`, no randomness), pure (no side effects), O(1) in
project size (linear scans over notes/lists only). Recomputed with `useMemo(() =>
scoreReadiness(project), [project])` in `ReadinessPanel`, so the score updates immediately on
every relevant keystroke (debounced save doesn't delay the score — it reads React state, not
storage).

**Total: 100 = 5 dimensions × 20.** Every point below is earned by a named, checkable rule —
no arbitrary numbers. Each unmet rule also emits a concrete next step shown in the UI.

## Dimension 1 — Problem clarity (20)

| Rule | Points |
|---|---|
| `title` non-empty (≥ 3 chars after trim) | 4 |
| `problem.description` ≥ 40 chars | 4 |
| `problem.description` ≥ 120 chars (specific, not a one-liner) | +4 (8 total) |
| `category` selected (one of the 7) | 4 |
| `problem.whoAffected` ≥ 10 chars (names real people/groups) | 4 |

Example next steps: *"Give the project a short, specific title."* · *"Describe the problem in
at least a full paragraph."* · *"Pick the category that fits best."* · *"Name who is affected."*

## Dimension 2 — Evidence & research (20)

| Rule | Points |
|---|---|
| ≥ 1 evidence note | 3 |
| ≥ 2 evidence notes | +1 (4 total) |
| ≥ 3 evidence notes | +1 (5 total) |
| ≥ 1 note that has **both** a source title and a source URL | 5 |
| ≥ 2 notes marked `verified` | 5 |
| ≥ 1 research question marked done **or** ≥ 1 assumption listed | 5 |

Why the last rule: the spec wants students to know what they *don't* yet know — closing a
research question or naming an assumption both show active, honest research.

Example next steps: *"Add your first observation or finding as an evidence note."* · *"Attach a
source title and URL to at least one note."* · *"Mark a research question as complete."*

## Dimension 3 — Stakeholder consideration (20)

| Rule | Points |
|---|---|
| ≥ 1 stakeholder group | 4 |
| ≥ 2 stakeholder groups | +2 (6 total) |
| ≥ 3 stakeholder groups | +2 (8 total) |
| `decisionMaker` named (≥ 5 chars: the body/official/org with authority to act) | 8 |
| ≥ 1 assumption listed (acknowledging uncertainty) | 4 |

Example next steps: *"Add another stakeholder group — who else is affected or involved?"* ·
*"Name the official, board, or organization that could actually act on this."*

## Dimension 4 — Implementation feasibility (20)

| Rule | Points |
|---|---|
| Exactly one solution `selected` | 6 |
| `whyChosen` on the selected solution ≥ 20 chars | 6 |
| ≥ 1 implementation step | 4 |
| ≥ 3 implementation steps | +4 (8 total) |

Example next steps: *"Choose which approach your proposal will pursue."* · *"Explain why you
chose it — this is what makes it your proposal."* · *"Break the chosen solution into at least
three steps."*

## Dimension 5 — Measurable evaluation (20)

| Rule | Points |
|---|---|
| ≥ 1 success indicator | 6 |
| A success indicator contains a number or unit (`/\d/`) | 6 |
| ≥ 1 next step | 4 |
| ≥ 3 next steps | +4 (8 total) |

Why the number check: an indicator like *"reduce the average lunch wait by half within a
semester"* is checkable; *"make lunch better"* is not. The regex is deliberately simple and is
explained in the UI as "make it countable or measurable."

Example next steps: *"Define how you'll know it worked."* · *"Add a number or time frame — how
much, by when?"*

## Labels & disclaimer

| Total | Label |
|---|---|
| 0–39 | **Early draft** |
| 40–69 | **Developing proposal** |
| 70–100 | **Ready for further review** |

The panel always renders: *"This score measures how complete your research and reasoning are.
It does not predict whether a proposal will succeed or be adopted."*

## Worked example — the seeded sample project

`makeSampleProject()` ("Reducing School Lunch Wait Times") scores:

| Dimension | Earned | How |
|---|---|---|
| Problem clarity | 20/20 | Title (4) + 120+ char description (8) + category School (4) + who-affected named (4) |
| Evidence & research | 9/20 | 2 observation notes (4) + 1 assumption listed (5) — no sources/verified notes yet |
| Stakeholder consideration | 12/20 | 4 stakeholder groups (8) + assumptions (4) — no decision-maker named yet |
| Implementation feasibility | 0/20 | Nothing selected, no steps |
| Measurable evaluation | 0/20 | No indicators or next steps |
| **Total** | **41 → "Developing proposal"** | |

This is intentional: the demo starts mid-scale, so a reviewer watching the student fill in a
decision-maker, add a sourced note, pick a solution, and write measurable indicators can see the
score climb to "Ready for further review" in real time.

## Verification (manual, per completion checklist item 3)

1. Load the sample project → expect **41, "Developing proposal."**
2. Name a decision-maker → +8 (→ 49).
3. Add a third evidence note with source title + URL and mark two notes verified → +1+5+5 (→ 60, "Developing").
4. Select a solution, write `whyChosen` (≥ 20 chars), add 3 implementation steps → +20 (→ 80, "Ready for further review").
5. Add a numeric success indicator and 3 next steps → +20 (→ 100).
