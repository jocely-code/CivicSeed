"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useProject } from "@/hooks/useProject";

interface ProjectRedirectClientProps {
  id: string;
}

export default function ProjectRedirectClient({ id }: ProjectRedirectClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { project, ready } = useProject(id);

  useEffect(() => {
    if (!ready) return;
    if (!project) {
      router.push("/");
      return;
    }
    // Extract current step from URL
    const match = pathname.match(/\/project\/[^/]+\/([^/]+)/);
    const currentStep = match?.[1];
    if (currentStep !== project.step) {
      router.replace(`/project/${id}/${project.step}`);
    }
  }, [ready, project, router, id, pathname]);

  return null;
}
