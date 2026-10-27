"use client";

import { useCallback } from "react";
import { useProject } from "@/hooks/useProject";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/lib/types";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "School", label: "School" },
  { value: "Accessibility", label: "Accessibility" },
  { value: "Public Health", label: "Public Health" },
  { value: "Environment", label: "Environment" },
  { value: "Transportation", label: "Transportation" },
  { value: "Youth Services", label: "Youth Services" },
  { value: "Other", label: "Other" },
];

interface DefineStepProps {
  projectId: string;
  onNext: () => void;
  onBack?: () => void;
}

export function DefineStep({ projectId, onNext, onBack }: DefineStepProps) {
  const { project, update, ready, saveError } = useProject(projectId);

  // All hooks run before any early return (React rules of hooks).
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      update({ title: e.target.value });
    },
    [update]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // project is defined when callbacks fire (early return below).
      update({ problem: { ...project!.problem, description: e.target.value } });
    },
    [update, project]
  );

  const handleWhoAffectedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // project is defined when callbacks fire (early return below).
      update({ problem: { ...project!.problem, whoAffected: e.target.value } });
    },
    [update, project]
  );

  const handleObservationsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // project is defined when callbacks fire (early return below).
      update({ problem: { ...project!.problem, observations: e.target.value } });
    },
    [update, project]
  );

  const handleOpenQuestionsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // project is defined when callbacks fire (early return below).
      update({ problem: { ...project!.problem, openQuestions: e.target.value } });
    },
    [update, project]
  );

  const handleCategorySelect = useCallback(
    (value: string) => {
      update({ category: value as Project["category"] });
    },
    [update]
  );

  if (!ready || !project) {
    return null;
  }

  return (
    <section className="container section">
      {saveError && (
        <div className="save-warning">
          Changes may not be saved in this browser (storage may be full or
          blocked). The app keeps working in memory.
        </div>
      )}

      <header style={{ marginBottom: "2rem" }}>
        <SectionHeading level={2}>Step 1 — Define the problem</SectionHeading>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
          Give your project a title, pick a category, and describe the problem
          you want to solve.
        </p>
      </header>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Project title"
          value={project.title}
          onChange={handleTitleChange}
          placeholder="e.g. Reducing School Lunch Wait Times"
        />

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}>
            Category
          </label>
          <select
            value={project.category}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="input select"
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {project.category === "" && (
            <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#C0392B" }}>
              Please pick a category.
            </p>
          )}
        </div>

        <TextArea
          label="Problem description"
          value={project.problem.description}
          onChange={handleDescriptionChange}
          placeholder="Describe the problem in detail — what is happening, where, and why it matters."
        />

        <TextField
          label="Who is affected?"
          value={project.problem.whoAffected}
          onChange={handleWhoAffectedChange}
          placeholder="Name the people or groups impacted by this problem."
        />

        <TextArea
          label="What have you personally observed?"
          value={project.problem.observations}
          onChange={handleObservationsChange}
          placeholder="Describe what you have seen firsthand."
        />

        <TextArea
          label="What do you still need to find out?"
          value={project.problem.openQuestions}
          onChange={handleOpenQuestionsChange}
          placeholder="List the questions you need to research before moving forward."
        />
      </form>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
        <Button variant="primary" onClick={onNext}>
          Continue to Investigate
        </Button>
      </div>
    </section>
  );
}
