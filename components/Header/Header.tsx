"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navDirection, navRoutes } from "@/lib/navigation";
import { journeyMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { computeProgress } from "@/lib/progress";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { watchedIds, hydrated } = useWatched();
  const progress = computeProgress(journeyMovies, watchedIds);
  const circumference = 2 * Math.PI * 13;
  const offset = circumference * (1 - progress.percent / 100);
  const [themeOpen, setThemeOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!themeOpen) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setThemeOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setThemeOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [themeOpen]);

  return (
    <header className={styles.header_bar} data-vt="site-header">
      <div className={styles.header_inner}>
        <Link
          href="/"
          className={styles.header_logo}
          aria-label="Doomsday home"
          transitionTypes={[navDirection(pathname, "/")]}
        >
          <span className={styles["header_logo-mark"]} aria-hidden="true" />
          <span className={styles["header_logo-text"]}>Doomsday</span>
        </Link>

        <nav className={styles.header_navigation} aria-label="Primary">
          {navRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={styles["header_nav-link"]}
              aria-current={isActive(pathname, route.href) ? "page" : undefined}
              transitionTypes={[navDirection(pathname, route.href)]}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className={styles.header_actions} ref={actionsRef}>
          <button
            type="button"
            className={styles.header_progress}
            aria-expanded={themeOpen}
            aria-controls="theme-options"
            aria-label={`Journey progress ${progress.watched} of ${progress.total}. Toggle theme options.`}
            onClick={() => setThemeOpen((open) => !open)}
          >
            <svg className={styles["header_progress-ring"]} viewBox="0 0 30 30">
              <circle className={styles["header_progress-track"]} cx="15" cy="15" r="13" />
              <circle
                className={styles["header_progress-value"]}
                cx="15"
                cy="15"
                r="13"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: hydrated ? offset : circumference,
                }}
              />
            </svg>
            <span className={styles["header_progress-count"]}>
              {hydrated ? progress.watched : 0}
              <span className={styles["header_progress-total"]}>/{progress.total}</span>
            </span>
            <ChevronRight className={styles["header_progress-arrow"]} aria-hidden="true" />
          </button>

          <div
            id="theme-options"
            className={`${styles.header_theme} ${themeOpen ? styles["header_theme--open"] : ""}`}
          >
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
