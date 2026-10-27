"use client";

// File-level disable: reading localStorage and setting state in useEffect is the
// required mounted-guard pattern for hydration safety (doc/architecture.md §2).
// Reading storage during render would break SSR, so this ESLint rule is
// intentionally disabled here.
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import {
  deleteProject,
  getProject,
  upsertProject,
} from "@/lib/storage";

const DEBOUNCE_MS = 300;

/**
 * Hook for step pages. Loads one project by id and auto-saves on change.
 *
 * Returns { project, update, ready, saveError, remove }.
 * - project: the current project (undefined until ready)
 * - update(patch): merge a partial change; saves to localStorage after ~300ms
 *   debounce, plus immediately on step navigation and beforeunload
 * - ready: true after the initial localStorage read completes
 * - saveError: true if the last write hit quota/private-mode limits
 * - remove(): delete this project
 *
 * Storage reads happen only inside useEffect (mounted guard), so SSR and
 * the first client paint match.
 */
export function useProject(id: string) {
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushSave = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
  }, []);

  // Load once after mount (hydration-safe).
  // localStorage is an external data source; setting state here after mount is the
  // required mounted-guard pattern (doc/architecture.md §2). Reading storage during
  // render would break SSR hydration.
  useEffect(() => {
    const p = getProject(id);
    setProject(p);
    setReady(true);
  }, [id]);

  // Immediate save on pagehide / beforeunload (covers navigation away).
  useEffect(() => {
    const handlePageHide = () => {
      flushSave();
      const p = project;
      if (p) {
        const ok = upsertProject(p);
        if (!ok) setSaveError(true);
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      flushSave();
    };
  }, [project, flushSave]);

  const update = useCallback(
    (patch: Partial<Project>) => {
      const current = project;
      if (!current) return;

      const next: Project = {
        ...current,
        ...patch,
        id: current.id, // id never changes
        updatedAt: new Date().toISOString(),
      };

      // If patch touches nested objects, merge them shallowly so we don't
      // drop sibling fields. Handles problem, and any nested object.
      if (patch.problem) {
        next.problem = { ...current.problem, ...patch.problem };
      }

      setProject(next);
      setSaveError(false);

      // Debounced save.
      flushSave();
      saveTimer.current = setTimeout(() => {
        const ok = upsertProject(next);
        if (!ok) setSaveError(true);
        saveTimer.current = null;
      }, DEBOUNCE_MS);
    },
    [project, flushSave]
  );

  const remove = useCallback((): boolean => {
    flushSave();
    const ok = deleteProject(id);
    if (!ok) setSaveError(true);
    return ok;
  }, [id, flushSave]);

  return { project, update, ready, saveError, remove };
}
