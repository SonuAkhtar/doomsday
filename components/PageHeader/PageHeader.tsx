import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className={styles.page_header}>
      <h1 className="visually-hidden">{title}</h1>
      <span className={styles["page_header-eyebrow"]}>{eyebrow}</span>
      {description && <p className={styles["page_header-description"]}>{description}</p>}
    </header>
  );
}
