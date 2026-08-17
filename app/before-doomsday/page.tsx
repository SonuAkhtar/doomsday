"use client";

import { journeyMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { computeProgress } from "@/lib/progress";
import { formatRuntime } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageAtmosphere } from "@/components/PageAtmosphere/PageAtmosphere";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { StatTile } from "@/components/StatTile/StatTile";
import { NextMission } from "@/components/NextMission/NextMission";
import { MovieTimeline } from "@/components/MovieTimeline/MovieTimeline";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./page.module.css";

export default function BeforeDoomsdayPage() {
  const { watchedIds, hydrated } = useWatched();
  const progress = computeProgress(journeyMovies, watchedIds);

  const watchedCount = hydrated ? progress.watched : 0;
  const remainingCount = hydrated ? progress.remaining : progress.total;
  const remainingRuntime = hydrated ? progress.remainingRuntime : progress.totalRuntime;
  const percent = hydrated ? progress.percent : 0;

  return (
    <div className="page-wrap">
      <PageAtmosphere accent="#cf9b52" position="left" />
      <PageHeader
        eyebrow="Before Doomsday"
        title="Before Doomsday"
        description="A curated, in-order path through the films that set up Avengers: Doomsday — the founding team, the Infinity Saga stakes, and the multiverse threads that lead into it."
      />

      <div className={styles.before_overview}>
        <div className={styles["before_overview-progress"]}>
          <ProgressBar
            percent={percent}
            label="Journey progress"
            detail={`${watchedCount} / ${progress.total} watched`}
          />
        </div>
        <div className={styles["before_overview-stats"]}>
          <StatTile value={watchedCount} label="Completed" accent />
          <StatTile value={remainingCount} label="Remaining" />
          <StatTile value={formatRuntime(remainingRuntime)} label="Watch time left" />
        </div>
      </div>

      {progress.nextMovie && (
        <div className={styles.before_next}>
          <NextMission movie={progress.nextMovie} eyebrow="Next up in your journey" />
        </div>
      )}

      <p className={styles.before_note}>
        Plot details for Avengers: Doomsday have not been officially released. This list reflects
        the films most connected to its known cast and story threads, not confirmed plot points.
      </p>

      <Reveal>
        <section aria-label="Journey timeline" className={styles.before_timeline}>
          <MovieTimeline movies={journeyMovies} />
        </section>
      </Reveal>
    </div>
  );
}
