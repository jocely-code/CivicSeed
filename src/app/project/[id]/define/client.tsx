"use client";

import { useProject } from "@/hooks/useProject";
import { DefineStep } from "@/components/define/DefineStep";
import { useRouter } from "next/navigation";

interface DefinePageClientProps {
  id: string;
}

export default function DefinePageClient({ id }: DefinePageClientProps) {
  const router = useRouter();
  const { project, update, ready } = useProject(id);

  if (!ready || !project) return null;

  return (
    <DefineStep
      projectId={id}
      onNext={() => {
        update({ step: "stakeholders" });
        router.push(`/project/${id}/stakeholders`);
      }}
    />
  );
}