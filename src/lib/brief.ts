/**
 * CivicSeed — Policy Brief builder.
 *
 * Assembles a 10-section policy brief from the user's saved project answers.
 * Empty fields render as "(not yet defined)" — nothing is ever invented.
 * Pure function, no side effects.
 */

import type { BriefSection, Project } from "./types";

/** The 10 required sections of the policy brief, per the spec. */
const SECTION_KEYS: Array<{
  key: string;
  title: string;
  extract: (p: Project) => string;
}> = [
  {
    key: "projectTitle",
    title: "Project Title",
    extract: (p) => p.title,
  },
  {
    key: "category",
    title: "Category",
    extract: (p) => p.category,
  },
  {
    key: "problemDescription",
    title: "Problem Description",
    extract: (p) => p.problem.description,
  },
  {
    key: "whoAffected",
    title: "Who Is Affected?",
    extract: (p) => p.problem.whoAffected,
  },
  {
    key: "observations",
    title: "What Have You Observed?",
    extract: (p) => p.problem.observations,
  },
  {
    key: "openQuestions",
    title: "What Do You Still Need to Find Out?",
    extract: (p) => p.problem.openQuestions,
  },
  {
    key: "stakeholders",
    title: "Stakeholders",
    extract: (p) => p.stakeholders.join(", ") || "",
  },
  {
    key: "decisionMaker",
    title: "Decision-Maker",
    extract: (p) => p.decisionMaker,
  },
  {
    key: "chosenSolution",
    title: "Chosen Solution",
    extract: (p) => {
      const selected = p.solutions.find((s) => s.selected);
      return selected ? selected.title : "";
    },
  },
  {
    key: "whyChosen",
    title: "Why This Approach?",
    extract: (p) => {
      const selected = p.solutions.find((s) => s.selected);
      return selected ? selected.whyChosen : "";
    },
  },
  {
    key: "implementationSteps",
    title: "Implementation Steps",
    extract: (p) => p.implementationSteps.join("\n"),
  },
  {
    key: "successIndicators",
    title: "How Will You Know It Worked?",
    extract: (p) => p.successIndicators.join("\n"),
  },
  {
    key: "nextSteps",
    title: "Next Steps",
    extract: (p) => p.nextSteps.join("\n"),
  },
];

const NOT_YET_DEFINED = "(not yet defined)";

/**
 * Build the brief sections from a project.
 * Every section returns the user's actual input, or "(not yet defined)".
 * Never invents content.
 */
export function buildBrief(p: Project): BriefSection[] {
  return SECTION_KEYS.map((s) => {
    const content = s.extract(p).trim();
    return {
      key: s.key,
      title: s.title,
      content: content === "" ? NOT_YET_DEFINED : content,
      editable: true,
    };
  });
}

/** Convert brief sections to plain text for "Copy Brief". */
export function briefToPlainText(p: Project): string {
  const sections = buildBrief(p);
  const lines: string[] = [
    "CIVICSEED POLICY BRIEF",
    "======================",
    "",
    `Generated from project: ${p.title}`,
    `Category: ${p.category}`,
    `Last updated: ${p.updatedAt}`,
    "",
    "---",
    "",
  ];

  sections.forEach((s) => {
    lines.push(s.title.toUpperCase());
    lines.push("-".repeat(s.title.length));
    lines.push(s.content);
    lines.push("");
  });

  lines.push("---");
  lines.push("");
  lines.push(
    "This brief was created with CivicSeed, a student policy prototyping tool. "
    + "All content reflects the student's own inputs; the Readiness Check score "
    + "measures completeness, not predicted real-world success."
  );

  return lines.join("\n");
}
