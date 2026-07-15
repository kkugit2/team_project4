import Link from "next/link";
import styles from "./EmptyState.module.css";

export function EmptyState({
  message,
  linkHref,
  linkLabel,
}: {
  message: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className={styles.empty}>
      <p>{message}</p>
      {linkHref && linkLabel && <Link href={linkHref}>{linkLabel}</Link>}
    </div>
  );
}
