"use client";

import { useProject } from "@/hooks/useProject";
import { briefToPlainText } from "@/lib/brief";
import { BriefDocument } from "@/components/brief/BriefDocument";

interface BriefClientProps {
  id: string;
}

export default function BriefClient({ id }: BriefClientProps) {
  const { project, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <BriefDocument
      projectId={id}
      onCopy={() => {
        const text = briefToPlainText(project);
        navigator.clipboard.writeText(text).then(() => {
          alert("Brief copied to clipboard!");
        });
      }}
      onPrint={() => {
        window.print();
      }}
    />
  );
}