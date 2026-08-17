import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={`page-wrap ${styles.notfound}`}>
      <span className={styles["notfound_code"]}>404</span>
      <h1 className={styles["notfound_title"]}>Lost in the multiverse</h1>
      <p className={styles["notfound_copy"]}>
        This page slipped into another universe. Let&apos;s get you back on the path to Doomsday.
      </p>
      <Link href="/" className={styles["notfound_link"]}>
        Return home
      </Link>
    </div>
  );
}
