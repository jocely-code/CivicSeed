# AGENTS.md — CivicSeed

## Project overview

**CivicSeed** — *From student concerns to real-world solutions.* A Next.js (App Router) +
TypeScript **single-page app** for a congressional app challenge: it guides high school
students from a school/community problem to an evidence-based, editable **policy brief**, with
a real 0–100 **Policy Readiness Check**. 100% client-side — **no backend, no login, no paid
APIs, no external AI, no env vars**. All data persists in browser `localStorage`.

The spec PDF is the source of truth for requirements.

## Read first (in this order)

1. [`doc/projectcivicseed.pdf`](doc/projectcivicseed.pdf) — the spec (screens, rules, checklist)
2. [`doc/implementation-plan.md`](doc/implementation-plan.md) — build phases + acceptance criteria
3. [`doc/architecture.md`](doc/architecture.md) — system design & invariants
4. [`doc/data-model.md`](doc/data-model.md) — types + localStorage contract
5. [`doc/scoring-engine.md`](doc/scoring-engine.md) — the exact 5×20 scoring rubric
6. [`doc/solutions-and-brief.md`](doc/solutions-and-brief.md) — templates + brief rules
7. [`code-style.md`](code-style.md) — code conventions & definition of done

## Commands (after the app is scaffolded — see plan Phase 0)

```bash
npm run dev        # dev server → http://localhost:3000
npm run build      # production build (must pass; also type-checks)
npm run lint       # ESLint (must pass, zero warnings)
npx tsc --noEmit   # strict type check
```

## Knowledge Graph First (`docs/okf/`)

Before scanning historical files in `docs/`, **always consult the Open Knowledge Format (OKF v0.2) bundle** at [`docs/okf/index.md`](docs/okf/index.md):

- **Root Navigator**: [`docs/okf/index.md`](docs/okf/index.md)
- **Sequential Evolution Log**: [`docs/okf/log.md`](docs/okf/log.md)
- **CLI Commands**:
  ```bash
  python3 tools/okf/okf.py search --toc
  python3 tools/okf/okf.py search <query>
  python3 tools/okf/okf.py status
  python3 tools/okf/okf.py update <page.md> --log "Summary of update"
  python3 tools/okf/okf.py lint
  ```

When you make an **architectural decision** (new module, data-model change, scoring rule
change, new constraint), record it: add/update the OKF concept page in `docs/okf/`, bump its
timestamp with `python3 tools/okf/okf.py update <page.md> --log "..."`, and make sure
`python3 tools/okf/okf.py lint` and `... index` pass.

## Non-negotiable rules

1. **SPA discipline.** No API routes, no server actions, no `fetch`, no env vars. Every page
   renders a client component. No `localStorage` reads during render — always behind the
   `mounted`/`ready` guard (prevents hydration mismatch).
2. **Pure core.** `src/lib/` (`scoring.ts`, `brief.ts`, `solution-templates.ts`,
   `sample-project.ts`) contains no React, no DOM, no `Date.now()`, no randomness. The demo's
   "explain how it works" story lives there.
3. **Honesty.** Never fabricate citations, statistics, research findings, or official
   authority. Suggested solutions are rule-based **starting points** and must be labeled as
   such. The brief must never claim a proposal is approved/validated/proven effective.
4. **No dead buttons.** If a control can't work, don't render it.
5. **Persistence.** Versioned key `civicseed.projects.v1`; only `lib/storage.ts` touches
   `localStorage`; corrupt/full storage degrades gracefully (never crashes).
6. **Accessibility & polish.** Semantic HTML, visible focus states, labeled inputs, WCAG-AA
   contrast, works at 360 px and 1280 px.
7. **No new dependencies** without a one-line justification.
8. **Style.** Follow [`code-style.md`](code-style.md) — TS strict, no `any`, named component
   exports, BEM-lite global CSS.

## Working agreement (every change)

1. Follow the build order in `doc/implementation-plan.md`; scoring + persistence + brief are
   the critical path, decorative work is cut first under time pressure.
2. Definition of done per feature (from `code-style.md` §10): type check, lint, build, no
   console errors, survives reload, 360 px + 1280 px, keyboard-usable, OKF updated if
   architecture changed.
3. Before declaring a feature done, run the relevant line of the spec's completion checklist
   (plan §7).
