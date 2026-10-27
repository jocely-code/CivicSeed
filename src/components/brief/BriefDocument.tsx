"use client";

import { useCallback } from "react";
import { useProject } from "@/hooks/useProject";
import { buildBrief } from "@/lib/brief";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReadinessPanel } from "@/components/ReadinessPanel";

interface BriefDocumentProps {
  projectId: string;
  onCopy: () => void;
  onPrint: () => void;
}

export function BriefDocument({
  projectId,
  onCopy,
  onPrint,
}: BriefDocumentProps) {
  const { project, update, ready } = useProject(projectId);

  // All hooks run before any early return (React rules of hooks).
  const sections = ready && project ? buildBrief(project) : [];

  const handleSectionChange = useCallback(
    (key: string, value: string) => {
      if (!project) return;
      const patch: Partial<Project> = {};
      switch (key) {
        case "projectTitle":
          patch.title = value;
          break;
        case "category":
          patch.category = value as Project["category"];
          break;
        case "problemDescription":
          patch.problem = { ...project.problem, description: value };
          break;
        case "whoAffected":
          patch.problem = { ...project.problem, whoAffected: value };
          break;
        case "observations":
          patch.problem = { ...project.problem, observations: value };
          break;
        case "openQuestions":
          patch.problem = { ...project.problem, openQuestions: value };
          break;
        case "stakeholders":
          patch.stakeholders = value.split(",").map((s) => s.trim()).filter(Boolean);
          break;
        case "decisionMaker":
          patch.decisionMaker = value;
          break;
        case "implementationSteps":
          patch.implementationSteps = value.split("\n").map((s) => s.trim()).filter(Boolean);
          break;
        case "successIndicators":
          patch.successIndicators = value.split("\n").map((s) => s.trim()).filter(Boolean);
          break;
        case "nextSteps":
          patch.nextSteps = value.split("\n").map((s) => s.trim()).filter(Boolean);
          break;
        case "chosenSolution": {
          const selected = project.solutions.find((s) => s.selected);
          if (selected) {
            patch.solutions = project.solutions.map((s) =>
              s.id === selected.id ? { ...s, title: value } : s
            );
          }
          break;
        }
        case "whyChosen": {
          const selected = project.solutions.find((s) => s.selected);
          if (selected) {
            patch.solutions = project.solutions.map((s) =>
              s.id === selected.id ? { ...s, whyChosen: value } : s
            );
          }
          break;
        }
      }
      update(patch);
    },
    [project, update]
  );

  if (!ready || !project) return null;

  return (
    <section className="container section">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <SectionHeading level={2}>Step 5 — Policy Brief</SectionHeading>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            Every section below contains your own saved answers. Empty fields
            show &ldquo;not yet defined&rdquo; — nothing is invented. Edit anything,
            then copy or print.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="ghost" onClick={onCopy}>
            Copy Brief
          </Button>
          <Button variant="ghost" onClick={onPrint}>
            Print / Save as PDF
          </Button>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {sections.map((section) => (
          <div
            key={section.key}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-md)",
              background: "var(--color-paper)",
            }}
          >
            <SectionHeading level={3}>{section.title}</SectionHeading>
            <TextArea
              label=""
              value={section.content}
              onChange={(e) => handleSectionChange(section.key, e.target.value)}
              rows={section.content.length > 200 ? 6 : 4}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>

      <ReadinessPanel project={project} />
    </section>
  );
}
