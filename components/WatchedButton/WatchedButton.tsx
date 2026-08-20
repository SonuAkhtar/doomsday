"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Movie } from "@/types/movie";
import { useWatched } from "@/lib/WatchedContext";
import { duration, ease, spring } from "@/lib/motion";
import styles from "./WatchedButton.module.css";

interface WatchedButtonProps {
  movie: Movie;
  size?: "sm" | "md";
}

const BURST_ANGLES = [-90, -40, 10, 60, 140, 200];
const BURST_DISTANCE = 26;

export function WatchedButton({ movie, size = "md" }: WatchedButtonProps) {
  const { isWatched, markWatched, unmarkWatched, hydrated } = useWatched();
  const watched = isWatched(movie.id);
  const reduced = useReducedMotion() ?? false;

  const [burst, setBurst] = useState(0);

  const handleClick = useCallback(() => {
    if (watched) {
      unmarkWatched(movie.id);
      return;
    }
    markWatched(movie.id);
    if (!reduced) setBurst((n) => n + 1);
  }, [watched, movie.id, markWatched, unmarkWatched, reduced]);

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
        <AnimatePresence mode="wait" initial={false}>
          {watched ? (
            <motion.svg
              key="on"
              viewBox="0 0 20 20"
              fill="none"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              transition={reduced ? { duration: duration.instant } : spring.snappy}
            >
              <motion.path
                d="m5 10.5 3 3 7-7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: duration.slow, ease: ease.entrance }}
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="off"
              viewBox="0 0 20 20"
              fill="none"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              transition={reduced ? { duration: duration.instant } : spring.snappy}
            >
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
            </motion.svg>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {burst > 0 && (
            <motion.span key={burst} className={styles["watched_button-burst"]}>
              <motion.span
                className={styles["watched_button-ring"]}
                initial={{ opacity: 0.7, scale: 0.4 }}
                animate={{ opacity: 0, scale: 2.1 }}
                transition={{ duration: duration.slow, ease: ease.entrance }}
                onAnimationComplete={() => setBurst(0)}
              />
              {BURST_ANGLES.map((angle) => (
                <motion.span
                  key={angle}
                  className={styles["watched_button-dot"]}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((angle * Math.PI) / 180) * BURST_DISTANCE,
                    y: Math.sin((angle * Math.PI) / 180) * BURST_DISTANCE,
                    scale: 0.3,
                  }}
                  transition={{ duration: duration.slow, ease: ease.entrance }}
                />
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className={styles["watched_button-label"]}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={watched ? "on" : "off"}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: duration.fast, ease: ease.entrance }}
          >
            {watched ? "Watched" : "Mark Watched"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
