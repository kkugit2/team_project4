import { RingStat } from "@/components/common/RingStat";
import type { ProfileInsights } from "@/lib/profileInsights";
import styles from "./JobseekerStatsHome.module.css";

function ComparisonBar({ label, mine, avg, unit }: { label: string; mine: number; avg: number; unit: string }) {
  const scaleMax = Math.max(mine, avg, 1);
  return (
    <div className={styles.comparisonGroup}>
      <p className={styles.comparisonLabel}>{label}</p>
      <div className={styles.barRow}>
        <span className={styles.barName}>나</span>
        <div className={styles.barTrack}>
          <div className={styles.barMine} style={{ width: `${(mine / scaleMax) * 100}%` }} />
        </div>
        <span className={`${styles.barValue} mono`}>
          {mine}
          {unit}
        </span>
      </div>
      <div className={styles.barRow}>
        <span className={styles.barName}>평균</span>
        <div className={styles.barTrack}>
          <div className={styles.barAvg} style={{ width: `${(avg / scaleMax) * 100}%` }} />
        </div>
        <span className={`${styles.barValue} mono`}>
          {avg.toFixed(1)}
          {unit}
        </span>
      </div>
    </div>
  );
}

export function JobseekerStatsHome({ insights }: { insights: ProfileInsights }) {
  const { careerCount, skillCount, certCount, eligibleJobCount, avgPeerSkillCount, avgPeerCareerCount, skillCoverage, strengths, weaknesses } =
    insights;

  const coveragePercent = skillCoverage.marketTotal > 0 ? Math.round((skillCoverage.have / skillCoverage.marketTotal) * 100) : 0;

  return (
    <div>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>경력</p>
          <p className={`${styles.statValue} mono`}>{careerCount}건</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>보유 스킬</p>
          <p className={`${styles.statValue} mono`}>{skillCount}개</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>자격증</p>
          <p className={`${styles.statValue} mono`}>{certCount}개</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>지원 가능 공고</p>
          <p className={`${styles.statValue} mono`}>{eligibleJobCount}건</p>
        </div>
      </div>

      <div className="section-card">
        <h3>또래 지원자 대비 비교</h3>
        <ComparisonBar label="보유 스킬 수" mine={skillCount} avg={avgPeerSkillCount} unit="개" />
        <ComparisonBar label="경력 수" mine={careerCount} avg={avgPeerCareerCount} unit="건" />
      </div>

      <div className={`section-card ${styles.donutSection}`}>
        <div>
          <h3>스킬 구성</h3>
          <p className="hint" style={{ margin: 0 }}>
            시장 공고가 요구하는 스킬 {skillCoverage.marketTotal}종 중 {skillCoverage.have}개를 보유하고 있어요.
          </p>
        </div>
        <RingStat
          percent={coveragePercent}
          primaryText={`${skillCoverage.have}/${skillCoverage.marketTotal}`}
          secondaryText={`${coveragePercent}%`}
          color="var(--navy)"
          size="lg"
        />
      </div>

      <div className={styles.insightGrid}>
        <div className={`section-card ${styles.strengthCard}`}>
          <h3>강점</h3>
          {strengths.length === 0 ? (
            <p className="hint" style={{ margin: 0 }}>
              보유 스킬 정보를 더 채우면 강점을 분석해드려요.
            </p>
          ) : (
            <ul className={styles.insightList}>
              {strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>
        <div className={`section-card ${styles.weaknessCard}`}>
          <h3>보완점</h3>
          {weaknesses.length === 0 ? (
            <p className="hint" style={{ margin: 0 }}>
              시장 요구 스킬을 이미 폭넓게 보유하고 있어요.
            </p>
          ) : (
            <ul className={styles.insightList}>
              {weaknesses.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
