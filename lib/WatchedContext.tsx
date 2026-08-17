"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "doomsday.watched.v2";
const LEGACY_KEY = "doomsday.watched.v1";

export interface WatchedEntry {
  id: string;
  at: number;
}

const EMPTY: WatchedEntry[] = [];

type Listener = () => void;

const listeners = new Set<Listener>();
let store: WatchedEntry[] = EMPTY;
let didInit = false;

function readStorage(): WatchedEntry[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (item): item is WatchedEntry =>
              item && typeof item.id === "string" && typeof item.at === "number",
          )
          .map((item) => ({ id: item.id, at: item.at }));
      }
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((value): value is string => typeof value === "string")
          .map((id) => ({ id, at: 0 }));
      }
    }
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

function ensureInit() {
  if (didInit || typeof window === "undefined") return;
  didInit = true;
  store = readStorage();
}

function setStore(next: WatchedEntry[]) {
  store = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage may be unavailable; state stays in memory */
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  ensureInit();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => store;
const getServerSnapshot = () => EMPTY;
const getHydrated = () => true;
const getServerHydrated = () => false;

interface WatchedContextValue {
  watchedIds: Set<string>;
  watchedEntries: WatchedEntry[];
  watchedOrder: string[];
  hydrated: boolean;
  isWatched: (id: string) => boolean;
  watchedAt: (id: string) => number | null;
  markWatched: (id: string) => void;
  unmarkWatched: (id: string) => void;
}

const WatchedContext = createContext<WatchedContextValue | null>(null);

export function WatchedProvider({ children }: { children: React.ReactNode }) {
  const watchedEntries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribe, getHydrated, getServerHydrated);

  const watchedIds = useMemo(
    () => new Set(watchedEntries.map((entry) => entry.id)),
    [watchedEntries],
  );
  const watchedOrder = useMemo(
    () => watchedEntries.map((entry) => entry.id),
    [watchedEntries],
  );

  const isWatched = useCallback((id: string) => watchedIds.has(id), [watchedIds]);

  const watchedAt = useCallback(
    (id: string) => watchedEntries.find((entry) => entry.id === id)?.at ?? null,
    [watchedEntries],
  );

  const markWatched = useCallback((id: string) => {
    if (!store.some((entry) => entry.id === id)) {
      setStore([...store, { id, at: Date.now() }]);
    }
  }, []);

  const unmarkWatched = useCallback((id: string) => {
    if (store.some((entry) => entry.id === id)) {
      setStore(store.filter((entry) => entry.id !== id));
    }
  }, []);

  const value = useMemo(
    () => ({
      watchedIds,
      watchedEntries,
      watchedOrder,
      hydrated,
      isWatched,
      watchedAt,
      markWatched,
      unmarkWatched,
    }),
    [watchedIds, watchedEntries, watchedOrder, hydrated, isWatched, watchedAt, markWatched, unmarkWatched],
  );

  return (
    <WatchedContext.Provider value={value}>{children}</WatchedContext.Provider>
  );
}

export function useWatched(): WatchedContextValue {
  const context = useContext(WatchedContext);
  if (!context) {
    throw new Error("useWatched must be used within a WatchedProvider");
  }
  return context;
}
