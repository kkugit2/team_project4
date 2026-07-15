import { scoreLevel } from "@/lib/format";
import styles from "./ScoreBadge.module.css";

export function ScoreBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={`${styles.fill} ${styles[scoreLevel(value)]}`} style={{ width: `${value}%` }} />
      </div>
      <span className={styles.label}>
        {label} {value}%
      </span>
    </div>
  );
}
