"use client";

import type { StepKey } from "@/lib/types";

const STEP_ORDER: StepKey[] = [
  "define",
  "stakeholders",
  "evidence",
  "solutions",
  "brief",
];

const STEP_LABELS: Record<StepKey, { label: string; desc: string }> = {
  define: { label: "Define", desc: "The problem" },
  stakeholders: { label: "Stakeholders", desc: "Who is affected" },
  evidence: { label: "Evidence", desc: "Research & sources" },
  solutions: { label: "Solutions", desc: "Compare approaches" },
  brief: { label: "Brief", desc: "Policy brief" },
};

interface StepperProps {
  currentSteps?: StepKey[];
  className?: string;
}

export function Stepper({ currentSteps = [], className }: StepperProps) {
  return (
    <nav
      className={["stepper", className].filter(Boolean).join(" ")}
      aria-label="Project progress"
    >
      <ol className="stepper__list">
        {STEP_ORDER.map((key, index) => {
          const highestIndex = Math.max(...currentSteps.map((s) => STEP_ORDER.indexOf(s)));
          const isDone = highestIndex > index;
          const isCurrent = currentSteps.includes(key);
          const { label, desc } = STEP_LABELS[key];
          return (
            <li
              key={key}
              className={`stepper__step ${
                isDone ? "stepper__step--done" : ""
              } ${isCurrent ? "stepper__step--current" : ""}`}
            >
              <span className="stepper__number">{index + 1}</span>
              <span className="stepper__label">{label}</span>
              <span className="stepper__desc">{desc}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
