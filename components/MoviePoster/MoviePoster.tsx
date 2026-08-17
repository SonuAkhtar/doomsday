"use client";

import Image from "next/image";
import { useState } from "react";
import type { Movie } from "@/types/movie";
import { formatYear } from "@/lib/format";
import styles from "./MoviePoster.module.css";

interface MoviePosterProps {
  movie: Movie;
  variant?: "card" | "feature";
  sizes?: string;
  priority?: boolean;
}

export function MoviePoster({
  movie,
  variant = "card",
  sizes = "(max-width: 640px) 45vw, 240px",
  priority = false,
}: MoviePosterProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(movie.poster) && !failed;

  return (
    <div
      className={`${styles.movie_poster} ${styles[`movie_poster--${variant}`]}`}
      style={{ ["--poster-accent" as string]: movie.accent }}
      role="img"
      aria-label={`${movie.title} poster`}
    >
      {showImage ? (
        <>
          <Image
            src={movie.poster as string}
            alt={`${movie.title} poster`}
            fill
            sizes={sizes}
            priority={priority}
            className={styles["movie_poster-img"]}
            onError={() => setFailed(true)}
          />
          <span className={styles["movie_poster-scrim"]} aria-hidden="true" />
          <span className={styles["movie_poster-phase"]}>Phase {movie.phase}</span>
        </>
      ) : (
        <>
          <span className={styles["movie_poster-order"]} aria-hidden="true">
            {String(movie.releaseOrder).padStart(2, "0")}
          </span>
          <div className={styles["movie_poster-top"]}>
            <span className={styles["movie_poster-phase"]}>Phase {movie.phase}</span>
            <span className={styles["movie_poster-year"]}>{formatYear(movie.releaseDate)}</span>
          </div>
          <div className={styles["movie_poster-bottom"]}>
            <span className={styles["movie_poster-title"]}>{movie.title}</span>
          </div>
          <span className={styles["movie_poster-grain"]} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
