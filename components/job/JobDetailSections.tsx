import type { JobDetail, Company, MatchScoreResult } from "@/types";
import { formatDueDate, formatWon } from "@/lib/format";
import { Logo } from "@/components/common/Logo";
import { MatchGauge } from "@/components/common/MatchGauge";
import styles from "./JobDetailSections.module.css";

export function JobDetailSections({
  job,
  company,
  matchResult,
  actionSlot,
}: {
  job: JobDetail;
  company: Company | null;
  matchResult: MatchScoreResult | null;
  actionSlot: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.header}>
        <Logo name={job.companyName} color={job.companyColor} size="lg" />
        <div>
          <h2>{job.companyName}</h2>
          <p>
            {job.position} · {job.category}
          </p>
        </div>
      </div>

      <div className={styles.meta}>
        <span>
          모집기간: <strong>{formatDueDate(job.dueTime)}</strong>
        </span>
        <span>
          근무지: <strong>{job.location}</strong>
        </span>
        {job.salary && (
          <>
            <span>
              신규입사자 평균연봉: <strong>{formatWon(job.salary.newHire)}</strong>
            </span>
            <span>
              전사 평균연봉: <strong>{formatWon(job.salary.average)}</strong>
            </span>
          </>
        )}
      </div>

      {matchResult && (
        <div className="section-card">
          <h3>합격확률 (참고용)</h3>
          <MatchGauge result={matchResult} size="lg" showChecklist />
          <p className="hint">
            실제 원티드 AI 합격 예측이 아닌, 보유 스킬과 공고 요구 스킬을 비교한 자체 참고 지표입니다.
          </p>
        </div>
      )}

      <div className={styles.actionBar}>{actionSlot}</div>

      <div className="section-card">
        <h3>회사 소개</h3>
        <p>{company?.description ?? job.intro}</p>
      </div>

      {job.promoImages.length > 0 && (
        <div className="section-card">
          <h3>회사 홍보</h3>
          <div className={styles.promoGrid}>
            {job.promoImages.map((p, idx) => (
              <div key={idx} className={styles.promoTile} style={{ background: p.bg }}>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-card">
        <h3>사내복지</h3>
        <p>{job.benefits}</p>
      </div>
      <div className="section-card">
        <h3>포지션 소개</h3>
        <p>{job.intro}</p>
      </div>
      <div className="section-card">
        <h3>주요업무</h3>
        <p>{job.mainTasks}</p>
      </div>
      <div className="section-card">
        <h3>자격요건</h3>
        <p>{job.requirements}</p>
      </div>
      <div className="section-card">
        <h3>우대사항</h3>
        <p>{job.preferredPoints}</p>
      </div>
      <div className="section-card">
        <h3>전형절차</h3>
        <p>{job.hireRounds}</p>
      </div>
    </>
  );
}
