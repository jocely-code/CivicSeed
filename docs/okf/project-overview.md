---
type: Concept
title: CivicSeed Project Overview
description: Mission, tech stack, hard constraints, and where each spec requirement lives in the codebase.
resource: project/overview
tags: [civicseed, overview, spec, nextjs, spa]
timestamp: 2026-10-27T01:15:45Z
generated: antigravity-agent
verified: engineering-lead
status: active
---

# CivicSeed Project Overview

**Mission:** help high school students turn school or community problems into evidence-based
policy proposals. Guides users: define a problem → identify stakeholders → collect evidence →
compare solutions → produce an editable policy brief. A real interactive prototype for a
congressional app challenge — not a static mockup.

**Tagline:** From student concerns to real-world solutions.

## Hard constraints (from the spec PDF)

- Next.js (App Router) + React + TypeScript; CSS modules or one clean global CSS file.
- Browser **localStorage** only for persistence — versioned key.
- **No** paid APIs, no backend, no login, no external AI, no env vars.
- No dead buttons, no fake functionality, no fabricated citations/statistics/authority.
- Mobile-responsive, accessible, editorial civic-tech visual style (forest green `#173F35`,
  sage `#B7D7A8`, cream `#F7F3E9`, muted blue `#8CAFC1`, ink `#29352F`).

## Where things live

| Requirement | Location |
|---|---|
| Full spec (source of truth) | [`doc/projectcivicseed.pdf`](../../doc/projectcivicseed.pdf) |
| Phased build plan + acceptance criteria | [`doc/implementation-plan.md`](../../doc/implementation-plan.md) |
| System architecture (SPA on App Router) | [`doc/architecture.md`](../../doc/architecture.md) → [Architecture](./architecture.md) |
| Data model + localStorage schema | [`doc/data-model.md`](../../doc/data-model.md) → [Data Model](./data-model.md) |
| Readiness scoring rubric (0–100) | [`doc/scoring-engine.md`](../../doc/scoring-engine.md) → [Readiness Scoring](./readiness-scoring.md) |
| Solution templates + brief generation | [`doc/solutions-and-brief.md`](../../doc/solutions-and-brief.md) → [Solutions & Brief](./solutions-and-brief.md) |
| Code conventions | [`code-style.md`](../../code-style.md) |

## The five steps (stepper)

`Define → Stakeholders → Evidence → Solutions → Brief`. Routes:
`/project/[id]/define`, `/project/[id]/investigate` (covers steps 2+3),
`/project/[id]/solutions`, `/project/[id]/brief`.

## Related Concepts

- [Root Index](./index.md)
- [Architecture](./architecture.md)
- [Data Model](./data-model.md)
- [Readiness Scoring](./readiness-scoring.md)
- [Solutions & Brief](./solutions-and-brief.md)
