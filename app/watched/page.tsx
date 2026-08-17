"use client";

import { useMemo } from "react";
import type { Movie } from "@/types/movie";
import { catalogMovies, journeyMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { computeProgress, currentMilestone } from "@/lib/progress";
import { formatRuntime } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageAtmosphere } from "@/components/PageAtmosphere/PageAtmosphere";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { StatTile } from "@/components/StatTile/StatTile";
import { MilestoneBanner } from "@/components/MilestoneBanner/MilestoneBanner";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./page.module.css";

interface WatchedItem {
  movie: Movie;
  at: number;
}

export default function WatchedPage() {
  const { watchedIds, watchedEntries, hydrated } = useWatched();

  const overall = computeProgress(catalogMovies, watchedIds);
  const journey = computeProgress(journeyMovies, watchedIds);
  const milestone = currentMilestone(journey.percent, journey.watched);

  const watchedMovies = useMemo(() => {
    if (!hydrated) return [] as WatchedItem[];
    const byId = new Map(catalogMovies.map((movie) => [movie.id, movie]));
    return watchedEntries
      .slice()
      .reverse()
      .map((entry) => {
        const movie = byId.get(entry.id);
        return movie ? { movie, at: entry.at } : null;
      })
      .filter((item): item is WatchedItem => item !== null);
  }, [watchedEntries, hydrated]);

  const hasWatched = hydrated && watchedMovies.length > 0;

  return (
    <div className="page-wrap">
      <PageAtmosphere accent="#43c6e8" position="left" />
      <PageHeader
        eyebrow="Watched"
        title="Watched"
        description="Every film you have marked as watched, most recent first. Undo any title to move it back into your queue."
      />

      {!hydrated ? (
        <div className={styles.watched_loading} aria-hidden="true">
          <span className={styles["watched_loading-bar"]} />
        </div>
      ) : hasWatched ? (
        <>
          <MilestoneBanner milestone={milestone} />

          <div className={styles.watched_overview}>
            <div className={styles["watched_overview-stats"]}>
              <StatTile value={watchedMovies.length} label="Films watched" accent />
              <StatTile value={`${journey.watched}/${journey.total}`} label="Journey done" />
              <StatTile value={formatRuntime(overall.watchedRuntime)} label="Time watched" />
              <StatTile value={journey.remaining} label="Journey left" />
            </div>
            <div className={styles["watched_overview-progress"]}>
              <ProgressBar
                percent={journey.percent}
                label="Before Doomsday progress"
                detail={`${journey.watched} / ${journey.total} essentials`}
              />
            </div>
          </div>

          <h2 className={styles.watched_subhead}>Recently watched</h2>
          <Reveal className={styles.watched_grid} stagger key={watchedMovies.length}>
            {watchedMovies.map((item, index) => (
              <MovieCard key={item.movie.id} movie={item.movie} index={index} watchedAt={item.at} />
            ))}
          </Reveal>
        </>
      ) : (
        <EmptyState
          title="Nothing watched yet"
          message="Mark your first film as watched to start tracking your journey to Doomsday."
          actionLabel="Start the journey"
          actionHref="/before-doomsday"
        />
      )}
    </div>
  );
}
