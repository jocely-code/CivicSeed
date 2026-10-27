---
type: Concept
title: Architecture — SPA on Next.js App Router
description: 100% client-side app; hydration-safe localStorage access, routing map, state flow, and the pure lib/ core boundary.
resource: architecture/spa-app-router
tags: [architecture, nextjs, app-router, spa, hydration, state, localStorage]
timestamp: 2026-10-27T01:15:45Z
generated: antigravity-agent
verified: engineering-lead
status: active
---

# Architecture — SPA on Next.js App Router

Full detail: [`doc/architecture.md`](../../doc/architecture.md).

## Invariants (do not break)

1. **No server-side data access.** No API routes, no server actions, no `fetch`, no env vars.
   Next.js provides routing + code splitting only; every page renders a client component.
2. **No `localStorage` during render.** All storage reads happen in `useEffect` behind a
   `mounted`/`ready` flag; until then the UI shows deterministic placeholders (prevents SSR
   hydration mismatch).
3. **Two-layer rule.** `src/lib/` is pure (no React/DOM/`Date.now()`/randomness) and is the
   "explain this in the demo" core: `scoring.ts`, `brief.ts`, `solution-templates.ts`,
   `sample-project.ts`. Only `components/` + `hooks/` may touch React/DOM/storage.
4. **One source of truth.** Project state lives in React state, persisted via `lib/storage.ts`.
   Derived values (score, brief, suggestions) are `useMemo` recomputations — never stored.

## Routing map

| Route | Purpose |
|---|---|
| `/` | Home: hero, continue draft, my projects, 5-step indicator, sample preview |
| `/project/[id]` | Client redirect to the project's saved `step` |
| `/project/[id]/define` | Step 1 — Define the problem |
| `/project/[id]/investigate` | Steps 2+3 — Stakeholders and Evidence (one screen) |
| `/project/[id]/solutions` | Step 4 — Compare solutions |
| `/project/[id]/brief` | Step 5 — Policy brief (edit / copy / print) |

## State flow

`user input → useProject.update(patch) → React state + debounced (300 ms) localStorage write
→ re-render → useMemo recompute score/brief`. Home uses `useProjects()` (list/create/delete).

## Styling

Single `globals.css` with CSS custom-property tokens for the brand palette; BEM-lite class
names; `@media print` prints only the brief. Serif headlines (Georgia stack), sans body
(Inter stack), no network font downloads.

## Related Concepts

- [Root Index](./index.md)
- [Project Overview](./project-overview.md)
- [Data Model](./data-model.md)
- [Readiness Scoring](./readiness-scoring.md)
- [Solutions & Brief](./solutions-and-brief.md)
