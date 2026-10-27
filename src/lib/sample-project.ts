/**
 * CivicSeed — preloaded sample project ("Reducing School Lunch Wait Times").
 *
 * This is a demonstration project, clearly marked `isSample: true`. Every
 * screen that renders it carries a "demonstration — hypothetical, not
 * established fact" label.
 *
 * The sample scores 41 → "Developing proposal" per the scoring engine, so
 * a reviewer can watch the score climb in real time as they fill in a
 * decision-maker, add sourced evidence, pick a solution, and write
 * measurable indicators.
 */

import type { Project } from "./types";

const NOW = new Date().toISOString();

export function makeSampleProject(): Project {
  return {
    schemaVersion: 1,
    id: "sample-lunch-wait-times",
    isSample: true,
    createdAt: NOW,
    updatedAt: NOW,
    step: "define",
    title: "Reducing School Lunch Wait Times",
    category: "School",
    problem: {
      description:
        "Students at our high school routinely wait 15-20 minutes in the lunch line, " +
        "leaving less than 10 minutes to eat before the next period starts. " +
        "This means many students skip lunch or eat rushed, unhealthy meals, " +
        "which affects concentration and energy in afternoon classes.",
      whoAffected: "All students who buy lunch at school, especially those with short lunch periods",
      observations:
        "I have personally seen students leave the cafeteria with uneaten food " +
        "because the bell rang while they were still in line.",
      openQuestions:
        "What is the average wait time by grade? How many lunch lines are open?",
    },
    stakeholders: [
      "Students",
      "Cafeteria staff",
      "School administrators",
      "Parents",
    ],
    decisionMaker: "",
    researchQuestions: [
      { id: "rq-1", text: "How long is the average wait time by grade level?", done: false },
      { id: "rq-2", text: "How many lunch lines are open during each period?", done: false },
    ],
    evidence: [
      {
        id: "ev-1",
        kind: "observation",
        text: "Students leave uneaten food because the bell rings while they are still in line.",
        sourceTitle: "",
        sourceUrl: "",
        createdAt: NOW,
      },
      {
        id: "ev-2",
        kind: "assumption",
        text: "Adding a second lunch line would cut wait times in half.",
        sourceTitle: "",
        sourceUrl: "",
        createdAt: NOW,
      },
    ],
    assumptions: ["Students would use an express line if one existed."],
    solutions: [],
    implementationSteps: [],
    successIndicators: [],
    nextSteps: [],
  };
}
