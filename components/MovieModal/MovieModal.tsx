"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import { justWatchUrl } from "@/data/movies";
import { formatRuntime, formatReleaseDate } from "@/lib/format";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import { RelevanceTag } from "@/components/RelevanceTag/RelevanceTag";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, open, onClose }: MovieModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.movie_modal_overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.movie_modal}
            style={{ ["--modal-accent" as string]: movie.accent }}
            role="dialog"
            aria-modal="true"
            aria-label={`${movie.title} details`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className={styles["movie_modal-backdrop"]} aria-hidden="true" />
            <button
              ref={closeRef}
              type="button"
              className={styles["movie_modal-close"]}
              onClick={onClose}
              aria-label="Close details"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <div className={styles["movie_modal-head"]}>
              <div className={styles["movie_modal-poster"]}>
                <MoviePoster movie={movie} variant="feature" sizes="150px" />
              </div>

              <div className={styles["movie_modal-intro"]}>
                <div className={styles["movie_modal-tags"]}>
                  <RelevanceTag movie={movie} />
                  <span className={styles["movie_modal-saga"]}>{movie.saga}</span>
                  {movie.status === "upcoming" && (
                    <span className={styles["movie_modal-upcoming"]}>Upcoming</span>
                  )}
                </div>
                <h2 className={styles["movie_modal-title"]}>{movie.title}</h2>
                <p className={styles["movie_modal-meta"]}>
                  {formatReleaseDate(movie.releaseDate)} · {formatRuntime(movie.runtime)} · Phase {movie.phase}
                </p>
                {movie.imdbRating !== null && (
                  <span className={styles["movie_modal-rating"]}>
                    <strong>IMDb</strong> {movie.imdbRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            <div className={styles["movie_modal-scroll"]}>
              <p className={styles["movie_modal-overview"]}>{movie.overview}</p>

              {movie.doomsdayRelevance && (
                <div className={styles["movie_modal-relevance"]}>
                  <h3>{movie.isRequiredForDoomsday ? "Why it matters for Doomsday" : "Where it fits"}</h3>
                  <p>{movie.doomsdayRelevance}</p>
                </div>
              )}

              <div className={styles["movie_modal-watch"]}>
                <h3>Where to watch</h3>
                {movie.status === "upcoming" ? (
                  <p className={styles["movie_modal-watch-note"]}>
                    In theaters {formatReleaseDate(movie.releaseDate)}
                  </p>
                ) : (
                  <>
                    {movie.streaming.length > 0 && (
                      <ul className={styles["movie_modal-providers"]}>
                        {movie.streaming.map((provider) => (
                          <li key={provider}>{provider}</li>
                        ))}
                      </ul>
                    )}
                    <a
                      className={styles["movie_modal-watch-link"]}
                      href={justWatchUrl(movie.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Find streaming &amp; rental options
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M6 3h7v7M13 3 4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <p className={styles["movie_modal-watch-note"]}>Availability varies by region.</p>
                  </>
                )}
              </div>

              <dl className={styles["movie_modal-facts"]}>
                <div>
                  <dt>Release order</dt>
                  <dd>#{movie.releaseOrder}</dd>
                </div>
                <div>
                  <dt>Post-credits</dt>
                  <dd>{movie.postCreditRelevant ? "Worth staying" : "Not essential"}</dd>
                </div>
                <div>
                  <dt>Doomsday journey</dt>
                  <dd>{movie.isRequiredForDoomsday ? "Included" : "Optional"}</dd>
                </div>
              </dl>

              {movie.tags.length > 0 && (
                <ul className={styles["movie_modal-chips"]}>
                  {movie.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
