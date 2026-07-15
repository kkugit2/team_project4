import styles from "./DisclaimerBanner.module.css";

export function DisclaimerBanner({ children }: { children: React.ReactNode }) {
  return <div className={styles.banner}>{children}</div>;
}
