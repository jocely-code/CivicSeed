"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useProject } from "@/hooks/useProject";
import { suggestSolutions } from "@/lib/solution-templates";
import { Button } from "@/components/ui/Button";
import { SolutionCard } from "./SolutionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReadinessPanel } from "@/components/ReadinessPanel";
import type { SolutionOption } from "@/lib/types";

interface SolutionsStepProps {
  projectId: string;
  onNext: () => void;
  onBack: () => void;
}

export function SolutionsStep({ projectId, onNext, onBack }: SolutionsStepProps) {
  const { project, update, ready, saveError } = useProject(projectId);

  // All hooks run before any early return (React rules of hooks).
  const solutions = useMemo(() => {
    if (!project) return suggestSolutions("", "");
    if (project.solutions.length > 0) return project.solutions;
    return suggestSolutions(project.category, project.problem.description);
  }, [project]);

  // Seed generated solutions into storage on first visit so they persist.
  useEffect(() => {
    if (!project || project.solutions.length > 0) return;
    const generated = suggestSolutions(project.category, project.problem.description);
    update({ solutions: generated });
  }, [project, update]);

  const selectedId = solutions.find((s) => s.selected)?.id;

  const handleSelect = useCallback(
    (id: string) => {
      if (!project) return;
      update({
        solutions: solutions.map((s) => ({
          ...s,
          selected: s.id === id,
        })),
      });
    },
    [solutions, update, project]
  );

  const handleUpdate = useCallback(
    (id: string, patch: Partial<SolutionOption>) => {
      if (!project) return;
      update({
        solutions: solutions.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      });
    },
    [solutions, update, project]
  );

  if (!ready || !project) return null;

  const hasSelected = solutions.some((s) => s.selected);
  const whyChosenFilled = selectedId
    ? solutions.find((s) => s.id === selectedId)?.whyChosen.trim().length ?? 0 >= 20
    : false;

  return (
    <section className="container section">
      {saveError && (
        <div className="save-warning">
          Changes may not be saved in this browser (storage may be full or
          blocked). The app keeps working in memory.
        </div>
      )}

      <header style={{ marginBottom: "2rem" }}>
        <SectionHeading level={2}>Step 4 — Compare solutions</SectionHeading>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
          Three starting-point approaches are suggested based on your category.
          Pick one, edit the details, and explain why you chose it. All
          suggestions are hypothetical starting points that require research.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {solutions.map((s) => (
          <SolutionCard
            key={s.id}
            solution={s}
            isSelected={s.id === selectedId}
            onSelect={handleSelect}
            onUpdate={(id, patch) => handleUpdate(id, patch)}
          />
        ))}
      </div>

      {hasSelected && (
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
            Selected approach:{" "}
            <strong style={{ color: "var(--color-forest)" }}>
              {solutions.find((s) => s.selected)?.title}
            </strong>
          </p>
          {!whyChosenFilled && (
            <p style={{ fontSize: "0.85rem", color: "#C0392B", margin: 0 }}>
              Please explain why you chose this approach (20+ characters).
            </p>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <Button variant="ghost" onClick={onBack}>
          Back to Evidence
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!hasSelected || !whyChosenFilled}
        >
          Continue to Policy Brief
        </Button>
      </div>

      <ReadinessPanel project={project} />
    </section>
  );
}
