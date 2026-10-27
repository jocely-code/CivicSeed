---
type: Concept
title: Policy Readiness Check (Scoring Engine)
description: Deterministic 0-100 rubric — five dimensions worth 20 points each with explicit checkable rules, labels, and the sample-project worked example.
resource: feature/readiness-scoring
tags: [scoring, readiness, rubric, policy-brief, typescript, pure-function]
timestamp: 2026-10-27T01:15:45Z
generated: antigravity-agent
verified: engineering-lead
status: active
---

# Policy Readiness Check (Scoring Engine)

Full detail: [`doc/scoring-engine.md`](../../doc/scoring-engine.md).

## Contract

`scoreReadiness(project: Project): ReadinessReport` in `src/lib/scoring.ts` — **pure,
deterministic, no randomness, no `Date.now()` in output**. Recomputed via `useMemo` on every
relevant change; the UI score never waits on the debounced storage write.

## Rubric (5 × 20 = 100)

| Dimension | 20 pts from |
|---|---|
| Problem clarity | title (4) + description ≥40 chars (4) + ≥120 chars (+4) + category (4) + who-affected ≥10 chars (4) |
| Evidence & research | notes 1/2/3 → 3/4/5 (5) + one note with source title **and** URL (5) + ≥2 verified notes (5) + a research question done **or** an assumption listed (5) |
| Stakeholder consideration | groups 1/2/3 → 4/6/8 (8) + decision-maker named ≥5 chars (8) + ≥1 assumption (4) |
| Implementation feasibility | solution selected (6) + `whyChosen` ≥20 chars (6) + steps 1/3 → 4/8 (8) |
| Measurable evaluation | ≥1 indicator (6) + an indicator contains a number/unit `/\d/` (6) + next steps 1/3 → 4/8 (8) |

Every unmet rule emits a concrete next-step string shown in `ReadinessPanel`.

## Labels

`0–39 "Early draft"` · `40–69 "Developing proposal"` · `70–100 "Ready for further review"`.

**Mandatory disclaimer** (always rendered): the score measures completeness of research and
reasoning; it does **not** predict whether a proposal will succeed or be adopted.

## Worked example

The seeded sample project scores **41 → "Developing proposal"** (clarity 20 + evidence 9 +
stakeholders 12 + feasibility 0 + evaluation 0). Deliberate: a live demo can watch the score
climb to 100 as the student names a decision-maker, adds a sourced note, selects a solution,
and writes measurable indicators.

## Related Concepts

- [Root Index](./index.md)
- [Project Overview](./project-overview.md)
- [Data Model](./data-model.md)
- [Solutions & Brief](./solutions-and-brief.md)
