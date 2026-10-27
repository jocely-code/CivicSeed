"use client";

import { useCallback, useState } from "react";
import type { ResearchQuestion } from "@/lib/types";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ResearchQuestionEditorProps {
  project: Project;
  update: (patch: Partial<Project>) => void;
}

export function ResearchQuestionEditor({
  project,
  update,
}: ResearchQuestionEditorProps) {
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = useCallback(() => {
    const trimmed = newQuestion.trim();
    if (!trimmed) return;

    const question: ResearchQuestion = {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
    };

    update({ researchQuestions: [...project.researchQuestions, question] });
    setNewQuestion("");
  }, [newQuestion, project.researchQuestions, update]);

  const handleToggleDone = useCallback(
    (id: string) => {
      update({
        researchQuestions: project.researchQuestions.map((q) =>
          q.id === id ? { ...q, done: !q.done } : q
        ),
      });
    },
    [project.researchQuestions, update]
  );

  const handleRemoveQuestion = useCallback(
    (id: string) => {
      update({
        researchQuestions: project.researchQuestions.filter((q) => q.id !== id),
      });
    },
    [project.researchQuestions, update]
  );

  const handleQuestionTextChange = useCallback(
    (id: string, value: string) => {
      update({
        researchQuestions: project.researchQuestions.map((q) =>
          q.id === id ? { ...q, text: value } : q
        ),
      });
    },
    [project.researchQuestions, update]
  );

  return (
    <section>
      <SectionHeading level={3}>Research questions</SectionHeading>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        What do you need to find out? Mark each as done when you’ve answered it.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <TextField
          label="Research question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="e.g. How long is the average wait time by grade?"
        />
        <Button variant="primary" onClick={handleAddQuestion} disabled={!newQuestion.trim()}>
          Add
        </Button>
      </div>

      {project.researchQuestions.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          No research questions yet. Add your first question above.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {project.researchQuestions.map((q) => (
            <div
              key={q.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: q.done ? "var(--color-cream)" : "var(--color-paper)",
              }}
            >
              <input
                type="checkbox"
                checked={q.done}
                onChange={() => handleToggleDone(q.id)}
                style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: "0.9rem",
                  color: q.done ? "var(--color-text-muted)" : "var(--color-ink)",
                  textDecoration: q.done ? "line-through" : "none",
                }}
              >
                {q.text}
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <TextField
                  label=""
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                  style={{ width: "100%", fontSize: "0.85rem" }}
                />
                <Button variant="ghost" onClick={() => handleRemoveQuestion(q.id)} style={{ fontSize: "0.8rem", color: "#C0392B" }}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
