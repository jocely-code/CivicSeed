# CivicSeed — Code Style

Style guide for the CivicSeed Next.js + TypeScript SPA. Read [`AGENTS.md`](./AGENTS.md) for
project rules and [`doc/architecture.md`](./doc/architecture.md) for structure. When in doubt:
**the code must be easy for a student to read and explain out loud.**

## 1. Tooling

- Prettier (defaults: double quotes, semicolons, 2-space indent, 95-char print width) — run on
  save; `npm run lint` (ESLint) must pass with zero warnings.
- TypeScript `strict: true`. `npx tsc --noEmit` is part of the definition of done.
- No new dependencies without a one-line justification in the PR/commit message.
  Existing allowed deps: `react`, `react-dom`, `next`, `lucide-react` (optional).

## 2. File & naming conventions

| Thing | Convention | Example |
|---|---|---|
| App route files | Next.js fixed names, lowercase | `app/project/[id]/define/page.tsx` |
| Components | PascalCase file, named export | `components/SproutLogo.tsx` → `export function SproutLogo()` |
| Hooks | `use` + PascalCase file | `hooks/useProject.ts` |
| Lib modules | kebab-case, pure functions | `lib/solution-templates.ts` |
| CSS classes | BEM-lite: `block__element--modifier`, lowercase | `.evidence-card__source--unverified` |
| Types/interfaces | `interface` for object shapes, `type` for unions | `interface Project`, `type NoteKind` |
| Constants | `UPPER_SNAKE` for module-level consts | `STORAGE_KEY = "civicseed.projects.v1"` |

- One primary export per file (the component/hook/function the filename names). No barrel files
  (`index.ts` re-exports).
- Imports: use the `@/` alias for `src/` paths (`import { Button } from "@/components/ui/Button"`);
  relative `./` only within the same folder.
- Import order: `react`/`next` → `@/lib` → `@/components` → `@/hooks`. One blank line between
  groups. No unused imports (ESLint enforces).

## 3. TypeScript rules

- **No `any`**, no non-null assertions (`!`) except at a documented storage boundary.
- Explicit return types on all exported functions; params typed inline.
- String literal unions for closed sets (`NoteKind`, `Difficulty`); never TypeScript `enum`.
- Prefer `interface` with a doc comment per field (see `lib/types.ts` as the reference).
- Optional data is `""` / `[]` / `undefined` consistently: strings default to `""`, lists to
  `[]`; never mix `null` and `undefined` for the same field.
- IDs are always `string` from `crypto.randomUUID()`; set once at creation, never derived.

## 4. React rules

- Function components only. `"use client"` appears **only** on leaf app files that need hooks
  (pages and interactive components); keep server components as thin shells where possible.
- Named exports for components (HMR + no default-export lint noise). `page.tsx`/`layout.tsx`
  use the required default export.
- No side effects in render: no `localStorage`, `Date.now()`, or `Math.random()` during render.
  All storage reads behind the mounted-guard pattern:

  ```tsx
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  ```
- One component file = one visual role. Extract when a component passes ~200 lines or two
  unrelated concerns.
- Event handlers: `onSomething` prop naming; local handlers named `handleSomething`.
- Keys for lists: stable entity ids (`note.id`), never array indices.
- Conditional rendering for UI state; no boolean prop explosions (a card that is "disabled and
  selected and sample" needs a variant, not three props).

## 5. The pure core (`src/lib/`)

`scoring.ts`, `brief.ts`, `solution-templates.ts`, `sample-project.ts` are the demo's
"explain this" files. Extra rules:

- **Pure & deterministic**: no React, no DOM, no `localStorage`, no `Date.now()` in outputs,
  no randomness. Same input → same output, every time.
- One exported entry function per module + its types; everything else module-private.
- Every scoring rule is a named local variable with a comment naming the point value
  (mirrors `doc/scoring-engine.md` exactly — if the doc changes, the code changes with it).
- Copy strings (placeholders, disclaimers) live next to the logic, in English, no string
  concatenation of sentences in JSX.

## 6. Storage access

- Only `lib/storage.ts` touches `localStorage`. Components/hooks go through
  `loadStore/saveStore/listProjects/getProject/upsertProject/deleteProject`.
- Every `JSON.parse` and `setItem` is inside try/catch with the documented failure behavior
  (see `doc/data-model.md` §5) — storage can never crash the app.

## 7. Content & honesty rules (product rules enforced in code)

- **No fabricated content.** Templates, sample data, and placeholders must read as
  hypothetical. Words like "proven", "validated", "approved", "effective results" are banned
  outside the required disclaimer.
- **No dead controls.** Every rendered button/field has a working handler; if a feature isn't
  built, the control isn't rendered.
- **Labels matter.** Suggested solutions are always labeled "starting points that require
  research"; the sample project is always labeled "demonstration"; the score always carries its
  disclaimer.

## 8. Accessibility & markup

- Semantic HTML: `main`, `nav`, `header`, `section` with `aria-labelledby`, one `h1` per page.
- Every input has a visible `<label htmlFor>`; icon-only buttons get `aria-label`.
- Focus states: visible 2 px outline (forest green on cream, cream on forest) on all
  interactive elements; never `outline: none` without a replacement.
- Contrast: body text `#29352F` on `#F7F3E9`/`#FFFFFF`; check any new color pairing against
  WCAG AA (4.5:1 body, 3:1 large text).
- Mobile-first: layouts must work at 360 px and 1280 px (spec checklist item 7).

## 9. Comments & commits

- Comments explain **why** (invariants, spec references, gotchas), not what the code does.
  Reference the spec doc when a rule comes from the PDF (e.g. `// spec §Policy Readiness Check`).
- Commits: small, one concern each, imperative subject (`add readiness scoring for feasibility
  dimension`). Don't commit generated files.

## 10. Definition of done (per feature)

1. `npx tsc --noEmit` clean · 2. `npm run lint` clean · 3. `npm run build` succeeds ·
4. No console errors/warnings in the dev server · 5. Works after a full browser reload ·
6. Works at 360 px and 1280 px · 7. Keyboard-only usable (Tab through, visible focus) ·
8. If it touched architecture/data model/scoring: OKF page in `docs/okf/` updated and
   `python3 tools/okf/okf.py lint` + `index` pass.
