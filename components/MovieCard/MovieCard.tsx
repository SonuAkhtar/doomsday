"use client";

import type { Movie } from "@/types/movie";
import { formatRuntime, formatYear, formatWatchedAt } from "@/lib/format";
import { useWatched } from "@/lib/WatchedContext";
import { useMovieModal } from "@/lib/MovieModalContext";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import { RelevanceTag } from "@/components/RelevanceTag/RelevanceTag";
import { WatchedButton } from "@/components/WatchedButton/WatchedButton";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  watchedAt?: number;
}

export function MovieCard({ movie, index = 0, watchedAt }: MovieCardProps) {
  const { isWatched, hydrated } = useWatched();
  const { openMovie } = useMovieModal();
  const watched = hydrated && isWatched(movie.id);
  const watchedLabel = watchedAt ? formatWatchedAt(watchedAt) : null;

  return (
    <article className={`${styles.movie_card} ${watched ? styles["movie_card--watched"] : ""}`}>
      <button
        type="button"
        className={styles["movie_card-poster"]}
        onClick={() => openMovie(movie)}
        aria-label={`View ${movie.title} details`}
      >
        <MoviePoster movie={movie} priority={index < 4} />
        {movie.imdbRating !== null && (
          <span className={styles["movie_card-rating"]}>
            <strong>IMDb</strong>
            {movie.imdbRating.toFixed(1)}
          </span>
        )}
        {watched && (
          <span className={styles["movie_card-watched-badge"]}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 10.5 3 3 7-7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles["movie_card-watched-text"]}>Watched</span>
          </span>
        )}
      </button>

      <div className={styles["movie_card-body"]}>
        <div className={styles["movie_card-tags"]}>
          <RelevanceTag movie={movie} />
        </div>

        <h3 className={styles["movie_card-title"]}>
          <button type="button" onClick={() => openMovie(movie)}>
            {movie.title}
          </button>
        </h3>

        <p className={styles["movie_card-meta"]}>
          <span>{formatYear(movie.releaseDate)}</span>
          <span className={styles["movie_card-dot"]} aria-hidden="true">•</span>
          <span>{formatRuntime(movie.runtime)}</span>
          <span className={styles["movie_card-phase"]}>
            <span className={styles["movie_card-dot"]} aria-hidden="true">•</span>
            Phase {movie.phase}
          </span>
        </p>

        {watchedLabel && (
          <p className={styles["movie_card-watchedat"]}>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {watchedLabel}
          </p>
        )}

        <div className={styles["movie_card-actions"]}>
          <WatchedButton movie={movie} size="sm" />
          <button
            type="button"
            className={styles["movie_card-details"]}
            onClick={() => openMovie(movie)}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
