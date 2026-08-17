"use client";

import type { Movie } from "@/types/movie";
import { useWatched } from "@/lib/WatchedContext";
import styles from "./WatchedButton.module.css";

interface WatchedButtonProps {
  movie: Movie;
  size?: "sm" | "md";
}

export function WatchedButton({ movie, size = "md" }: WatchedButtonProps) {
  const { isWatched, markWatched, unmarkWatched, hydrated } = useWatched();
  const watched = isWatched(movie.id);

  function handleClick() {
    if (watched) {
      unmarkWatched(movie.id);
    } else {
      markWatched(movie.id);
    }
  }

  return (
    <button
      type="button"
      className={`${styles.watched_button} ${styles[`watched_button--${size}`]} ${
        watched ? styles["watched_button--on"] : ""
      }`}
      onClick={handleClick}
      aria-pressed={watched}
      disabled={!hydrated}
    >
      <span className={styles["watched_button-icon"]} aria-hidden="true">
        {watched ? (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="m5 10.5 3 3 7-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </span>
      <span className={styles["watched_button-label"]}>
        {watched ? "Watched" : "Mark Watched"}
      </span>
    </button>
  );
}
