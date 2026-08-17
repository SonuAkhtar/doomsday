import type { Importance, Movie } from "@/types/movie";
import styles from "./RelevanceTag.module.css";

const LABELS: Record<Importance, string> = {
  essential: "Essential",
  recommended: "Recommended",
  optional: "Optional",
};

export function RelevanceTag({ movie }: { movie: Movie }) {
  const label = LABELS[movie.importance];
  return (
    <span
      className={`${styles.relevance_tag} ${styles[`relevance_tag--${movie.importance}`]}`}
      title={
        movie.isRequiredForDoomsday
          ? "Part of the Before Doomsday journey"
          : "Not part of the core Doomsday journey"
      }
    >
      <span className={styles["relevance_tag-dot"]} aria-hidden="true" />
      {label}
    </span>
  );
}
