"use client";

import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useRouter } from "next/navigation";
import { StakeholderEditor } from "@/components/investigate/StakeholderEditor";
import { DecisionMakerField } from "@/components/investigate/DecisionMakerField";
import { ResearchQuestionEditor } from "@/components/investigate/ResearchQuestionEditor";
import { AssumptionsEditor } from "@/components/investigate/AssumptionsEditor";

interface StakeholdersClientProps {
  id: string;
}

export default function StakeholdersClient({ id }: StakeholdersClientProps) {
  const router = useRouter();
  const { project, update, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <div className="container section">
      <SectionHeading level={2}>Step 2 — Stakeholders</SectionHeading>
      <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Who is affected by this problem? Who has the authority to act?
      </p>

      <DecisionMakerField project={project} update={update} />
      <StakeholderEditor project={project} update={update} />
      <ResearchQuestionEditor project={project} update={update} />
      <AssumptionsEditor project={project} update={update} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <Button variant="ghost" onClick={() => router.push(`/project/${id}/define`)}>
          Back to Define
        </Button>
        <Button variant="primary" onClick={() => router.push(`/project/${id}/evidence`)}>
          Continue to Evidence
        </Button>
      </div>
    </div>
  );
}
