import styles from "./StatTile.module.css";

interface StatTileProps {
  value: string | number;
  label: string;
  hint?: string;
  accent?: boolean;
  wide?: boolean;
}

export function StatTile({ value, label, hint, accent = false, wide = false }: StatTileProps) {
  return (
    <div
      className={`${styles.stat_tile} ${accent ? styles["stat_tile--accent"] : ""} ${wide ? styles["stat_tile--wide"] : ""}`}
    >
      <span className={styles["stat_tile-value"]}>{value}</span>
      <span className={styles["stat_tile-text"]}>
        <span className={styles["stat_tile-label"]}>{label}</span>
        {hint && <span className={styles["stat_tile-hint"]}>{hint}</span>}
      </span>
    </div>
  );
}
