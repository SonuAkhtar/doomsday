"use client";

import { doomsdayMovie } from "@/data/movies";
import { formatReleaseDate, phaseLabel } from "@/lib/format";
import { useMovieModal } from "@/lib/MovieModalContext";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import { Countdown } from "@/components/Countdown/Countdown";
import { DetailsLink } from "@/components/DetailsLink/DetailsLink";
import styles from "./DoomsdayFeature.module.css";

export function DoomsdayFeature() {
  const { openMovie } = useMovieModal();
  const movie = doomsdayMovie;

  return (
    <section
      className={styles.doomsday_feature}
      style={{ ["--feature-accent" as string]: movie.accent }}
      aria-labelledby="doomsday-feature-title"
    >
      <span className={styles["doomsday_feature-glow"]} aria-hidden="true" />

      <button
        type="button"
        className={styles["doomsday_feature-poster"]}
        onClick={(event) => openMovie(movie, event.currentTarget)}
        aria-label={`View ${movie.title} details`}
      >
        <MoviePoster movie={movie} variant="feature" sizes="(max-width: 720px) 40vw, 200px" priority />
      </button>

      <div className={styles["doomsday_feature-body"]}>
        <span className={styles["doomsday_feature-eyebrow"]}>The destination</span>
        <h2 id="doomsday-feature-title" className={styles["doomsday_feature-title"]}>
          {movie.title}
        </h2>

        <p className={styles["doomsday_feature-release"]}>
          <span className={styles["doomsday_feature-pill"]}>
            Coming {formatReleaseDate(movie.releaseDate)}
          </span>
          <span className={styles["doomsday_feature-meta"]}>{phaseLabel(movie)}</span>
        </p>

        <p className={styles["doomsday_feature-overview"]}>{movie.overview}</p>

        <Countdown />

        <DetailsLink
          onClick={(event) => openMovie(movie, event.currentTarget)}
          label="View details"
          ariaLabel={`View ${movie.title} details`}
        />
      </div>
    </section>
  );
}
