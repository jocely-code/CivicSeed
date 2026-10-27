/**
 * CivicSeed — localStorage persistence layer.
 *
 * Only module in the app that touches `localStorage` directly. All
 * reads/writes go through these functions; components and hooks never
 * call `localStorage` themselves.
 *
 * Failure modes are handled gracefully: corrupt JSON is parked under a
 * timestamped key, quota/private-mode errors return `false` and show a
 * non-blocking warning banner. Storage can never crash the app.
 */

import type { Project, Store } from "./types";

export const STORAGE_KEY = "civicseed.projects.v1";
export const CORRUPT_KEY_PREFIX = "civicseed.projects.v1.corrupt-";
export const SEED_FLAG_KEY = "civicseed.seeded.v1";

const STORE_VERSION = 1;

/** Belt-and-braces guard for SSR environments. */
function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Fresh empty store. */
export function emptyStore(): Store {
  return { version: STORE_VERSION, projects: [] };
}

/**
 * Load the store from localStorage.
 *
 * - Missing key → fresh empty store (then the caller may seed a sample).
 * - Malformed JSON / wrong-shape → park the raw string under a timestamped
 *   key and return a fresh store. The original data is never lost silently.
 * - Never throws.
 */
export function loadStore(): Store {
  if (!hasWindow()) return emptyStore();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return emptyStore();

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.version !== STORE_VERSION ||
      !Array.isArray(parsed.projects)
    ) {
      parkCorrupt(raw);
      return emptyStore();
    }

    return parsed as Store;
  } catch {
    // If we can't read at all, treat as empty and park whatever we got.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw !== null) parkCorrupt(raw);
    } catch {
      /* ignore — storage may be blocked entirely */
    }
    return emptyStore();
  }
}

/**
 * Save the store to localStorage.
 *
 * Returns `true` on success, `false` on quota/privacy-mode errors.
 * Caller is responsible for showing a non-blocking warning banner.
 */
export function saveStore(store: Store): boolean {
  if (!hasWindow()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (err) {
    // QuotaExceededError, private-mode blocked, etc.
    if (
      err instanceof DOMException ||
      (err as Error).name === "QuotaExceededError"
    ) {
      return false;
    }
    return false;
  }
}

/** Park a corrupt/raw store string under a timestamped key so it isn't lost. */
function parkCorrupt(raw: string): void {
  if (!hasWindow()) return;
  try {
    const key = `${CORRUPT_KEY_PREFIX}${new Date().toISOString()}`;
    window.localStorage.setItem(key, raw);
  } catch {
    /* ignore — if we can't park, there's nothing more we can do */
  }
}

/** List all projects, sorted by updatedAt descending (newest first). */
export function listProjects(): Project[] {
  const store = loadStore();
  return [...store.projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/** Get a single project by id, or undefined if not found. */
export function getProject(id: string): Project | undefined {
  return loadStore().projects.find((p) => p.id === id);
}

/**
 * Insert or replace a project by id. Stamps `updatedAt` on replace.
 * Returns `true` if the write succeeded.
 */
export function upsertProject(project: Project): boolean {
  const store = loadStore();
  const existing = store.projects.findIndex((p) => p.id === project.id);

  const toSave = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    store.projects[existing] = toSave;
  } else {
    store.projects.push(toSave);
  }

  return saveStore(store);
}

/** Delete a project by id. Returns `true` if the write succeeded. */
export function deleteProject(id: string): boolean {
  const store = loadStore();
  const before = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id);

  if (store.projects.length === before) return false; // nothing to delete

  return saveStore(store);
}

/**
 * Ensure the sample project exists: only when no project with the
 * sample id is already in the store. Deleting the sample will re-seed
 * on the next home-page visit, so the demonstration is always available.
 */
export function ensureSampleSeeded(makeSample: () => Project): void {
  if (!hasWindow()) return;

  const store = loadStore();
  const hasSample = store.projects.some((p) => p.isSample);
  if (hasSample) return; // sample already present

  const sample = makeSample();
  store.projects = [...store.projects, sample];

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota/private-mode — seeding fails silently; app works in-memory */
  }
}
