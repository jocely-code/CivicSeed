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
    solutions: [
      {
        id: "sol-1",
        templateId: "Add an express or fast lane",
        title: "Add an express or fast lane",
        action:
          "Open a second service line for students with simple orders (e.g. pre-packed meals) to split traffic.",
        benefits:
          "Reduces wait time for the largest group of students with minimal new staffing.",
        limitations:
          "Doesn't help students with complex orders; needs extra counter space.",
        difficulty: "Medium",
        unintended:
          "Students in the regular line may feel the express line is unfair if eligibility isn't clear.",
        selected: true,
        whyChosen:
          "This is the fastest to implement and directly reduces wait time for most students.",
        userEdited: true,
      },
      {
        id: "sol-2",
        templateId: "Stagger lunch periods by grade",
        title: "Stagger lunch periods by grade",
        action:
          "Release grades to lunch in rotating waves so not all students arrive at the line at once.",
        benefits: "Spreads demand evenly across the lunch period; no construction needed.",
        limitations: "Requires changing the bell schedule and coordinating with teachers.",
        difficulty: "Low",
        unintended:
          "Some students may get lunch unusually early or late, affecting after-class focus.",
        selected: false,
        whyChosen: "",
        userEdited: false,
      },
      {
        id: "sol-3",
        templateId: "Pre-order lunch via classroom sign-up",
        title: "Pre-order lunch via classroom sign-up",
        action:
          "Students submit lunch orders in homeroom; kitchen pre-assembles meals for faster pickup.",
        benefits: "Cuts line time to near zero for participants; improves order accuracy.",
        limitations: "Needs daily sign-up discipline and kitchen prep lead time.",
        difficulty: "High",
        unintended:
          "Students who forget to sign up may still face long waits at pickup.",
        selected: false,
        whyChosen: "",
        userEdited: false,
      },
    ],
    implementationSteps: [
      "Get principal approval for a pilot express line.",
      "Train cafeteria staff on the new line process.",
      "Post clear signage so students know which line to use.",
      "Track wait times for two weeks before and after the change.",
    ],
    successIndicators: [
      "Average lunch wait time drops from 20 minutes to 10 minutes or less.",
      "At least 80% of students finish eating before the bell.",
    ],
    nextSteps: [
      "Present pilot results to the school board.",
      "If successful, make the express line permanent.",
    ],
  };
}
