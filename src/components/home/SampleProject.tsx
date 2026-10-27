"use client";

import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SampleProject() {
  return (
    <section>
      <SectionHeading level={3}>Sample project</SectionHeading>
      <Card>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", margin: 0 }}>
          “Reducing School Lunch Wait Times” &mdash; a demonstration project
          that shows how CivicSeed works. It&rsquo;s hypothetical, not
          established fact, and safe to explore or delete.
        </p>
      </Card>
    </section>
  );
}
