import type { Milestone } from "@/lib/progress";
import styles from "./MilestoneBanner.module.css";

const CONTENT: Partial<Record<Milestone, { title: string; message: string }>> = {
  first: {
    title: "First film down",
    message: "The journey has begun. Keep the momentum going.",
  },
  quarter: {
    title: "A quarter complete",
    message: "The foundations are set. The saga opens up from here.",
  },
  half: {
    title: "Halfway to Doomsday",
    message: "The multiverse is in full swing. You are on pace.",
  },
  threequarter: {
    title: "Three quarters there",
    message: "The endgame is close. Only a few films remain.",
  },
  complete: {
    title: "Journey complete",
    message: "You have watched every essential. You are ready for Doomsday.",
  },
};

export function MilestoneBanner({ milestone }: { milestone: Milestone }) {
  const content = CONTENT[milestone];
  if (!content) return null;

  return (
    <div
      className={`${styles.milestone_banner} ${milestone === "complete" ? styles["milestone_banner--complete"] : ""}`}
    >
      <span className={styles["milestone_banner-glow"]} aria-hidden="true" />
      <span className={styles["milestone_banner-title"]}>{content.title}</span>
      <span className={styles["milestone_banner-message"]}>{content.message}</span>
    </div>
  );
}
