"use client";

import { useCallback } from "react";
import type { Project } from "@/lib/types";
import { TextField } from "@/components/ui/TextField";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface DecisionMakerFieldProps {
  project: Project;
  update: (patch: Partial<Project>) => void;
}

export function DecisionMakerField({ project, update }: DecisionMakerFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      update({ decisionMaker: e.target.value });
    },
    [update]
  );

  return (
    <section>
      <SectionHeading level={3}>Decision-maker</SectionHeading>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Who has the authority to act on this? Name the government body,
        official, or organization.
      </p>
      <TextField
        label="Decision-maker"
        value={project.decisionMaker}
        onChange={handleChange}
        placeholder="e.g. School board, city council, principal"
      />
      {project.decisionMaker.trim().length > 0 && project.decisionMaker.trim().length < 5 && (
        <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#C0392B" }}>
          Please name the specific body or official.
        </p>
      )}
    </section>
  );
}
