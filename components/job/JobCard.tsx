"use client";

import Link from "next/link";
import type { Job } from "@/types";
import { formatWon } from "@/lib/format";
import { Logo } from "@/components/common/Logo";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import styles from "./JobCard.module.css";

export function JobCard({
  job,
  passProbability,
  applied,
  bookmarked,
  onToggleBookmark,
}: {
  job: Job;
  passProbability: number | null;
  applied: boolean;
  bookmarked: boolean;
  onToggleBookmark?: () => void;
}) {
  return (
    <article className={styles.card}>
      <Link className={styles.link} href={`/job/${job.id}`}>
        <div className={styles.head}>
          <Logo name={job.companyName} color={job.companyColor} />
          <div>
            <h3>{job.companyName}</h3>
            <p className={styles.category}>{job.category}</p>
          </div>
        </div>
        <p className={styles.position}>{job.position}</p>

        {passProbability !== null && <ScoreBadge label="합격확률" value={passProbability} />}

        {applied && <span className="status-pill">지원완료</span>}

        {job.salary && (
          <div className={styles.salary}>
            <span>신규입사자 평균 {formatWon(job.salary.newHire)}</span>
            <span>전사 평균 {formatWon(job.salary.average)}</span>
          </div>
        )}
      </Link>
      {onToggleBookmark && (
        <button
          type="button"
          className={`${styles.wishBtn} ${bookmarked ? styles.active : ""}`}
          aria-label="찜하기"
          onClick={(e) => {
            e.preventDefault();
            onToggleBookmark();
          }}
        >
          {bookmarked ? "★" : "☆"}
        </button>
      )}
    </article>
  );
}
