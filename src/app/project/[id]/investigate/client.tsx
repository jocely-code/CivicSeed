"use client";

import { useProject } from "@/hooks/useProject";
import { InvestigateStep } from "@/components/investigate/InvestigateStep";
import { useRouter } from "next/navigation";

interface InvestigateClientProps {
  id: string;
}

export default function InvestigateClient({ id }: InvestigateClientProps) {
  const router = useRouter();
  const { project, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <InvestigateStep
      projectId={id}
      onBack={() => router.push(`/project/${id}/define`)}
      onNext={() => router.push(`/project/${id}/solutions`)}
    />
  );
}
