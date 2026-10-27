"use client";

import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReadinessPanel } from "@/components/ReadinessPanel";
import { EvidenceEditor } from "./EvidenceEditor";
import { StakeholderEditor } from "./StakeholderEditor";
import { DecisionMakerField } from "./DecisionMakerField";
import { ResearchQuestionEditor } from "./ResearchQuestionEditor";
import { AssumptionsEditor } from "./AssumptionsEditor";

interface InvestigateStepProps {
  projectId: string;
  onNext: () => void;
  onBack: () => void;
}

export function InvestigateStep({ projectId, onNext, onBack }: InvestigateStepProps) {
  const { project, update, ready, saveError } = useProject(projectId);

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
        <SectionHeading level={2}>Step 2 &amp; 3 — Investigate</SectionHeading>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
          Name the stakeholders, identify the decision-maker, and gather
          evidence. Label each note so nothing is mistaken for fact.
        </p>
      </header>

      <DecisionMakerField project={project} update={update} />
      <StakeholderEditor project={project} update={update} />
      <ResearchQuestionEditor project={project} update={update} />
      <EvidenceEditor project={project} update={update} />
      <AssumptionsEditor project={project} update={update} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <Button variant="ghost" onClick={onBack}>
          Back to Define
        </Button>
        <Button variant="primary" onClick={onNext}>
          Continue to Solutions
        </Button>
      </div>

      <ReadinessPanel project={project} />
    </section>
  );
}
