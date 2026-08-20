"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import type { Movie } from "@/types/movie";
import { justWatchUrl } from "@/data/movies";
import { phaseLabel, formatRuntime, formatReleaseDate } from "@/lib/format";
import { duration, ease, spring, stagger, travel, useMediaQuery } from "@/lib/motion";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import { RelevanceTag } from "@/components/RelevanceTag/RelevanceTag";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  origin?: HTMLElement | null;
  originRect?: DOMRect | null;
}

const SHEET_QUERY = "(max-width: 639px)";
const DIALOG_WIDTH = 560;
const DISMISS_DISTANCE = 130;
const DISMISS_VELOCITY = 600;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function fromOrigin(rect: DOMRect | null) {
  if (!rect || typeof window === "undefined") {
    return { opacity: 0, scale: 0.94, x: 0, y: travel.riseMd };
  }
  const width = Math.min(DIALOG_WIDTH, window.innerWidth - 32);
  return {
    opacity: 0,
    scale: clamp(rect.width / width, 0.3, 0.9),
    x: rect.left + rect.width / 2 - window.innerWidth / 2,
    y: rect.top + rect.height / 2 - window.innerHeight / 2,
  };
}

const contentVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: stagger.tight, delayChildren: duration.fast } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: travel.riseSm },
  shown: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.entrance } },
};

export function MovieModal({
  movie,
  open,
  onClose,
  origin = null,
  originRect = null,
}: MovieModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const isSheet = useMediaQuery(SHEET_QUERY);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      origin?.focus();
    };
  }, [open, onClose, origin]);

  const onDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) {
        onClose();
      }
    },
    [onClose],
  );

  if (typeof document === "undefined") return null;

  const enter = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isSheet
      ? {
          initial: { opacity: 0, y: "100%" },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: "100%" },
        }
      : {
          initial: fromOrigin(originRect),
          animate: { opacity: 1, scale: 1, x: 0, y: 0 },
          exit: { ...fromOrigin(originRect), transition: { duration: duration.fast, ease: ease.exit } },
        };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.movie_modal_overlay}
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: duration.base, ease: ease.standard }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className={styles.movie_modal}
            style={{ ["--modal-accent" as string]: movie.accent }}
            role="dialog"
            aria-modal="true"
            aria-label={`${movie.title} details`}
            initial={enter.initial}
            animate={enter.animate}
            exit={enter.exit}
            transition={reduced ? { duration: duration.fast } : spring.snappy}
            drag={isSheet && !reduced ? "y" : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={onDragEnd}
            onClick={(event) => event.stopPropagation()}
          >
            <span className={styles["movie_modal-backdrop"]} aria-hidden="true" />

            {isSheet && (
              <span
                className={styles["movie_modal-handle"]}
                aria-hidden="true"
                onPointerDown={(event) => dragControls.start(event)}
              />
            )}

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

            <motion.div
              className={styles["movie_modal-content"]}
              variants={reduced ? undefined : contentVariants}
              initial="hidden"
              animate="shown"
            >
              <motion.div className={styles["movie_modal-head"]} variants={reduced ? undefined : itemVariants}>
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
                    {formatReleaseDate(movie.releaseDate)} · {formatRuntime(movie.runtime)} · {phaseLabel(movie)}
                  </p>
                  {movie.rating !== null && (
                    <span className={styles["movie_modal-rating"]}>
                      <strong>Rating</strong> {movie.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.div className={styles["movie_modal-scroll"]} variants={reduced ? undefined : itemVariants}>
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
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
