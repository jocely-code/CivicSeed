"use client";

import { SproutLogo } from "@/components/SproutLogo";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface HeroProps {
  onCreate: () => void;
}

export function Hero({ onCreate }: HeroProps) {
  return (
    <section>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <SproutLogo className="logo" />
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--color-forest)",
          }}
        >
          CivicSeed
        </span>
      </header>

      <SectionHeading level={2}>
        Every big change starts somewhere.
      </SectionHeading>
      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--color-text-muted)",
          marginBottom: "1.5rem",
        }}
      >
        Turn a school or community problem into an evidence-based policy brief
        — with a real 0&ndash;100 Policy Readiness Check.
      </p>
      <Button variant="primary" onClick={onCreate}>
        Plant your first idea
      </Button>
    </section>
  );
}
