"use client";

import type { Movie } from "@/types/movie";
import { phaseLabel, formatRuntime, formatReleaseDate } from "@/lib/format";
import { useMovieModal } from "@/lib/MovieModalContext";
import { MoviePoster } from "@/components/MoviePoster/MoviePoster";
import { WatchedButton } from "@/components/WatchedButton/WatchedButton";
import { DetailsLink } from "@/components/DetailsLink/DetailsLink";
import styles from "./NextMission.module.css";

interface NextMissionProps {
  movie: Movie;
  eyebrow?: string;
}

export function NextMission({ movie, eyebrow = "Next Mission" }: NextMissionProps) {
  const { openMovie } = useMovieModal();

  return (
    <section
      className={styles.next_mission}
      style={{ ["--mission-accent" as string]: movie.accent }}
      aria-label={`${eyebrow}: ${movie.title}`}
    >
      <button
        type="button"
        className={styles["next_mission-poster"]}
        onClick={(event) => openMovie(movie, event.currentTarget)}
        aria-label={`View ${movie.title} details`}
      >
        <MoviePoster movie={movie} variant="feature" sizes="150px" />
      </button>

      <div className={styles["next_mission-body"]}>
        <span className={styles["next_mission-eyebrow"]}>{eyebrow}</span>
        <h2 className={styles["next_mission-title"]}>{movie.title}</h2>
        <p className={styles["next_mission-meta"]}>
          {formatReleaseDate(movie.releaseDate)} · {formatRuntime(movie.runtime)} · {phaseLabel(movie)}
        </p>
        {movie.doomsdayRelevance && (
          <p className={styles["next_mission-why"]}>{movie.doomsdayRelevance}</p>
        )}
        <div className={styles["next_mission-actions"]}>
          <div className={styles["next_mission-watch"]}>
            <WatchedButton movie={movie} />
          </div>
          <DetailsLink
            onClick={(event) => openMovie(movie, event.currentTarget)}
            label="View details"
            ariaLabel={`View ${movie.title} details`}
          />
        </div>
      </div>
    </section>
  );
}
