import styles from "./StatTile.module.css";

interface StatTileProps {
  value: string | number;
  label: string;
  hint?: string;
  accent?: boolean;
}

export function StatTile({ value, label, hint, accent = false }: StatTileProps) {
  return (
    <div className={`${styles.stat_tile} ${accent ? styles["stat_tile--accent"] : ""}`}>
      <span className={styles["stat_tile-value"]}>{value}</span>
      <span className={styles["stat_tile-label"]}>{label}</span>
      {hint && <span className={styles["stat_tile-hint"]}>{hint}</span>}
    </div>
  );
}
