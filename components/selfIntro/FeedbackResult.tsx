import type { FeedbackResult as FeedbackResultType } from "@/types";
import type { ComparisonResult } from "@/lib/competitorComparison";

export function FeedbackResult({ feedback, comparison }: { feedback: FeedbackResultType; comparison: ComparisonResult }) {
  return (
    <div className="section-card">
      <h3>AI 피드백</h3>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>부합하는 점</h4>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          {feedback.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>보완할 점</h4>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          {feedback.improvements.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <h4 style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>경쟁자 비교분석</h4>
        {comparison.status === "insufficient_data" ? (
          <p className="hint" style={{ margin: 0 }}>
            같은 공고에 제출된 비교 대상이 아직 부족합니다 ({comparison.sampleSize}건). 개인식별 위험 방지를 위해
            최소 5건 이상 모이면 비교 분석을 제공합니다.
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
