"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DOOMSDAY_RELEASE_DATE } from "@/data/movies";
import {
  duration,
  gsapEase,
  prefersReducedMotion,
  stagger,
  travel,
} from "@/lib/motion";
import { Countdown } from "@/components/Countdown/Countdown";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP);

const RELEASE = new Date(`${DOOMSDAY_RELEASE_DATE}T00:00:00`);
const RELEASE_WEEKDAY = RELEASE.toLocaleDateString("en-US", { weekday: "long" });
const RELEASE_DATE = RELEASE.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      try {
        if (prefersReducedMotion()) return;
        const items = gsap.utils.toArray<HTMLElement>("[data-hero]");
        gsap.fromTo(
          items,
          { opacity: 0, y: travel.riseMd },
          {
            opacity: 1,
            y: 0,
            duration: duration.cinematic,
            ease: gsapEase.entrance,
            stagger: stagger.loose,
          },
        );
      } finally {
        el.setAttribute("data-hero-ready", "");
      }
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
            <span className={styles["hero_subtitle-extra"]}>
              {" "}
              Follow the films that matter, track every one you finish, and arrive ready.
            </span>
          </p>

          <div className={styles["hero_release"]} data-hero>
            <span className={styles["hero_release-dot"]} aria-hidden="true" />
            <span className={styles["hero_release-label"]}>In theaters</span>
            <span className={styles["hero_release-divider"]} aria-hidden="true" />
            <time className={styles["hero_release-date"]} dateTime={DOOMSDAY_RELEASE_DATE}>
              <span className={styles["hero_release-weekday"]}>{RELEASE_WEEKDAY}, </span>
              {RELEASE_DATE}
            </time>
          </div>

          <div data-hero>
            <Countdown />
          </div>

          <div className={styles["hero_actions"]} data-hero>
            <Link href="/before-doomsday" className={styles["hero_cta-primary"]}>
              Begin the Journey
            </Link>
            <Link href="/movies" className={styles["hero_cta-secondary"]}>
              Explore all movies
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
