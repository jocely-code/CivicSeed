# CivicSeed — Solution Templates & Policy Brief Generation

> Part of the CivicSeed doc set. Related: [`data-model.md`](./data-model.md) ·
> [`scoring-engine.md`](./scoring-engine.md) · [`architecture.md`](./architecture.md).

## 1. Solution templates (`src/lib/solution-templates.ts`)

**Honesty requirement (spec):** use transparent rule-based templates, *not* a pretend AI. The UI
says so: *"Suggested approaches are rule-based starting points. Research them before proposing."*

### Shape

```ts
interface SolutionTemplate {
  id: string;               // e.g. "school-reorganize-stations"
  category: Category | "default";
  title: string;
  action: string;           // proposed action
  benefits: string;
  limitations: string;
  difficulty: "Low" | "Medium" | "High";
  unintended: string;       // potential unintended consequences
}

export function suggestSolutions(category: Category | "", description: string): SolutionOption[]
```

### Selection rule (deterministic, no randomness)

1. If `category` is set and the template bank has 3+ templates for it → use those three.
2. Otherwise → the 3 generic templates (`default-*`):
   - **"Organize what already exists"** — reorganize current processes/people/resources.
   - **"Pilot a small, visible change"** — one-room/one-week trial with a simple measure.
   - **"Coordinate with the body in charge"** — draft a request + data ask for the decision-maker.
3. Each returned `SolutionOption` has `templateId` set, `selected: false`, `userEdited: false`.
4. Suggestions are only regenerated when the category changes (or on first entry to the step if
   the student hasn't edited/selected anything) — editing one option never wipes sibling edits.

### Template bank (24 templates)

Three per category for: `School`, `Accessibility`, `Public Health`, `Environment`,
`Transportation`, `Youth Services`, `Other` (→ generic), plus the 3 `default` templates.

Example rows (full bank lives in code):

| id | category | title | difficulty |
|---|---|---|---|
| `school-reorganize-stations` | School | Reorganize serving/traffic flow | Low |
| `school-live-info` | School | Simple, privacy-preserving wait/menu display | Medium |
| `school-staff-pilot` | School | Pilot a schedule/capacity change with staff input | High |
| `env-classroom-compost` | Environment | Compost or zero-waste program for one building | Medium |
| `default-organize` | default | Organize what already exists | Low |

Every template text is written as a *proposal*, never a claim: "could", "may", "staff input
required" — never "will", "proven", "approved".

## 2. Brief generation (`src/lib/brief.ts`)

```ts
export interface BriefSection {
  id: string;      // stable id so the editor can keep per-section edits
  heading: string;
  body: string;    // rendered text; editable in the UI
}
export function buildBrief(p: Project): BriefSection[];
export function briefToPlainText(p: Project): string; // what "Copy Brief" puts on the clipboard
```

### The 10 sections and exactly where each comes from

| # | Section | Source |
|---|---|---|
| 1 | Project title | `p.title` |
| 2 | Executive summary | Composed sentence: *`[title]` proposes `[selected solution title]` because `[whyChosen]`, addressing `[category]`-related problem affecting `[whoAffected]`.* (each gap falls back to an honest placeholder) |
| 3 | Problem statement | `problem.description` + `observations` |
| 4 | Affected stakeholders | `stakeholders` list + `decisionMaker` |
| 5 | Evidence & remaining research gaps | Evidence notes **grouped by kind** (verified / observed / unverified-assumption) with source title+URL when present; then open questions + `openQuestions` text |
| 6 | Proposed solution | Selected option: `action`, `benefits`, `limitations`, `unintended`; labeled "starting point requiring research" unless `userEdited` |
| 7 | Implementation steps | `implementationSteps` (numbered) |
| 8 | Potential drawbacks & safeguards | Selected option `limitations` + `unintended` + `assumptions` as "assumptions to verify before implementation" |
| 9 | Measurable success indicators | `successIndicators` list |
| 10 | Next steps | `nextSteps` list |

### Rules

- **Never invent.** A missing field renders as `*(not yet defined — add this in step N)*`,
  which also nudges the student back to the right screen. The brief is a projection of stored
  answers, not a generator of content.
- **No success claims.** The footer always reads: *"Student-drafted policy brief generated from
  the author's own research. Not approved, validated, or proven effective."*
- Section bodies are editable in the UI; edits are stored as per-section overrides
  (`briefOverrides` would only be added if time allows — otherwise edits re-derive on save; the
  simpler default is re-derivation, and the "editable" requirement is met by the brief page's
  inline fields).

## 3. Copy Brief

`navigator.clipboard.writeText(briefToPlainText(p))` with a `document.execCommand("copy")`
textarea fallback (for non-secure contexts). Feedback: "Copied ✓" for 2 s. Plain text uses the
same 10 headings with `#`-free, email-friendly formatting.

## 4. Print / Save as PDF

- Button calls `window.print()`.
- `@media print` CSS: hides nav, stepper, readiness panel, action buttons; prints only
  `BriefDocument` on a white page, serif headings, 1 pt borders, no backgrounds.
- No server, no PDF library — the browser's native "Save as PDF" is the exporter.
