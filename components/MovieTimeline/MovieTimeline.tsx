"use client";

import type { Movie } from "@/types/movie";
import { formatRuntime, formatYear } from "@/lib/format";
import { useWatched } from "@/lib/WatchedContext";
import { useMovieModal } from "@/lib/MovieModalContext";
import { WatchedButton } from "@/components/WatchedButton/WatchedButton";
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

  const fillFraction =
    !hydrated || movies.length === 0
      ? 0
      : firstUnwatchedIndex === -1
        ? 1
        : (firstUnwatchedIndex + 0.5) / movies.length;

  return (
    <ol
      className={styles.movie_timeline}
      style={{ ["--timeline-fill" as string]: `${fillFraction * 100}%` }}
    >
      <span className={styles["movie_timeline-line"]} aria-hidden="true" />
      <span className={styles["movie_timeline-fill"]} aria-hidden="true" />

      {movies.map((movie, index) => {
        const watched = hydrated && isWatched(movie.id);
        const active = index === firstUnwatchedIndex;
        const state = watched ? "done" : active ? "active" : "upcoming";
        return (
          <li
            key={movie.id}
            className={`${styles["movie_timeline-node"]} ${styles[`movie_timeline-node--${state}`]}`}
          >
            <span className={styles["movie_timeline-marker"]} aria-hidden="true">
              <span className={styles["movie_timeline-dot"]} />
            </span>

            <div className={styles["movie_timeline-card"]}>
              <div className={styles["movie_timeline-head"]}>
                <span className={styles["movie_timeline-step"]}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles["movie_timeline-status"]}>
                  {watched ? "Watched" : active ? "Next up" : "Upcoming"}
                </span>
              </div>

              <h3 className={styles["movie_timeline-title"]}>
                <button type="button" onClick={() => openMovie(movie)}>
                  {movie.title}
                </button>
              </h3>

              <p className={styles["movie_timeline-meta"]}>
                {formatYear(movie.releaseDate)} · {formatRuntime(movie.runtime)} · Phase {movie.phase}
              </p>

              {movie.doomsdayRelevance && (
                <p className={styles["movie_timeline-why"]}>{movie.doomsdayRelevance}</p>
              )}

              <div className={styles["movie_timeline-action"]}>
                <WatchedButton movie={movie} size="sm" />
                <button
                  type="button"
                  className={styles["movie_timeline-details"]}
                  onClick={() => openMovie(movie)}
                >
                  Details
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
