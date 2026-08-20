"use client";

import { useEffect, useState } from "react";
import { DOOMSDAY_RELEASE_DATE } from "@/data/movies";
import styles from "./Countdown.module.css";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function remainingFrom(target: number, now: number): Remaining | null {
  const diff = target - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

const DIGITS = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span className={styles["countdown-digit"]}>
      <span
        className={styles["countdown-digit-strip"]}
        style={{ transform: `translate3d(0, ${(digit - 9) * 10}%, 0)` }}
      >
        {DIGITS.map((value) => (
          <span className={styles["countdown-digit-cell"]} key={value}>
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [released, setReleased] = useState(false);

  useEffect(() => {
    const target = new Date(`${DOOMSDAY_RELEASE_DATE}T00:00:00`).getTime();
    let timer = 0;

    const tick = () => {
      const next = remainingFrom(target, Date.now());
      if (next) {
        setRemaining(next);
        timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));
      } else {
        setReleased(true);
      }
    };

    tick();
    return () => window.clearTimeout(timer);
  }, []);

  if (released) return null;

  const shown = remaining ?? ZERO;
  const units = [
    { key: "days", value: String(shown.days), label: "Days", roll: false },
    { key: "hours", value: pad(shown.hours), label: "Hours", roll: false },
    { key: "minutes", value: pad(shown.minutes), label: "Mins", roll: false },
    { key: "seconds", value: pad(shown.seconds), label: "Secs", roll: true },
  ];

  return (
    <div className={styles.countdown}>
      <span className={styles["countdown-sheen"]} aria-hidden="true" />

      <div className={styles["countdown-row"]} aria-hidden="true">
        {units.map((unit, index) => (
          <div className={styles["countdown-cell"]} key={unit.key}>
            {index > 0 && <span className={styles["countdown-separator"]}>:</span>}
            <div className={styles["countdown-unit"]}>
              <span
                className={`${styles["countdown-value"]} ${
                  unit.roll ? styles["countdown-value--live"] : ""
                }`}
              >
                {unit.roll
                  ? unit.value
                      .split("")
                      .map((digit, position) => (
                        <RollingDigit key={position} digit={Number(digit)} />
                      ))
                  : unit.value}
              </span>
              <span className={styles["countdown-label"]}>{unit.label}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="visually-hidden">
        {remaining
          ? `${shown.days} days, ${shown.hours} hours and ${shown.minutes} minutes until Avengers: Doomsday releases.`
          : "Counting down to the release of Avengers: Doomsday."}
      </p>
    </div>
  );
}
