"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { journeyMovies, officialWatchlistMovies, journeyExtraMovies } from "@/data/movies";
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
import { RouteTransition } from "@/components/RouteTransition/RouteTransition";

export default function BeforeDoomsdayPage() {
  const { watchedIds, hydrated } = useWatched();
  const progress = computeProgress(journeyMovies, watchedIds);

  const watchedCount = hydrated ? progress.watched : 0;
  const remainingCount = hydrated ? progress.remaining : progress.total;
  const remainingRuntime = hydrated ? progress.remainingRuntime : progress.totalRuntime;
  const percent = hydrated ? progress.percent : 0;
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <RouteTransition>
      <div className="page-wrap" style={{ ["--page-accent" as string]: "#cf9b52" }}>
        <PageAtmosphere accent="#cf9b52" position="left" />
        <PageHeader
          eyebrow="Before Doomsday"
          title="Before Doomsday"
          description={`Disney+ launched its own "Countdown to Avengers: Doomsday" collection on 16 August 2026: ${officialWatchlistMovies.length} titles, from the original Fox X-Men films through The Fantastic Four: First Steps. All ${officialWatchlistMovies.length} are here in release order, plus ${journeyExtraMovies.length} extras that fill in the gaps Disney skipped.`}
        />

        <div className={styles.before_overview}>
          <div className={styles["before_overview-progress"]}>
            <ProgressBar
              percent={percent}
              label="Journey progress"
              detail={`${watchedCount} / ${progress.total} watched`}
            />
          </div>
          <button
            type="button"
            className={styles["before_overview-toggle"]}
            aria-expanded={statsOpen}
            aria-controls="journey-stats"
            onClick={() => setStatsOpen((open) => !open)}
          >
            Journey stats
            <ChevronDown className={styles["before_overview-chevron"]} aria-hidden="true" />
          </button>

          <div
            id="journey-stats"
            className={`${styles["before_overview-body"]} ${statsOpen ? styles["before_overview-body--open"] : ""}`}
          >
            <div className={styles["before_overview-inner"]}>
              <div className={styles["before_overview-stats"]}>
                <StatTile value={`${watchedCount}/${progress.total}`} label="Completed" accent />
                <StatTile
                  value={formatRuntime(remainingRuntime)}
                  label="Watch time left"
                  hint={`Across ${remainingCount} remaining ${remainingCount === 1 ? "film" : "films"}`}
                />
              </div>
            </div>
          </div>
        </div>

        {progress.nextMovie && (
          <div className={styles.before_next}>
            <NextMission movie={progress.nextMovie} eyebrow="Next up in your journey" />
          </div>
        )}

        <p className={styles.before_note}>
          Titles marked <strong>Disney+ pick</strong> are on Disney&apos;s official list.{" "}
          {journeyExtraMovies.map((movie) => movie.title).join(", ")}{" "}
          {journeyExtraMovies.length === 1 ? "is an extra" : "are extras"} kept here for continuity.
          Plot details for Avengers: Doomsday have not been officially released, so the notes below
          reflect known cast and story threads, not confirmed plot points.
        </p>

        <Reveal variant="clip">
          <section aria-label="Journey timeline" className={styles.before_timeline}>
            <MovieTimeline movies={journeyMovies} />
          </section>
        </Reveal>
      </div>
    </RouteTransition>
  );
}
