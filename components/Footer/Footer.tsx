"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navRoutes } from "@/lib/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} data-vt="site-footer">
      <div className={styles["footer_inner"]}>
        <div className={styles["footer_brand"]}>
          <Link href="/" className={styles["footer_logo"]} aria-label="Doomsday home">
            <span className={styles["footer_logo-mark"]} aria-hidden="true" />
            <span className={styles["footer_logo-text"]}>Doomsday</span>
          </Link>
          <p className={styles["footer_tagline"]}>
            A free fan made watch tracker for the films leading to Avengers: Doomsday.
          </p>
          <a
            href="https://www.linkedin.com/in/riyaz-akhtar-03bb59129/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles["footer_social"]}
          >
            <svg
              className={styles["footer_social-icon"]}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
            </svg>
            LinkedIn
          </a>

          <button type="button" className={styles["footer_top"]} onClick={scrollToTop}>
            <ArrowUp className={styles["footer_top-icon"]} aria-hidden="true" />
            Back to top
          </button>
        </div>

        <nav className={styles["footer_group"]} aria-label="Explore">
          <span className={styles["footer_group-title"]}>Explore</span>
          {navRoutes.map((route) => (
            <Link key={route.href} href={route.href} className={styles["footer_link"]}>
              {route.label}
            </Link>
          ))}
        </nav>

        <nav className={styles["footer_group"]} aria-label="Information">
          <span className={styles["footer_group-title"]}>Information</span>
          <Link href="/about" className={styles["footer_link"]}>
            About and disclaimer
          </Link>
          <Link href="/before-doomsday" className={styles["footer_link"]}>
            Start the journey
          </Link>
        </nav>
      </div>

      <div className={styles["footer_base"]}>
        <p className={styles["footer_note"]}>
          A free, non commercial fan project made for fun. Not affiliated with, endorsed by, or
          sponsored by Marvel Studios, Marvel Characters, Inc., The Walt Disney Company, Sony
          Pictures, or any other rights holder. All film titles, poster artwork, characters, and
          trademarks belong to their respective owners and appear here only to identify the films.
          Rights holders can ask for anything to be removed and it will be.
        </p>
        <Link href="/about" className={styles["footer_base-link"]}>
          Full disclaimer, sources and removals
        </Link>
      </div>
    </footer>
  );
}
