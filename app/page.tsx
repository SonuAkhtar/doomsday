"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { journeyMovies } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { computeProgress, currentMilestone, type Milestone } from "@/lib/progress";
import { formatRuntime } from "@/lib/format";
import { Hero } from "@/components/Hero/Hero";
import { PageAtmosphere } from "@/components/PageAtmosphere/PageAtmosphere";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { StatTile } from "@/components/StatTile/StatTile";
import { NextMission } from "@/components/NextMission/NextMission";
import { JourneyRail } from "@/components/JourneyRail/JourneyRail";
import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./page.module.css";
import { RouteTransition } from "@/components/RouteTransition/RouteTransition";

const MILESTONE_COPY: Record<Milestone, string> = {
  start: `The journey begins. ${journeyMovies.length} titles stand between you and Doomsday.`,
  first: "First mission complete. The path is set.",
  quarter: "A quarter of the way in. Momentum is building.",
  half: "Halfway to Doomsday. The multiverse is tightening.",
  threequarter: "Three quarters down. The endgame is in sight.",
  complete: "Journey complete. You are ready for Doomsday.",
};

export default function HomePage() {
  const { watchedIds, hydrated } = useWatched();
  const progress = computeProgress(journeyMovies, watchedIds);
  const milestone = currentMilestone(progress.percent, progress.watched);

  const watchedCount = hydrated ? progress.watched : 0;
  const remainingCount = hydrated ? progress.remaining : progress.total;
  const remainingRuntime = hydrated ? progress.remainingRuntime : progress.totalRuntime;
  const percent = hydrated ? progress.percent : 0;
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <RouteTransition>
      <Hero />

      <div className="page-wrap">
        <PageAtmosphere accent="#e01a2b" position="center" />
        <section className={styles.home_section} aria-labelledby="snapshot-heading">
          <button
            type="button"
            className={styles["home_snapshot-toggle"]}
            aria-expanded={statsOpen}
            onClick={() => setStatsOpen((open) => !open)}
          >
            <span>
              <span className={styles["home_section-eyebrow"]}>Mission status</span>
              <span
                id="snapshot-heading"
                role="heading"
                aria-level={2}
                className={styles["home_section-title"]}
              >
                Your journey to Doomsday
              </span>
            </span>
            <ChevronDown className={styles["home_snapshot-chevron"]} aria-hidden="true" />
          </button>

          <div className={styles["home_snapshot-card"]}>
            <ProgressBar
              percent={percent}
              label="Journey progress"
              detail={`${watchedCount} / ${progress.total} watched`}
            />

            <div
              className={`${styles["home_snapshot-body"]} ${statsOpen ? styles["home_snapshot-body--open"] : ""}`}
            >
              <div className={styles["home_snapshot-inner"]}>
                <div className={styles["home_stats"]}>
                  <StatTile value={`${watchedCount}/${progress.total}`} label="Completed" accent />
                  <StatTile
                    value={formatRuntime(remainingRuntime)}
                    label="Watch time left"
                    hint={`Across ${remainingCount} remaining ${remainingCount === 1 ? "film" : "films"}`}
                  />
                </div>

                <p className={styles["home_milestone"]}>{MILESTONE_COPY[milestone]}</p>
              </div>
            </div>
          </div>
        </section>

        {progress.nextMovie ? (
          <section className={styles.home_section} aria-label="Next mission">
            <NextMission movie={progress.nextMovie} />
          </section>
        ) : (
          hydrated && (
            <section className={`${styles.home_section} ${styles.home_complete}`}>
              <span className={styles["home_complete-glow"]} aria-hidden="true" />
              <h2 className={styles["home_complete-title"]}>Journey complete</h2>
              <p className={styles["home_complete-copy"]}>
                Every essential film is behind you. The road to Avengers: Doomsday is clear.
              </p>
              <Link href="/watched" className={styles["home_complete-link"]}>
                Review your journey
              </Link>
            </section>
          )
        )}

        <section className={styles.home_section} aria-labelledby="preview-heading">
          <header className={styles["home_section-head"]}>
            <div>
              <span className={styles["home_section-eyebrow"]}>The path</span>
              <h2 id="preview-heading" className={styles["home_section-title"]}>
                Timeline preview
              </h2>
            </div>
            <Link href="/before-doomsday" className={styles["home_section-link"]}>
              See full journey
            </Link>
          </header>
          <JourneyRail />
        </section>

        <section className={styles.home_section} aria-label="Quick access">
          <Reveal className={styles["home_quick"]} stagger>
            <Link href="/before-doomsday" className={styles["home_quick-card"]}>
              <span className={styles["home_quick-eyebrow"]}>Prepare</span>
              <span className={styles["home_quick-title"]}>Before Doomsday</span>
              <span className={styles["home_quick-copy"]}>
                The curated films to watch, in order, before the crossover.
              </span>
              <span className={styles["home_quick-arrow"]} aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <Link href="/watched" className={styles["home_quick-card"]}>
              <span className={styles["home_quick-eyebrow"]}>Track</span>
              <span className={styles["home_quick-title"]}>Watched</span>
              <span className={styles["home_quick-copy"]}>
                Everything you have completed and your progress so far.
              </span>
              <span className={styles["home_quick-arrow"]} aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Reveal>
        </section>
      </div>
    </RouteTransition>
  );
}
