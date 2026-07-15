import styles from "./RingStat.module.css";

/**
 * UI-UX-Guideline_all.md 2장 시그니처 컴포넌트의 범용 프리미티브.
 * 원형 SVG arc + 중앙 2줄 텍스트. 의미(매칭 게이지 vs 스킬 커버리지 도넛)는
 * 상위 컴포넌트가 결정하고, 이 컴포넌트는 순수하게 "값 → 원형 게이지" 렌더링만 담당한다.
 */
export function RingStat({
  percent,
  primaryText,
  secondaryText,
  color,
  size = "sm",
  emptyText,
}: {
  percent: number;
  primaryText: string;
  secondaryText?: string;
  color: string;
  size?: "sm" | "lg";
  emptyText?: string;
}) {
  if (emptyText) {
    return (
      <div className={`${styles.wrap} ${styles[size]}`}>
        <p className={styles.emptyText}>{emptyText}</p>
      </div>
    );
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        <circle cx="50" cy="50" r={radius} className={styles.track} />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={styles.fill}
          style={{
            stroke: color,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className={styles.center}>
        <span className={`${styles.primary} mono`}>{primaryText}</span>
        {secondaryText && <span className={`${styles.secondary} mono`}>{secondaryText}</span>}
      </div>
    </div>
  );
}
