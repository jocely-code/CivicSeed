"use client";

import { useCallback } from "react";
import type { SolutionOption } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DIFFICULTY_COLORS: Record<SolutionOption["difficulty"], string> = {
  Low: "#1E8449",
  Medium: "#B7950B",
  High: "#C0392B",
};

interface SolutionCardProps {
  solution: SolutionOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<SolutionOption>) => void;
}

export function SolutionCard({
  solution,
  isSelected,
  onSelect,
  onUpdate,
}: SolutionCardProps) {
  const handleActionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(solution.id, { action: e.target.value, userEdited: true });
    },
    [solution.id, onUpdate]
  );

  const handleBenefitsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(solution.id, { benefits: e.target.value, userEdited: true });
    },
    [solution.id, onUpdate]
  );

  const handleLimitationsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(solution.id, { limitations: e.target.value, userEdited: true });
    },
    [solution.id, onUpdate]
  );

  const handleUnintendedChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(solution.id, {
        unintended: e.target.value,
        userEdited: true,
      });
    },
    [solution.id, onUpdate]
  );

  const handleWhyChosenChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(solution.id, { whyChosen: e.target.value, userEdited: true });
    },
    [solution.id, onUpdate]
  );

  return (
    <article
      style={{
        border: `2px solid ${isSelected ? "var(--color-forest)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        background: isSelected ? "var(--color-cream)" : "var(--color-paper)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
        <div>
          <SectionHeading level={4}>{solution.title}</SectionHeading>
          <span
            style={{
              display: "inline-block",
              marginTop: "var(--space-xs)",
              padding: "0.15rem 0.5rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: DIFFICULTY_COLORS[solution.difficulty],
              border: `1px solid ${DIFFICULTY_COLORS[solution.difficulty]}`,
            }}
          >
            Difficulty: {solution.difficulty}
          </span>
        </div>
        <Button
          variant={isSelected ? "primary" : "ghost"}
          onClick={() => onSelect(solution.id)}
          style={{ fontSize: "0.85rem" }}
        >
          {isSelected ? "Selected" : "Select this approach"}
        </Button>
      </div>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "var(--space-xs)" }}>
          Proposed action
        </label>
        <TextArea
          label=""
          value={solution.action}
          onChange={handleActionChange}
          rows={3}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "var(--space-xs)" }}>
            Potential benefits
          </label>
          <TextArea label="" value={solution.benefits} onChange={handleBenefitsChange} rows={3} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "var(--space-xs)" }}>
            Potential limitations
          </label>
          <TextArea label="" value={solution.limitations} onChange={handleLimitationsChange} rows={3} />
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "var(--space-xs)" }}>
          Potential unintended consequences
        </label>
        <TextArea label="" value={solution.unintended} onChange={handleUnintendedChange} rows={3} />
      </div>

      {isSelected && (
        <div style={{ marginTop: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--color-border)" }}>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "var(--space-xs)" }}>
            Why did you choose this approach?
          </label>
          <TextArea label="" value={solution.whyChosen} onChange={handleWhyChosenChange} rows={3} placeholder="Explain why this is the best approach for your situation…" />
        </div>
      )}

      {!isSelected && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
          Select this approach to edit its details and explain your choice.
        </p>
      )}
    </article>
  );
}
