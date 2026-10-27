import { SproutLogo } from "@/components/SproutLogo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <main className="container section">
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

      <section>
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
          Turn a school or community problem into an evidence-based policy
          brief — with a real 0&ndash;100 Policy Readiness Check.
        </p>
        <Button variant="primary">Plant your first idea</Button>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <SectionHeading level={3}>Continue drafting</SectionHeading>
        <EmptyState
          title="No drafts yet"
          description="Start your first project to pick up where you left off."
        />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <SectionHeading level={3}>My projects</SectionHeading>
        <EmptyState
          title="No projects yet"
          description="Your saved projects will appear here."
        />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <SectionHeading level={3}>How it works</SectionHeading>
        <Card>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--color-text-muted)",
              margin: 0,
            }}
          >
            This is a demonstration shell. The five steps &mdash; Define,
            Stakeholders, Evidence, Solutions, Brief &mdash; will appear here
            once you create a project.
          </p>
        </Card>
      </section>
    </main>
  );
}
