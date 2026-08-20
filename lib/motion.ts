import { useSyncExternalStore } from "react";

export const duration = {
  instant: 0.09,
  fast: 0.16,
  base: 0.26,
  slow: 0.42,
  cinematic: 0.72,
  epic: 1.1,
} as const;

export const ease = {
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.6, 0, 0.86, 0],
  standard: [0.4, 0, 0.2, 1],
  glide: [0.65, 0, 0.35, 1],
  spring: [0.34, 1.46, 0.54, 1],
  anticipate: [0.62, -0.32, 0.28, 1.28],
} as const;

export const gsapEase = {
  entrance: "expo.out",
  exit: "expo.in",
  standard: "power2.inOut",
  glide: "power3.inOut",
  spring: "back.out(1.5)",
  anticipate: "back.inOut(1.4)",
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.11,
} as const;

export const travel = {
  liftSm: 2,
  liftMd: 4,
  liftLg: 8,
  riseSm: 12,
  riseMd: 24,
  riseLg: 40,
} as const;

export const spring = {
  soft: { type: "spring", stiffness: 240, damping: 30, mass: 0.9 },
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.8 },
  heavy: { type: "spring", stiffness: 180, damping: 26, mass: 1.1 },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

type RevealCallback = (element: Element) => void;

const callbacks = new WeakMap<Element, RevealCallback>();
const observers = new Map<string, IntersectionObserver>();

function observerFor(rootMargin: string): IntersectionObserver {
  const existing = observers.get(rootMargin);
  if (existing) return existing;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const fn = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        observer.unobserve(entry.target);
        fn?.(entry.target);
      }
    },
    { rootMargin, threshold: 0.01 },
  );

  observers.set(rootMargin, observer);
  return observer;
}

export function observeOnce(
  element: Element,
  callback: RevealCallback,
  rootMargin = "0px 0px -12% 0px",
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    callback(element);
    return () => {};
  }

  const observer = observerFor(rootMargin);
  callbacks.set(element, callback);
  observer.observe(element);

  return () => {
    callbacks.delete(element);
    observer.unobserve(element);
  };
}
