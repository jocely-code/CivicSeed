"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onOpen, onDelete }: ProjectCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <article className="project-card">
      <div>
        <SectionHeading level={4}>{project.title}</SectionHeading>
        <div className="project-card__meta">
          <span>{project.category}</span>
          <span>{stepLabel(project.step)}</span>
          <span>{formatDate(project.updatedAt)}</span>
          {project.isSample && (
            <span style={{ color: "var(--color-blue)" }}>
              demonstration
            </span>
          )}
        </div>
      </div>
      <div className="project-card__actions">
        <Button variant="ghost" onClick={() => onOpen(project.id)}>
          Open
        </Button>
        <Button
          variant="ghost"
          onClick={() => setConfirmOpen(true)}
          style={{ color: "#C0392B" }}
        >
          Delete
        </Button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete project?"
        message={`Delete “${project.title}”? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(project.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
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
