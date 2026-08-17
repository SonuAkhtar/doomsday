"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/lib/navigation";
import { journeyMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { computeProgress } from "@/lib/progress";
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

  return (
    <header className={styles.header_bar}>
      <div className={styles.header_inner}>
        <Link href="/" className={styles.header_logo} aria-label="Doomsday home">
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
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/before-doomsday"
          className={styles.header_progress}
          aria-label={`Journey progress: ${progress.watched} of ${progress.total} watched`}
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
        </Link>
      </div>
    </header>
  );
}
