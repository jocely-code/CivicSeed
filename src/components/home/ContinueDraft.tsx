"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/lib/types";

interface ContinueDraftProps {
  project: Project | undefined;
  onOpen: (id: string) => void;
}

export function ContinueDraft({ project, onOpen }: ContinueDraftProps) {
  return (
    <section>
      <SectionHeading level={3}>Continue drafting</SectionHeading>
      {!project ? (
        <EmptyState
          title="No drafts yet"
          description="Start your first project to pick up where you left off."
        />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "600", color: "var(--color-ink)" }}>
              {project.title}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Step {stepLabel(project.step)} &middot; updated {formatDate(
              project.updatedAt
            )}
            </div>
          </div>
          <button
            onClick={() => onOpen(project.id)}
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
            Open
          </button>
        </div>
      )}
    </section>
  );
}

function stepLabel(key: string): string {
  const labels: Record<string, string> = {
    define: "Define",
    stakeholders: "Stakeholders",
    evidence: "Evidence",
    solutions: "Solutions",
    brief: "Brief",
  };
  return labels[key] ?? key;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
