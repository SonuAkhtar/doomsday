import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  percent: number;
  label?: string;
  detail?: string;
}

export function ProgressBar({ percent, label, detail }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={styles.progress_bar}>
      {(label || detail) && (
        <div className={styles["progress_bar-meta"]}>
          {label && <span className={styles["progress_bar-label"]}>{label}</span>}
          {detail && <span className={styles["progress_bar-detail"]}>{detail}</span>}
        </div>
      )}
      <div
        className={styles["progress_bar-track"]}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className={styles["progress_bar-fill"]}
          style={{ width: `${clamped}%` }}
        >
          <span className={styles["progress_bar-spark"]} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
