"use client";

import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useRouter } from "next/navigation";

interface SolutionsClientProps {
  id: string;
}

export default function SolutionsClient({ id }: SolutionsClientProps) {
  const router = useRouter();
  const { project, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <div className="container section">
      <SectionHeading level={2}>Step 4 — Compare solutions (coming soon)</SectionHeading>
      <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
        Rule-based solution suggestions will appear here in Phase 6.
      </p>
      <Button variant="ghost" onClick={() => router.push(`/project/${id}/evidence`)}>
        Back to Evidence
      </Button>
    </div>
  );
}
