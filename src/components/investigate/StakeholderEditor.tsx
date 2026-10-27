"use client";

import { useCallback, useState } from "react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface StakeholderEditorProps {
  project: Project;
  update: (patch: Partial<Project>) => void;
}

export function StakeholderEditor({ project, update }: StakeholderEditorProps) {
  const [newStakeholder, setNewStakeholder] = useState("");

  const handleAddStakeholder = useCallback(() => {
    const trimmed = newStakeholder.trim();
    if (!trimmed) return;
    if (project.stakeholders.includes(trimmed)) return;

    update({ stakeholders: [...project.stakeholders, trimmed] });
    setNewStakeholder("");
  }, [newStakeholder, project.stakeholders, update]);

  const handleRemoveStakeholder = useCallback(
    (toRemove: string) => {
      update({
        stakeholders: project.stakeholders.filter((s) => s !== toRemove),
      });
    },
    [project.stakeholders, update]
  );

  return (
    <section>
      <SectionHeading level={3}>Stakeholders</SectionHeading>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Who is affected by this problem? Who else is involved or has a stake
        in the outcome?
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <TextField
          label="Stakeholder group"
          value={newStakeholder}
          onChange={(e) => setNewStakeholder(e.target.value)}
          placeholder="e.g. Students, cafeteria staff, parents"
        />
        <Button variant="primary" onClick={handleAddStakeholder} disabled={!newStakeholder.trim()}>
          Add
        </Button>
      </div>

      {project.stakeholders.length === 0 ? (
        <EmptyState
          title="No stakeholders yet"
          description="Add the groups affected by this problem."
        />
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {project.stakeholders.map((s) => (
            <span
              key={s}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--color-cream)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "0.35rem 0.75rem",
                fontSize: "0.9rem",
                color: "var(--color-ink)",
              }}
            >
              {s}
              <button
                onClick={() => handleRemoveStakeholder(s)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: "#C0392B",
                  fontSize: "0.8rem",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
