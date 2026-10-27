---
type: Concept
title: Solution Templates & Policy Brief Generation
description: Transparent rule-based 3-approach suggestion engine per category, and the 10-section brief built strictly from the user's saved answers.
resource: feature/solutions-and-brief
tags: [solutions, templates, policy-brief, generation, copy, print, honesty]
timestamp: 2026-10-27T01:15:45Z
generated: antigravity-agent
verified: engineering-lead
status: active
---

# Solution Templates & Policy Brief Generation

Full detail: [`doc/solutions-and-brief.md`](../../doc/solutions-and-brief.md).

## Solution templates (`src/lib/solution-templates.ts`)

- `suggestSolutions(category, description)` returns **3** `SolutionOption`s.
- **Rule-based, deterministic, no randomness** — never pretend to be an AI. UI copy:
  *"Suggested approaches are rule-based starting points. Research them before proposing."*
- Selection rule: 3 templates for the chosen category (bank of 24: 3 × 7 categories + 3
  `default`); fall back to the 3 generic `default-*` templates. Regenerated only when the
  category changes or on first entry with no user edits — never clobbers user edits.
- Each option carries `templateId`; `userEdited` flips true once the student edits anything;
  exactly one may be `selected`.
- Template text is written as proposals ("could", "may", "staff input required") — never as
  claims ("proven", "approved", "will work").

## Brief generation (`src/lib/brief.ts`)

`buildBrief(project)` → 10 sections, **each sourced from real saved answers** (spec order):
title → executive summary (composed from title/solution/whyChosen/whoAffected) → problem
statement → affected stakeholders → evidence & research gaps (notes grouped by kind, with
sources) → proposed solution (the selected option, labeled) → implementation steps → drawbacks
& safeguards (limitations + unintended consequences + assumptions-to-verify) → measurable
success indicators → next steps.

- Missing field ⇒ honest placeholder `*(not yet defined — add this in step N)*` — **never
  invented content**.
- Footer always: *"Student-drafted policy brief generated from the author's own research. Not
  approved, validated, or proven effective."*
- **Copy Brief** = `clipboard.writeText(briefToPlainText(project))` with execCommand fallback.
- **Print / Save as PDF** = `window.print()` + `@media print` CSS (brief only, no nav/panels).
  No PDF library, no server.

## Related Concepts

- [Root Index](./index.md)
- [Project Overview](./project-overview.md)
- [Data Model](./data-model.md)
- [Readiness Scoring](./readiness-scoring.md)
