"use client";

import { useProject } from "@/hooks/useProject";
import { SolutionsStep } from "@/components/solutions/SolutionsStep";
import { useRouter } from "next/navigation";

interface SolutionsClientProps {
  id: string;
}

export default function SolutionsClient({ id }: SolutionsClientProps) {
  const router = useRouter();
  const { project, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <SolutionsStep
      projectId={id}
      onBack={() => router.push(`/project/${id}/evidence`)}
      onNext={() => router.push(`/project/${id}/brief`)}
    />
  );
}
