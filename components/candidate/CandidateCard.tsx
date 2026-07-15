"use client";

import { useEffect, useRef } from "react";
import type { CandidateSummary, MatchScoreResult } from "@/types";
import { MatchGauge } from "@/components/common/MatchGauge";
import { ScoutButton } from "@/components/scout/ScoutButton";

import { findTagsByIds } from "@/data/dummyData";

import styles from "./CandidateCard.module.css";

export function CandidateCard({
  rank,
  candidate,
  matchResult,
  content,
  alreadySent,
  remainingQuota,
  onView,
  onSendScout,
}: {
  rank: number;
  candidate: CandidateSummary;
  matchResult: MatchScoreResult;
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
    <article className={styles.row}>
      <span className={`${styles.rank} mono`}>{rank}</span>
      <MatchGauge result={matchResult} size="sm" />

      <div className={styles.info}>
        <div className={styles.head}>
          <h3>{candidate.displayLabel}</h3>
          {candidate.appliedToThisCompany && <span className="status-pill">우리 회사 지원함</span>}
        </div>
        <p className={styles.meta}>
          {candidate.school} · {candidate.major}
        </p>
        <div className={styles.skills}>
          {findTagsByIds(candidate.skillTagIds).map((tag) => (
            <span key={tag.id} className="chip">
              {tag.title}
            </span>
          ))}
        </div>
        <p className={styles.excerpt}>{content}</p>
      </div>

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
