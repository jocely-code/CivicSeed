"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

interface ProjectListProps {
  projects: Project[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectList({
  projects,
  onOpen,
  onDelete,
}: ProjectListProps) {
  return (
    <section>
      <SectionHeading level={3}>My projects</SectionHeading>
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Your saved projects will appear here."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={onOpen}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
