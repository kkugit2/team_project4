import type { FeedbackResult as FeedbackResultType } from "@/types";
import type { ComparisonResult } from "@/lib/competitorComparison";
import styles from "./FeedbackResult.module.css";

export function FeedbackResult({
  content,
  feedback,
  comparison,
}: {
  content: string;
  feedback: FeedbackResultType;
  comparison: ComparisonResult;
}) {
  return (
    <div className="section-card">
      <h3>제출한 자기소개서</h3>
      <p className={styles.originalText}>{content}</p>

      <div className={styles.insightGrid}>
        <div className={`${styles.card} ${styles.strengthCard}`}>
          <h4 className={styles.cardTitle}>부합하는 점</h4>
          <ul className={styles.list}>
            {feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div className={`${styles.card} ${styles.weaknessCard}`}>
          <h4 className={styles.cardTitle}>보완할 점</h4>
          <ul className={styles.list}>
            {feedback.improvements.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.comparisonSection}>
        <h4 className={styles.cardTitle}>경쟁자 비교분석</h4>
        {comparison.status === "insufficient_data" ? (
          <p className="hint" style={{ margin: 0 }}>
            아직 이 공고에 제출된 자소서가 충분하지 않아요. 비교 데이터가 쌓이면 보여드릴게요.
          </p>
        ) : (
          <p style={{ fontSize: 14, margin: 0 }}>
            같은 공고에 제출된 {comparison.sampleSize}건과 비교했을 때, 분량 기준 상위 {100 - comparison.lengthPercentile}%
            수준입니다 (평균 {comparison.averageLength}자).
          </p>
        )}
      </div>
    </div>
  );
}
