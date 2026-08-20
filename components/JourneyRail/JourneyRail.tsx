"use client";

import { journeyMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { useMovieModal } from "@/lib/MovieModalContext";
import { formatYear } from "@/lib/format";
import styles from "./JourneyRail.module.css";

export function JourneyRail() {
  const { isWatched, hydrated } = useWatched();
  const { openMovie } = useMovieModal();
  const firstUnwatched = hydrated
    ? journeyMovies.findIndex((movie) => !isWatched(movie.id))
    : -1;

  return (
    <div className={styles.journey_rail}>
      <ol className={styles["journey_rail-track"]}>
        {journeyMovies.map((movie, index) => {
          const watched = hydrated && isWatched(movie.id);
          const active = index === firstUnwatched;
          const state = watched ? "done" : active ? "active" : "upcoming";
          return (
            <li key={movie.id} className={styles["journey_rail-item"]}>
              <button
                type="button"
                onClick={(event) => openMovie(movie, event.currentTarget)}
                className={`${styles["journey_rail-node"]} ${styles[`journey_rail-node--${state}`]}`}
              >
                <span className={styles["journey_rail-connector"]} aria-hidden="true" />
                <span className={styles["journey_rail-dot"]} aria-hidden="true" />
                <span className={styles["journey_rail-step"]}>{formatYear(movie.releaseDate)}</span>
                <span className={styles["journey_rail-name"]}>{movie.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
