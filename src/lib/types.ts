/**
 * CivicSeed — core TypeScript data model.
 *
 * Single source of truth for the Project shape and all related types.
 * These types are framework-free (no React, no DOM) so they can be
 * reasoned about and tested in isolation.
 */

/** The five steps shown in the progress indicator. */
export type StepKey =
  | "define"
  | "stakeholders"
  | "evidence"
  | "solutions"
  | "brief";

export type Category =
  | "School"
  | "Accessibility"
  | "Public Health"
  | "Environment"
  | "Transportation"
  | "Youth Services"
  | "Other";

/**
 * How a note should be read: what the student saw (observation),
 * what was verified (verified), what is still a guess (assumption).
 */
export type NoteKind = "observation" | "verified" | "assumption";

export interface EvidenceNote {
  id: string;           // crypto.randomUUID()
  kind: NoteKind;
  text: string;
  sourceTitle: string;  // "" when the student has no source yet
  sourceUrl: string;    // "" when the student has no source yet
  createdAt: string;    // ISO-8601
}

export interface ResearchQuestion {
  id: string;           // crypto.randomUUID()
  text: string;
  done: boolean;
}

export type Difficulty = "Low" | "Medium" | "High";

export interface SolutionOption {
  id: string;           // crypto.randomUUID()
  templateId: string;   // which template produced it (drives the "starting point" label)
  title: string;
  action: string;       // proposed action
  benefits: string;     // potential benefits
  limitations: string;  // potential limitations
  difficulty: Difficulty;
  unintended: string;   // potential unintended consequences
  selected: boolean;
  whyChosen: string;    // the student's own explanation
  userEdited: boolean;  // true once the student changes any field
}

export interface Project {
  schemaVersion: 1;
  id: string;           // crypto.randomUUID()
  isSample: boolean;    // true only for the preloaded demo
  createdAt: string;    // ISO-8601
  updatedAt: string;    // ISO-8601, stamped on every update()
  step: StepKey;        // where to send the user on reopen

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
  | "clarity"
  | "evidence"
  | "stakeholders"
  | "feasibility"
  | "evaluation";

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

/** The persisted localStorage store. */
export interface Store {
  version: 1;
  projects: Project[];
}

/** Every string field defaults to "", every list defaults to []. */
export function emptyProject(overrides: Partial<Project> = {}): Project {
  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    isSample: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    step: "define",
    title: "",
    category: "",
    problem: {
      description: "",
      whoAffected: "",
      observations: "",
      openQuestions: "",
    },
    stakeholders: [],
    decisionMaker: "",
    researchQuestions: [],
    evidence: [],
    assumptions: [],
    solutions: [],
    implementationSteps: [],
    successIndicators: [],
    nextSteps: [],
    ...overrides,
  };
}

/** Create a new empty project with a fresh id and timestamps. */
export function newProject(): Project {
  const now = new Date().toISOString();
  return {
    ...emptyProject(),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}
