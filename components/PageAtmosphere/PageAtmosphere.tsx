import styles from "./PageAtmosphere.module.css";

type Position = "left" | "center" | "right";

interface PageAtmosphereProps {
  accent: string;
  position?: Position;
}

export function PageAtmosphere({ accent, position = "center" }: PageAtmosphereProps) {
  return (
    <div
      className={`${styles.page_atmosphere} ${styles[`page_atmosphere--${position}`]}`}
      style={{ ["--atmo-accent" as string]: accent }}
      aria-hidden="true"
    />
  );
}
