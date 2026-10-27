# CivicSeed — Data Model & Persistence

> Part of the CivicSeed doc set. Related: [`architecture.md`](./architecture.md) ·
> [`scoring-engine.md`](./scoring-engine.md) · [`solutions-and-brief.md`](./solutions-and-brief.md).
> OKF mirror: [`docs/okf/data-model.md`](../docs/okf/data-model.md).

## 1. TypeScript model (`src/lib/types.ts`)

```ts
/** The five steps shown in the progress indicator. */
export type StepKey = "define" | "stakeholders" | "evidence" | "solutions" | "brief";

export type Category =
  | "School" | "Accessibility" | "Public Health" | "Environment"
  | "Transportation" | "Youth Services" | "Other";

/** How a note should be read: what the student saw, what was verified, what is still a guess. */
export type NoteKind = "observation" | "verified" | "assumption";

export interface EvidenceNote {
  id: string;
  kind: NoteKind;
  text: string;
  sourceTitle: string;   // "" when the student has no source yet
  sourceUrl: string;     // "" when the student has no source yet
  createdAt: string;     // ISO-8601
}

export interface ResearchQuestion {
  id: string;
  text: string;
  done: boolean;
}

export type Difficulty = "Low" | "Medium" | "High";

export interface SolutionOption {
  id: string;
  templateId: string;    // which template produced it (drives the "starting point" label)
  title: string;
  action: string;        // proposed action
  benefits: string;      // potential benefits
  limitations: string;   // potential limitations
  difficulty: Difficulty;
  unintended: string;    // potential unintended consequences
  selected: boolean;
  whyChosen: string;     // the student's own explanation
  userEdited: boolean;   // true once the student changes any field
}

export interface Project {
  schemaVersion: 1;
  id: string;            // crypto.randomUUID()
  isSample: boolean;     // true only for the preloaded demo
  createdAt: string;     // ISO-8601
  updatedAt: string;     // ISO-8601, stamped on every update()
  step: StepKey;         // where to send the user on reopen

  // Step 1 — Define the problem
  title: string;
  category: Category | "";
  problem: {
    description: string;   // "Problem description"
    whoAffected: string;   // "Who is affected?"
    observations: string;  // "What have you personally observed?"
    openQuestions: string; // "What do you still need to find out?"
  };

  // Steps 2+3 — Investigate
  stakeholders: string[];          // affected stakeholder groups
  decisionMaker: string;           // government body / official / org with authority to act
  researchQuestions: ResearchQuestion[];
  evidence: EvidenceNote[];
  assumptions: string[];           // assumptions that need verification

  // Step 4 — Compare solutions
  solutions: SolutionOption[];     // usually 3; student may keep only what they edited/selected

  // Step 5 inputs that feed the brief
  implementationSteps: string[];
  successIndicators: string[];
  nextSteps: string[];
}

export type DimensionKey =
  | "clarity" | "evidence" | "stakeholders" | "feasibility" | "evaluation";

export interface ReadinessDimension {
  key: DimensionKey;
  label: string;
  score: number;      // 0..20
  max: 20;
  nextSteps: string[]; // concrete suggestions for the points not yet earned
}

export interface ReadinessReport {
  total: number; // 0..100
  label: "Early draft" | "Developing proposal" | "Ready for further review";
  dimensions: ReadinessDimension[];
}
```

Design notes:

- **Strings over rich text.** Every long-form field is a plain string; lists are `string[]`.
  This keeps localStorage round-trips, Copy Brief, and scoring trivially simple.
- **`kind` on evidence** is what enforces the spec rule *"clearly distinguish user
  observations, verified evidence, and unverified assumptions"* — the UI renders each kind with
  its own badge and color, and scoring treats them differently.
- **`selected` + `whyChosen` + `userEdited`** live on the option, not the project: exactly one
  option may be `selected`, and the brief only renders that option (plus an honest note if none
  is selected).
- **No enums objects.** `string` literal unions keep serialization and student-readability.
- **`schemaVersion: 1`** on every project (redundant with the store version on purpose) so a
  future schema can migrate per-project.

## 2. localStorage schema

- **Key:** `civicseed.projects.v1` — the version is part of the key, so a schema bump never
  reads unknown data.
- **Value:**

```jsonc
{
  "version": 1,
  "projects": [ /* Project[] */ ]
}
```

- All access goes through `lib/storage.ts`:

| Function | Behavior |
|---|---|
| `loadStore(): Store` | Missing key → fresh store. Malformed JSON / wrong version shape → park raw string under `civicseed.projects.v1.corrupt-<ISO-ts>`, return fresh store. Never throws. |
| `saveStore(store): boolean` | `JSON.stringify` + `setItem` in try/catch. Quota/privacy-mode errors → `false` (caller shows a non-blocking warning). |
| `listProjects(): Project[]` | Sorted `updatedAt` desc. |
| `getProject(id): Project \| undefined` | |
| `upsertProject(p): boolean` | Replace-by-id or append; stamps `updatedAt` on replace. |
| `deleteProject(id): boolean` | |
| `ensureSampleSeeded(): void` | Only when the store has **zero** projects and no `civicseed.seeded.v1` flag: inserts `makeSampleProject()` and sets the flag (so deleting the sample doesn't re-seed). |

- **Writes are debounced ~300 ms** in `useProject` (one save per burst of typing), plus an
  immediate save on step navigation and on `beforeunload`/`pagehide`.

## 3. Migration strategy

1. Bump `Store.version` and the key suffix (`...v2`).
2. Keep a tiny `migrate(v1Store): Store` for the known previous shape; unknown versions get the
   corrupt-parking treatment (data preserved, never lost silently).

## 4. Hydration & SSR rules

- `localStorage` is touched **only** inside `useEffect` (after mount). Render paths that depend
  on storage show deterministic placeholders first (see `architecture.md` §2).
- `typeof window === "undefined"` guards exist in `storage.ts` as a belt-and-braces measure; the
  real protection is the mounted-gate pattern.

## 5. Failure-mode table

| Failure | Detection | User sees |
|---|---|---|
| Corrupt JSON | `JSON.parse` throw / shape check | Fresh empty state; corrupt copy parked under a timestamped key |
| Storage full | `setItem` throws `QuotaExceededError` | Warning banner "Changes may not be saved in this browser"; in-memory app keeps working |
| Private-mode / blocked storage | First `setItem` throws | Same banner; app fully functional in-memory |
| Unknown project id (stale URL) | `getProject` → undefined | "Project not found" card with link to Home |
| Old schema | version mismatch | Migrate or park (above) |
