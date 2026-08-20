import type { MouseEvent } from "react";
import styles from "./DetailsLink.module.css";

interface DetailsLinkProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  ariaLabel?: string;
}

export function DetailsLink({ onClick, label = "Details", ariaLabel }: DetailsLinkProps) {
  return (
    <button type="button" className={styles.details_link} onClick={onClick} aria-label={ariaLabel}>
      {label}
    </button>
  );
}
