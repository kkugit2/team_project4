"use client";

import { useEffect, useRef } from "react";
import type { CandidateSummary } from "@/types";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { ScoutButton } from "@/components/scout/ScoutButton";
import { findTagsByIds } from "@/data/mockTags";
import styles from "./CandidateCard.module.css";

export function CandidateCard({
  candidate,
  fitScore,
  content,
  alreadySent,
  remainingQuota,
  onView,
  onSendScout,
}: {
  candidate: CandidateSummary;
  fitScore: number;
  content: string;
  alreadySent: boolean;
  remainingQuota: number;
  onView: () => void;
  onSendScout: (message: string) => void;
}) {
  const viewed = useRef(false);

  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      onView();
    }
  }, [onView]);

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3>{candidate.displayLabel}</h3>
        {candidate.appliedToThisCompany && <span className="status-pill">우리 회사 지원함</span>}
      </div>
      <p className={styles.meta}>
        {candidate.school} · {candidate.major}
      </p>

      <ScoreBadge label="인재상 부합도" value={fitScore} />

      <div className={styles.skills}>
        {findTagsByIds(candidate.skillTagIds).map((tag) => (
          <span key={tag.id} className="chip">
            {tag.title}
          </span>
        ))}
      </div>

      <p className={styles.excerpt}>{content}</p>

      <div className={styles.actions}>
        <ScoutButton
          candidateLabel={candidate.displayLabel}
          remainingQuota={remainingQuota}
          alreadySent={alreadySent}
          onSend={onSendScout}
        />
      </div>
    </article>
  );
}
