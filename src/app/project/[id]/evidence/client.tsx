"use client";

import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useRouter } from "next/navigation";
import { EvidenceEditor } from "@/components/investigate/EvidenceEditor";

interface EvidenceClientProps {
  id: string;
}

export default function EvidenceClient({ id }: EvidenceClientProps) {
  const router = useRouter();
  const { project, update, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <div className="container section">
      <SectionHeading level={2}>Step 3 — Evidence</SectionHeading>
      <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Record what you’ve seen, what you’ve confirmed, and what you’re still
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
        <Button variant="ghost" onClick={() => router.push(`/project/${id}/stakeholders`)}>
          Back to Stakeholders
        </Button>
        <Button variant="primary" onClick={() => router.push(`/project/${id}/solutions`)}>
          Continue to Solutions
        </Button>
      </div>
    </div>
  );
}
