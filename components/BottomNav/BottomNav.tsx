"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/lib/navigation";
import styles from "./BottomNav.module.css";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ href }: { href: string }) {
  switch (href) {
    case "/":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 11 12 4l8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "/movies":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 4v16M15 4v16M4 9h5M4 15h5M15 9h5M15 15h5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "/before-doomsday":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="6" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6 9.2v3.3a3 3 0 0 0 3 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "/watched":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.5 12 2.4 2.4L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomnav_bar} aria-label="Primary mobile">
      {navRoutes.map((route) => {
        const active = isActive(pathname, route.href);
        return (
          <Link
            key={route.href}
            href={route.href}
            className={styles.bottomnav_item}
            aria-current={active ? "page" : undefined}
          >
            <span className={styles["bottomnav_item-icon"]}>
              <NavIcon href={route.href} />
            </span>
            <span className={styles["bottomnav_item-label"]}>{route.shortLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
