import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className={styles.empty_state}>
      <span className={styles["empty_state-mark"]} aria-hidden="true" />
      <h2 className={styles["empty_state-title"]}>{title}</h2>
      <p className={styles["empty_state-message"]}>{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={styles["empty_state-action"]}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
