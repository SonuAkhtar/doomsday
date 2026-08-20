"use client";

import { useEffect, useRef } from "react";
import type { Movie } from "@/types/movie";
import { OFFICIAL_WATCHLIST_TAG } from "@/data/movies";
import { phaseLabel, formatRuntime, formatYear } from "@/lib/format";
import { useWatched } from "@/lib/WatchedContext";
import { useMovieModal } from "@/lib/MovieModalContext";
import { WatchedButton } from "@/components/WatchedButton/WatchedButton";
import { DetailsLink } from "@/components/DetailsLink/DetailsLink";
import styles from "./MovieTimeline.module.css";

interface MovieTimelineProps {
  movies: Movie[];
}

export function MovieTimeline({ movies }: MovieTimelineProps) {
  const { isWatched, hydrated } = useWatched();
  const { openMovie } = useMovieModal();

  const firstUnwatchedIndex = hydrated
    ? movies.findIndex((movie) => !isWatched(movie.id))
    : -1;

  let lastWatchedIndex = -1;
  if (hydrated) {
    movies.forEach((movie, index) => {
      if (isWatched(movie.id)) lastWatchedIndex = index;
    });
  }

  const listRef = useRef<HTMLOListElement>(null);
  const markersRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      const marker = lastWatchedIndex >= 0 ? markersRef.current[lastWatchedIndex] : null;
      if (!marker) {
        list.style.setProperty("--timeline-fill", "0px");
        return;
      }
      const listTop = list.getBoundingClientRect().top;
      const markerRect = marker.getBoundingClientRect();
      const center = markerRect.top + markerRect.height / 2 - listTop;
      list.style.setProperty("--timeline-fill", `${Math.max(0, center - 6)}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [lastWatchedIndex, hydrated]);

  return (
    <ol className={styles.movie_timeline} ref={listRef}>
      <span className={styles["movie_timeline-line"]} aria-hidden="true" />
      <span className={styles["movie_timeline-fill"]} aria-hidden="true" />

      {movies.map((movie, index) => {
        const watched = hydrated && isWatched(movie.id);
        const active = index === firstUnwatchedIndex;
        const official = movie.tags.includes(OFFICIAL_WATCHLIST_TAG);
        const state = watched ? "done" : active ? "active" : "upcoming";
        return (
          <li
            key={movie.id}
            className={`${styles["movie_timeline-node"]} ${styles[`movie_timeline-node--${state}`]}`}
          >
            <span
              className={styles["movie_timeline-marker"]}
              aria-hidden="true"
              ref={(el) => {
                markersRef.current[index] = el;
              }}
            >
              <span className={styles["movie_timeline-dot"]} />
            </span>

            <div className={styles["movie_timeline-card"]}>
              {movie.poster && (
                <span
                  className={styles["movie_timeline-poster"]}
                  style={{ backgroundImage: `url("${movie.poster}")` }}
                  aria-hidden="true"
                />
              )}
              <div className={styles["movie_timeline-content"]}>
              <div className={styles["movie_timeline-head"]}>
                <div className={styles["movie_timeline-headline"]}>
                  <span className={styles["movie_timeline-step"]}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`${styles["movie_timeline-source"]} ${
                      official ? styles["movie_timeline-source--official"] : ""
                    }`}
                    title={
                      official
                        ? "On Disney's official pre-Doomsday watchlist"
                        : "Not on Disney's list, added for extra context"
                    }
                  >
                    {official ? "Disney+ pick" : "Extra"}
                  </span>
                </div>
                <span className={styles["movie_timeline-status"]}>
                  {watched ? "Watched" : active ? "Next up" : "Upcoming"}
                </span>
              </div>

              <h3 className={styles["movie_timeline-title"]}>
                <button type="button" onClick={(event) => openMovie(movie, event.currentTarget)}>
                  {movie.title}
                </button>
              </h3>

              <p className={styles["movie_timeline-meta"]}>
                {formatYear(movie.releaseDate)} · {formatRuntime(movie.runtime)} · {phaseLabel(movie)}
              </p>

              {movie.doomsdayRelevance && (
                <p className={styles["movie_timeline-why"]}>{movie.doomsdayRelevance}</p>
              )}

              <div className={styles["movie_timeline-action"]}>
                <WatchedButton movie={movie} size="sm" />
                <DetailsLink
                  onClick={(event) => openMovie(movie, event.currentTarget)}
                  ariaLabel={`View ${movie.title} details`}
                />
              </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
