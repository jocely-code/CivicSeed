"use client";

import { useCallback, useState } from "react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface AssumptionsEditorProps {
  project: Project;
  update: (patch: Partial<Project>) => void;
}

export function AssumptionsEditor({ project, update }: AssumptionsEditorProps) {
  const [newAssumption, setNewAssumption] = useState("");

  const handleAddAssumption = useCallback(() => {
    const trimmed = newAssumption.trim();
    if (!trimmed) return;
    if (project.assumptions.includes(trimmed)) return;

    update({ assumptions: [...project.assumptions, trimmed] });
    setNewAssumption("");
  }, [newAssumption, project.assumptions, update]);

  const handleRemoveAssumption = useCallback(
    (toRemove: string) => {
      update({
        assumptions: project.assumptions.filter((a) => a !== toRemove),
      });
    },
    [project.assumptions, update]
  );

  return (
    <section>
      <SectionHeading level={3}>Assumptions</SectionHeading>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        What are you assuming that still needs verification? Naming uncertainty
        is part of good research.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <TextField
          label="Assumption"
          value={newAssumption}
          onChange={(e) => setNewAssumption(e.target.value)}
          placeholder="e.g. Students would use an express line if one existed"
        />
        <Button variant="primary" onClick={handleAddAssumption} disabled={!newAssumption.trim()}>
          Add
        </Button>
      </div>

      {project.assumptions.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          No assumptions yet. Add your first assumption above.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {project.assumptions.map((a) => (
            <div
              key={a}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-paper)",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "var(--color-ink)" }}>
                {a}
              </span>
              <Button variant="ghost" onClick={() => handleRemoveAssumption(a)} style={{ fontSize: "0.8rem", color: "#C0392B" }}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
