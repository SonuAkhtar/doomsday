"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { journeyMovies, DOOMSDAY_RELEASE_DATE } from "@/data/movies";
import { useWatched } from "@/lib/WatchedContext";
import { computeProgress } from "@/lib/progress";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP);

function daysUntilRelease(): number {
  const release = new Date(`${DOOMSDAY_RELEASE_DATE}T00:00:00`).getTime();
  const diff = Math.ceil((release - Date.now()) / 86_400_000);
  return diff > 0 ? diff : 0;
}

export function Hero() {
  const { watchedIds, hydrated } = useWatched();
  const progress = computeProgress(journeyMovies, watchedIds);
  const daysLeft = hydrated ? daysUntilRelease() : null;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-hero]");
      gsap.from(items, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    { scope: ref },
  );

  return (
    <section className={styles.hero} ref={ref}>
      <div className={styles["hero_glow"]} aria-hidden="true" />
      <div className={styles["hero_grid"]} aria-hidden="true" />

      <div className={styles["hero_inner"]}>
        <div className={styles["hero_content"]}>
          <span className={styles["hero_eyebrow"]} data-hero>The Multiverse Saga finale</span>
          <h1 className={styles["hero_title"]} data-hero>Doomsday</h1>
          <p className={styles["hero_subtitle"]} data-hero>
            The ultimate Marvel watch journey before <strong>Avengers: Doomsday</strong>.
            Follow the films that matter, track every one you finish, and arrive ready.
          </p>

          <div className={styles["hero_release"]} data-hero>
            <span className={styles["hero_release-dot"]} aria-hidden="true" />
            In theaters December 18, 2026
            {daysLeft !== null && daysLeft > 0 && (
              <span className={styles["hero_release-count"]}>· {daysLeft} days away</span>
            )}
          </div>

          <div className={styles["hero_actions"]} data-hero>
            <Link href="/before-doomsday" className={styles["hero_cta-primary"]}>
              Begin the Journey
            </Link>
            <Link href="/movies" className={styles["hero_cta-secondary"]}>
              Explore all movies
            </Link>
          </div>

          <div className={styles["hero_progress"]} data-hero>
            <ProgressBar
              percent={hydrated ? progress.percent : 0}
              label="Journey progress"
              detail={
                hydrated
                  ? `${progress.watched} / ${progress.total} essentials`
                  : `0 / ${progress.total} essentials`
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
