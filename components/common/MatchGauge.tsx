import { countApplicableCriteria, MATCH_CRITERIA_LABELS } from "@/lib/matchScore";
import { scoreLevel } from "@/lib/format";
import { RingStat } from "./RingStat";
import type { MatchBasis, MatchScoreResult } from "@/types";
import styles from "./MatchGauge.module.css";

const LEVEL_COLOR: Record<string, string> = {
  high: "var(--navy)",
  mid: "var(--navy-mid)",
  low: "var(--warn)",
};

const CRITERIA_KEYS: (keyof MatchBasis)[] = ["gpa", "skills", "experience", "internship"];

/**
 * UI-UX-Guideline_all.md 2장 매칭 게이지. lib/matchScore.ts의 MatchScoreResult(score+basis)를 그대로 받아
 * 중앙에 "충족수/전체"를 우선 표기하고 %는 보조로 작게 표기한다. 적용 조건이 0개면 안내 문구로 대체한다.
 */
export function MatchGauge({
  result,
  size = "sm",
  showChecklist = false,
  emptyText = "이 기업은 아직 조건을 등록하지 않았어요",
}: {
  result: MatchScoreResult | null;
  size?: "sm" | "lg";
  showChecklist?: boolean;
  emptyText?: string;
}) {
  if (!result) return null;

  const { met, applicable } = countApplicableCriteria(result.basis);
  if (applicable === 0) {
    // sm(40px) 원 안에는 안내문 전체가 들어가지 않으므로 짧은 대시 플레이스홀더로 대체하고,
    // 전체 문구는 여백이 있는 lg(상세 화면)에서만 보여준다.
    if (size === "sm") {
      return <RingStat percent={0} primaryText="-" color="var(--line)" size={size} />;
    }
    return <RingStat percent={0} primaryText="" color="var(--line)" size={size} emptyText={emptyText} />;
  }

  const level = scoreLevel(result.score);

  return (
    <div className={styles.wrap}>
      <RingStat
        percent={result.score}
        primaryText={`${met}/${applicable}`}
        secondaryText={`${result.score}%`}
        color={LEVEL_COLOR[level]}
        size={size}
      />
      {showChecklist && (
        <ul className={styles.checklist}>
          {CRITERIA_KEYS.filter((key) => result.basis[key].applicable).map((key) => (
            <li key={key} className={result.basis[key].met ? styles.met : styles.unmet}>
              {MATCH_CRITERIA_LABELS[key]} {result.basis[key].met ? "✓" : "✗"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
