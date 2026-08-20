import styles from "./DoomsdayBackdrop.module.css";

export function DoomsdayBackdrop() {
  return (
    <div className={styles.doomsday_backdrop} aria-hidden="true">
      <div className={styles["doomsday_backdrop-image"]} />
    </div>
  );
}
