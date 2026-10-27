"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { Hero } from "@/components/home/Hero";
import { ContinueDraft } from "@/components/home/ContinueDraft";
import { ProjectList } from "@/components/home/ProjectList";
import { SampleProject } from "@/components/home/SampleProject";
import { Stepper } from "@/components/Stepper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Home() {
  const router = useRouter();
  const { projects, create, remove, ready, saveError } = useProjects();

  if (!ready) {
    return (
      <main className="container section">
        <EmptyState title="Loading…" description="Please wait." />
      </main>
    );
  }

  const mostRecent = projects[0];
  const openProject = (id: string) => {
    router.push(`/project/${id}/define`);
  };

  return (
    <main className="container section">
      <Hero onCreate={() => create()} />

      <section style={{ marginTop: "3rem" }}>
        <ContinueDraft project={mostRecent} onOpen={openProject} />
      </section>

      <section style={{ marginTop: "3rem" }}>
        <ProjectList
          projects={projects}
          onOpen={openProject}
          onDelete={remove}
        />
      </section>

      {saveError && (
        <div className="save-warning">
          Changes may not be saved in this browser (storage may be full or
          blocked). The app keeps working in memory.
        </div>
      )}

      <section style={{ marginTop: "3rem" }}>
        <SectionHeading level={3}>How it works</SectionHeading>
        <Stepper />
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
          Five steps from problem to policy brief. Each step saves
          automatically as you work.
        </p>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <SampleProject />
      </section>
    </main>
  );
}
