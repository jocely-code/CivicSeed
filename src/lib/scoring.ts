/**
 * CivicSeed — Policy Readiness Check scoring engine.
 *
 * Pure, deterministic, framework-free. Same input → same output, every time.
 * No Date.now(), no randomness, no side effects.
 *
 * Total: 100 = 5 dimensions × 20. Every point is earned by a named,
 * checkable rule (see doc/scoring-engine.md).
 *
 * Each unmet rule emits a concrete next step shown in the ReadinessPanel.
 */

import type { Project, ReadinessReport, ReadinessDimension } from "./types";

export function scoreReadiness(p: Project): ReadinessReport {
  const clarity = scoreClarity(p);
  const evidence = scoreEvidence(p);
  const stakeholders = scoreStakeholders(p);
  const feasibility = scoreFeasibility(p);
  const evaluation = scoreEvaluation(p);

  const dimensions = [clarity, evidence, stakeholders, feasibility, evaluation];
  const total = dimensions.reduce((sum, d) => sum + d.score, 0);

  return {
    total,
    label: labelFor(total),
    dimensions,
  };
}

/* ---------------------------------------------------------------- */
/* Dimension 1 — Problem clarity (20)                               */
/* ---------------------------------------------------------------- */

function scoreClarity(p: Project): ReadinessDimension {
  const nextSteps: string[] = [];
  let score = 0;

  const titleTrimmed = p.title.trim();
  if (titleTrimmed.length >= 3) {
    score += 4;
  } else {
    nextSteps.push("Give the project a short, specific title.");
  }

  if (p.problem.description.length >= 40) {
    score += 4;
  } else {
    nextSteps.push("Describe the problem in at least a full paragraph.");
  }

  if (p.problem.description.length >= 120) {
    score += 4;
  } else if (p.problem.description.length >= 40) {
    nextSteps.push(
      "Make the description more specific — aim for 120+ characters."
    );
  }

  if (p.category !== "") {
    score += 4;
  } else {
    nextSteps.push("Pick the category that fits best.");
  }

  if (p.problem.whoAffected.trim().length >= 10) {
    score += 4;
  } else {
    nextSteps.push("Name who is affected — real people or groups.");
  }

  return {
    key: "clarity",
    label: "Problem clarity",
    score,
    max: 20,
    nextSteps,
  };
}

/* ---------------------------------------------------------------- */
/* Dimension 2 — Evidence & research (20)                           */
/* ---------------------------------------------------------------- */

function scoreEvidence(p: Project): ReadinessDimension {
  const nextSteps: string[] = [];
  let score = 0;

  const noteCount = p.evidence.length;
  if (noteCount >= 1) score += 3;
  if (noteCount >= 2) score += 1;
  if (noteCount >= 3) score += 1;

  if (noteCount === 0) {
    nextSteps.push(
      "Add your first observation or finding as an evidence note."
    );
  }

  const sourcedCount = p.evidence.filter(
    (n) => n.sourceTitle.trim() !== "" && n.sourceUrl.trim() !== ""
  ).length;
  if (sourcedCount >= 1) {
    score += 5;
  } else {
    nextSteps.push(
      "Attach a source title and URL to at least one note."
    );
  }

  const verifiedCount = p.evidence.filter((n) => n.kind === "verified").length;
  if (verifiedCount >= 2) {
    score += 5;
  } else if (verifiedCount === 0) {
    nextSteps.push("Mark at least two notes as verified.");
  } else {
    nextSteps.push("Mark another note as verified.");
  }

  const hasClosedQuestion =
    p.researchQuestions.some((q) => q.done) || p.assumptions.length >= 1;
  if (hasClosedQuestion) {
    score += 5;
  } else {
    nextSteps.push("Mark a research question as complete, or list an assumption.");
  }

  return {
    key: "evidence",
    label: "Evidence & research",
    score,
    max: 20,
    nextSteps,
  };
}

/* ---------------------------------------------------------------- */
/* Dimension 3 — Stakeholder consideration (20)                     */
/* ---------------------------------------------------------------- */

function scoreStakeholders(p: Project): ReadinessDimension {
  const nextSteps: string[] = [];
  let score = 0;

  const stakeholderCount = p.stakeholders.length;
  if (stakeholderCount >= 1) score += 4;
  if (stakeholderCount >= 2) score += 2;
  if (stakeholderCount >= 3) score += 2;

  if (stakeholderCount === 0) {
    nextSteps.push("Add at least one stakeholder group.");
  } else if (stakeholderCount < 3) {
    nextSteps.push(
      "Add another stakeholder group — who else is affected or involved?"
    );
  }

  if (p.decisionMaker.trim().length >= 5) {
    score += 8;
  } else {
    nextSteps.push(
      "Name the official, board, or organization that could actually act on this."
    );
  }

  if (p.assumptions.length >= 1) {
    score += 4;
  } else {
    nextSteps.push("List at least one assumption that needs verification.");
  }

  return {
    key: "stakeholders",
    label: "Stakeholder consideration",
    score,
    max: 20,
    nextSteps,
  };
}

/* ---------------------------------------------------------------- */
/* Dimension 4 — Implementation feasibility (20)                    */
/* ---------------------------------------------------------------- */

function scoreFeasibility(p: Project): ReadinessDimension {
  const nextSteps: string[] = [];
  let score = 0;

  const selectedCount = p.solutions.filter((s) => s.selected).length;
  if (selectedCount === 1) {
    score += 6;
  } else if (selectedCount === 0) {
    nextSteps.push("Choose which approach your proposal will pursue.");
  } else {
    nextSteps.push("Select exactly one solution to move forward with.");
  }

  const selected = p.solutions.find((s) => s.selected);
  if (selected && selected.whyChosen.trim().length >= 20) {
    score += 6;
  } else if (selectedCount === 1) {
    nextSteps.push(
      "Explain why you chose it — this is what makes it your proposal."
    );
  }

  if (p.implementationSteps.length >= 1) {
    score += 4;
  } else {
    nextSteps.push("Break the chosen solution into at least three steps.");
  }

  if (p.implementationSteps.length >= 3) {
    score += 4;
  } else if (p.implementationSteps.length >= 1) {
    nextSteps.push("Add more implementation steps — aim for at least three.");
  }

  return {
    key: "feasibility",
    label: "Implementation feasibility",
    score,
    max: 20,
    nextSteps,
  };
}

/* ---------------------------------------------------------------- */
/* Dimension 5 — Measurable evaluation (20)                         */
/* ---------------------------------------------------------------- */

function scoreEvaluation(p: Project): ReadinessDimension {
  const nextSteps: string[] = [];
  let score = 0;

  if (p.successIndicators.length >= 1) {
    score += 6;
  } else {
    nextSteps.push("Define how you'll know it worked.");
  }

  const hasNumericIndicator = p.successIndicators.some((s) => /\d/.test(s));
  if (hasNumericIndicator) {
    score += 6;
  } else if (p.successIndicators.length >= 1) {
    nextSteps.push("Add a number or time frame — how much, by when?");
  } else {
    nextSteps.push("Add a countable or measurable success indicator.");
  }

  if (p.nextSteps.length >= 1) {
    score += 4;
  } else {
    nextSteps.push("Add at least one next step.");
  }

  if (p.nextSteps.length >= 3) {
    score += 4;
  } else if (p.nextSteps.length >= 1) {
    nextSteps.push("Add more next steps — aim for at least three.");
  }

  return {
    key: "evaluation",
    label: "Measurable evaluation",
    score,
    max: 20,
    nextSteps,
  };
}

function labelFor(total: number): ReadinessReport["label"] {
  if (total <= 39) return "Early draft";
  if (total <= 69) return "Developing proposal";
  return "Ready for further review";
}
