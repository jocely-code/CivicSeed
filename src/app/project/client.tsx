"use client";

import { useEffect } from "react";
import { Stepper } from "@/components/Stepper";
import { ReadinessPanel } from "@/components/ReadinessPanel";
import { useProject } from "@/hooks/useProject";
import { useRouter } from "next/navigation";
import { DefineStep } from "@/components/define/DefineStep";
import { StakeholderEditor } from "@/components/investigate/StakeholderEditor";
import { DecisionMakerField } from "@/components/investigate/DecisionMakerField";
import { ResearchQuestionEditor } from "@/components/investigate/ResearchQuestionEditor";
import { EvidenceEditor } from "@/components/investigate/EvidenceEditor";
import { AssumptionsEditor } from "@/components/investigate/AssumptionsEditor";
import { SolutionsStep } from "@/components/solutions/SolutionsStep";
import { BriefDocument } from "@/components/brief/BriefDocument";
import type { StepKey } from "@/lib/types";

interface ProjectClientProps {
  id: string;
  step: string;
}

export default function ProjectClient({ id, step: initialStep }: ProjectClientProps) {
  const router = useRouter();
  const { project, update, ready, saveError } = useProject(id);

  // Use step from URL query param (passed as prop from server component).
  const urlStep = initialStep || "define";

  // Redirect to home if project doesn't exist.
  useEffect(() => {
    if (ready && !project && id) {
      router.push("/");
    }
  }, [ready, project, id, router]);

  // Determine which stepper steps are current.
  const currentSteps: string[] = [];
  if (urlStep) {
    currentSteps.push(urlStep);
  }

  if (!ready || !project) {
    return null;
  }

  // Render the active step component.
  let stepContent: React.ReactNode = null;
  switch (urlStep) {
    case "define":
      stepContent = (
        <DefineStep
          projectId={id}
          onNext={() => router.push(`/project?id=${id}&step=stakeholders`)}
        />
      );
      break;
    case "stakeholders":
      stepContent = (
        <div className="container section">
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
            <button
              onClick={() => router.push(`/project?id=${id}&step=define`)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "var(--color-blue)",
                fontSize: "0.9rem",
              }}
            >
              ← Back to Define
            </button>
            <button
              onClick={() => router.push(`/project?id=${id}&step=evidence`)}
              style={{
                background: "var(--color-forest)",
                border: "none",
                color: "var(--color-paper)",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Continue to Evidence
            </button>
          </div>
        </div>
      );
      break;
    case "evidence":
      stepContent = (
        <div className="container section">
          <EvidenceEditor project={project} update={update} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={() => router.push(`/project?id=${id}&step=stakeholders`)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "var(--color-blue)",
                fontSize: "0.9rem",
              }}
            >
              ← Back to Stakeholders
            </button>
            <button
              onClick={() => router.push(`/project?id=${id}&step=solutions`)}
              style={{
                background: "var(--color-forest)",
                border: "none",
                color: "var(--color-paper)",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Continue to Solutions
            </button>
          </div>
        </div>
      );
      break;
    case "solutions":
      stepContent = (
        <SolutionsStep
          projectId={id}
          onNext={() => router.push(`/project?id=${id}&step=brief`)}
          onBack={() => router.push(`/project?id=${id}&step=evidence`)}
        />
      );
      break;
    case "brief":
      stepContent = (
        <BriefDocument
          projectId={id}
          onCopy={() => {}}
          onPrint={() => window.print()}
        />
      );
      break;
    default:
      stepContent = (
        <DefineStep
          projectId={id}
          onNext={() => router.push(`/project?id=${id}&step=stakeholders`)}
        />
      );
  }

  return (
    <div className="container section">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "var(--color-blue)",
              fontSize: "0.9rem",
            }}
          >
            ← Back to home
          </button>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--color-forest)",
            }}
          >
            {project.title || "Untitled project"}
          </span>
        </div>
        {saveError && (
          <span
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "0.8rem",
              background: "#FDF2F2",
              border: "1px solid #C0392B",
              color: "#C0392B",
              borderRadius: "var(--radius-md)",
            }}
          >
            Changes may not be saved — storage may be full or blocked.
          </span>
        )}
      </header>

      <Stepper currentSteps={currentSteps as StepKey[]} />

      <main>{stepContent}</main>

      <ReadinessPanel project={project} />
    </div>
  );
}
