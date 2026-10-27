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

  // Extract project id from URL: /project/<id>/<step>
  const segments = pathname.split("/");
  const id = segments[2];

  const { project, ready, saveError } = useProject(id);

  // Redirect to the project's saved step if not already on it.
  useEffect(() => {
    if (!ready || !project) return;
    const current = segments[3]; // the step in the URL
    const expected = project.step;
    if (current !== expected) {
      router.replace(`/project/${id}/${project.step}`);
    }
  }, [ready, project, router, id, segments]);

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

      <Stepper currentStep={project.step} />

      <main>{children}</main>

      <ReadinessPanel project={project} />
    </div>
  );
}
