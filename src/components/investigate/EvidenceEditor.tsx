"use client";

import { useCallback, useState } from "react";
import type { EvidenceNote, NoteKind, Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";

const NOTE_KINDS: { value: NoteKind; label: string }[] = [
  { value: "observation", label: "Observation" },
  { value: "verified", label: "Verified" },
  { value: "assumption", label: "Assumption" },
];

interface EvidenceEditorProps {
  project: Project;
  update: (patch: Partial<Project>) => void;
}

export function EvidenceEditor({ project, update }: EvidenceEditorProps) {
  const [newText, setNewText] = useState("");
  const [newKind, setNewKind] = useState<NoteKind>("observation");
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");

  const handleAddNote = useCallback(() => {
    if (!newText.trim()) return;

    const note: EvidenceNote = {
      id: crypto.randomUUID(),
      kind: newKind,
      text: newText.trim(),
      sourceTitle: newSourceTitle.trim(),
      sourceUrl: newSourceUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    update({ evidence: [...project.evidence, note] });
    setNewText("");
    setNewKind("observation");
    setNewSourceTitle("");
    setNewSourceUrl("");
  }, [newText, newKind, newSourceTitle, newSourceUrl, project.evidence, update]);

  const handleRemoveNote = useCallback(
    (idToRemove: string) => {
      update({
        evidence: project.evidence.filter((n) => n.id !== idToRemove),
      });
    },
    [project.evidence, update]
  );

  return (
    <section>
      <SectionHeading level={3}>Evidence notes</SectionHeading>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Record what you’ve seen, what you’ve confirmed, and what you’re still
        guessing about. Each note is labeled so nothing is mistaken for fact.
      </p>

      {/* Add new note form */}
      <Card>
        <TextArea
          label="Note"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="What did you observe, verify, or assume?"
          rows={3}
        />
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.75rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: "500", marginBottom: 0 }}>
            Kind:
          </label>
          <select
            value={newKind}
            onChange={(e) => setNewKind(e.target.value as NoteKind)}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-paper)",
            }}
          >
            {NOTE_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.75rem" }}>
          <TextField
            label="Source title (optional)"
            value={newSourceTitle}
            onChange={(e) => setNewSourceTitle(e.target.value)}
            placeholder="Article, report, dataset…"
          />
          <TextField
            label="Source URL (optional)"
            value={newSourceUrl}
            onChange={(e) => setNewSourceUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <Button variant="primary" onClick={handleAddNote} disabled={!newText.trim()}>
          Add note
        </Button>
      </Card>

      {/* Existing notes */}
      {project.evidence.length === 0 ? (
        <EmptyState
          title="No evidence notes yet"
          description="Add your first observation, verified finding, or assumption."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {project.evidence.map((note) => (
            <div key={note.id} className="evidence-note">
              <div
                className={`note-kind-badge note-kind-badge--${note.kind}`}
              >
                {note.kind}
              </div>
              <div className="evidence-note__text">{note.text}</div>
              <div className="evidence-note__meta">
                {note.sourceTitle && (
                  <span>
                    <strong>Source:</strong> {note.sourceTitle}
                  </span>
                )}
                {note.sourceUrl && (
                  <span>
                    <a href={note.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-blue)" }}>
                      {note.sourceUrl}
                    </a>
                  </span>
                )}
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="evidence-note__actions">
                <Button variant="ghost" onClick={() => handleRemoveNote(note.id)} style={{ fontSize: "0.8rem" }}>
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
