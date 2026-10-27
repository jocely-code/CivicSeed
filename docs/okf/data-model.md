---
type: Concept
title: Data Model & localStorage Persistence
description: Typed project data model, versioned localStorage key civicseed.projects.v1, and the failure-mode contract for corrupt/full storage.
resource: architecture/data-model
tags: [data-model, typescript, localStorage, persistence, versioning, migration]
timestamp: 2026-10-27T01:15:45Z
generated: antigravity-agent
verified: engineering-lead
status: active
---

# Data Model & localStorage Persistence

Full detail: [`doc/data-model.md`](../../doc/data-model.md).

## Core types (in `src/lib/types.ts`)

- `Project` — `schemaVersion: 1`, `id` (crypto.randomUUID), `isSample`, `step: StepKey`,
  `title`, `category`, `problem{description, whoAffected, observations, openQuestions}`,
  `stakeholders[]`, `decisionMaker`, `researchQuestions[]`, `evidence[]`, `assumptions[]`,
  `solutions[]`, `implementationSteps[]`, `successIndicators[]`, `nextSteps[]`.
- `EvidenceNote` — `kind: "observation" | "verified" | "assumption"` (UI must visually
  distinguish the three; scoring treats them differently), `sourceTitle`, `sourceUrl`.
- `SolutionOption` — `templateId`, action/benefits/limitations/difficulty/unintended,
  `selected` (exactly one), `whyChosen`, `userEdited`.
- `ReadinessReport` — `total` 0–100, `label`, five `ReadinessDimension`s (0–20 each) with
  `nextSteps[]` suggestions.

## Storage contract

- **Key:** `civicseed.projects.v1` (version in the key). Value: `{ version: 1, projects: [] }`.
- Only `lib/storage.ts` touches `localStorage`: `loadStore`, `saveStore`, `listProjects`,
  `getProject`, `upsertProject`, `deleteProject`, `ensureSampleSeeded`.
- **Never throws:** malformed JSON → park raw data at
  `civicseed.projects.v1.corrupt-<ts>`, start fresh; quota/privacy-mode errors → non-blocking
  warning, in-memory app continues; unknown `version` → migrate or park.
- Sample project ("Reducing School Lunch Wait Times", `isSample: true`) seeds only when the
  store is empty **and** flag `civicseed.seeded.v1` is unset — deleting the sample never
  re-seeds.
- Writes debounced ~300 ms; immediate save on step navigation + `pagehide`.

## Migration rule

Schema bump ⇒ bump key suffix (`...v2`) + a `migrate()` for the known old shape; unknown data
is parked, never dropped silently.

## Related Concepts

- [Root Index](./index.md)
- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Readiness Scoring](./readiness-scoring.md)
