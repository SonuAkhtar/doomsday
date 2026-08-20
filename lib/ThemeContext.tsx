"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { prefersReducedMotion } from "@/lib/motion";

const STORAGE_KEY = "doomsday.theme";
const SWITCH_ATTRIBUTE = "data-theme-switch";

type Theme = "dark" | "light";
type Listener = () => void;

export interface ThemeOrigin {
  x: number;
  y: number;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

let switchToken = 0;

function switchTheme(apply: () => void, origin?: ThemeOrigin) {
  const doc = document as ViewTransitionDocument;

  if (typeof doc.startViewTransition !== "function" || prefersReducedMotion()) {
    apply();
    return;
  }

  const root = document.documentElement;
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.style.setProperty("--theme-origin-x", `${x}px`);
  root.style.setProperty("--theme-origin-y", `${y}px`);
  root.style.setProperty("--theme-radius", `${Math.ceil(radius)}px`);
  root.setAttribute(SWITCH_ATTRIBUTE, "");

  const token = ++switchToken;
  doc
    .startViewTransition(apply)
    .finished.catch(() => {})
    .finally(() => {
      if (token === switchToken) root.removeAttribute(SWITCH_ATTRIBUTE);
    });
}

const listeners = new Set<Listener>();
let theme: Theme = "dark";
let didInit = false;

function applyTheme(next: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", next);
  }
}

function readStorage(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function ensureInit() {
  if (didInit || typeof window === "undefined") return;
  didInit = true;
  theme = readStorage();
  applyTheme(theme);
}

function setTheme(next: Theme) {
  theme = next;
  applyTheme(next);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  ensureInit();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => theme;
const getServerSnapshot = (): Theme => "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (origin?: ThemeOrigin) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      const next: Theme = current === "light" ? "dark" : "light";
      switchTheme(() => setTheme(next), origin);
    },
    [current],
  );

  const value = useMemo(() => ({ theme: current, toggleTheme }), [current, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
