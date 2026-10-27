"use client";

import { useEffect } from "react";
import { Stepper } from "@/components/Stepper";
import { ReadinessPanel } from "@/components/ReadinessPanel";
import { useProject } from "@/hooks/useProject";
import { usePathname, useRouter } from "next/navigation";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract project id and step from URL: /project/<id>/<step>
  const segments = pathname.split("/");
  const id = segments[2];
  const urlStep = segments[3];

  const { project, ready, saveError } = useProject(id);

  // Determine which stepper steps are current.
  // The investigate page covers both stakeholders (2) and evidence (3).
  const currentSteps: string[] = [];
  if (urlStep) {
    if (urlStep === "investigate") {
      currentSteps.push("stakeholders", "evidence");
    } else {
      currentSteps.push(urlStep);
    }
  }

  // Redirect to the project's saved step if not already on it.
  useEffect(() => {
    if (!ready || !project) return;
    if (urlStep !== project.step) {
      router.replace(`/project/${id}/${project.step}`);
    }
  }, [ready, project, router, id, urlStep]);

  if (!ready || !project) {
    return null;
  }

  return (
    <div className="container section">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            className="save-warning"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
          >
            Changes may not be saved — storage may be full or blocked.
          </span>
        )}
      </header>

      <Stepper currentSteps={currentSteps as import("@/lib/types").StepKey[]} />

      <main>{children}</main>

      <ReadinessPanel project={project} />
    </div>
  );
}
