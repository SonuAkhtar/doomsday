"use client";

import { useTheme } from "@/lib/ThemeContext";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      className={`${styles.theme_toggle} ${isLight ? styles["theme_toggle--light"] : ""}`}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      <svg className={styles["theme_toggle-sun"]} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.6 4.6l1.3 1.3M14.1 14.1l1.3 1.3M15.4 4.6l-1.3 1.3M5.9 14.1l-1.3 1.3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      <svg className={styles["theme_toggle-moon"]} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M16.5 11.2A6.6 6.6 0 0 1 8.8 3.5 6.6 6.6 0 1 0 16.5 11.2Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles["theme_toggle-knob"]} aria-hidden="true" />
    </button>
  );
}
