"use client";

import { useMemo } from "react";
import { scoreReadiness } from "@/lib/scoring";
import type { Project } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ReadinessPanelProps {
  project: Project;
  className?: string;
}

export function ReadinessPanel({ project, className }: ReadinessPanelProps) {
  const report = useMemo(() => scoreReadiness(project), [project]);

  return (
    <Card className={className}>
      <SectionHeading level={3}>Policy Readiness Check</SectionHeading>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: "600",
            color: "var(--color-forest)",
          }}
        >
          {report.total}
        </span>
        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            color: labelColor(report.label),
          }}
        >
          {report.label}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {report.dimensions.map((d) => (
          <div key={d.key} style={{ fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
              <span>{d.label}</span>
              <span>{d.score} / {d.max}</span>
            </div>
            <div
              style={{
                height: "6px",
                background: "var(--color-border)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(d.score / d.max) * 100}%`,
                  background: "var(--color-forest)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <SectionHeading level={4}>Next steps</SectionHeading>
        <ul style={{ margin: "0.5rem 0 0 1.25rem", padding: 0 }}>
          {report.dimensions.flatMap((d) =>
            d.nextSteps.map((step) => (
              <li key={`${d.key}-${step}`} style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>
                {step}
              </li>
            ))
          )}
        </ul>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
        This score measures how complete your research and reasoning are. It
        does not predict whether a proposal will succeed or be adopted.
      </p>
    </Card>
  );
}

function labelColor(label: string): string {
  switch (label) {
    case "Early draft":
      return "#C0392B";
    case "Developing proposal":
      return "#B7950B";
    case "Ready for further review":
      return "#1E8449";
    default:
      return "var(--color-text-muted)";
  }
}
