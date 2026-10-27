"use client";

// File-level disable: reading localStorage and setting state in useEffect is the
// required mounted-guard pattern for hydration safety (doc/architecture.md §2).
// Reading storage during render would break SSR, so this ESLint rule is
// intentionally disabled here.
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import {
  deleteProject,
  ensureSampleSeeded,
  listProjects,
  upsertProject,
} from "@/lib/storage";
import { makeSampleProject } from "@/lib/sample-project";
import { newProject } from "@/lib/types";

/**
 * Hook for the Home page. Manages the list of all projects.
 *
 * Returns { projects, create, remove, ready, saveError }.
 * - projects: sorted newest first
 * - create(): make a new empty project and save it
 * - remove(id): delete a project (caller should confirm first)
 * - ready: true after the initial localStorage read completes
 * - saveError: true if the last write hit quota/private-mode limits
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // localStorage is an external data source; setting state here after mount is the
  // required mounted-guard pattern (doc/architecture.md §2). Reading storage during
  // render would break SSR hydration.
  useEffect(() => {
    ensureSampleSeeded(makeSampleProject);
    setProjects(listProjects());
    setReady(true);
  }, []);

  const loadDemo = useCallback((): Project | undefined => {
    ensureSampleSeeded(makeSampleProject);
    const updated = listProjects();
    setProjects(updated);
    return updated.find((p) => p.isSample);
  }, []);

  const create = useCallback((): Project => {
    const p = newProject();
    const ok = upsertProject(p);
    if (!ok) setSaveError(true);
    setProjects(listProjects());
    return p;
  }, []);

  const remove = useCallback((id: string): boolean => {
    const ok = deleteProject(id);
    if (!ok) setSaveError(true);
    setProjects(listProjects());
    return ok;
  }, []);

  return { projects, create, loadDemo, remove, ready, saveError };
}
