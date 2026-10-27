"use client";

import { useProject } from "@/hooks/useProject";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useRouter } from "next/navigation";
import { EvidenceEditor } from "@/components/investigate/EvidenceEditor";

interface EvidenceClientProps {
  id: string;
}

export default function EvidenceClient({ id }: EvidenceClientProps) {
  const router = useRouter();
  const { project, update, updateStep, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <div className="container section">
      <SectionHeading level={2}>Step 3 — Evidence</SectionHeading>
      <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Record what you&rsquo;ve seen, what you&rsquo;ve confirmed, and what you&rsquo;re still
        guessing about. Label each note so nothing is mistaken for fact.
      </p>

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
          onClick={() => {
            updateStep("stakeholders");
            router.push(`/project/${id}/stakeholders`);
          }}
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
          onClick={() => {
            updateStep("solutions");
            router.push(`/project/${id}/solutions`);
          }}
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
}