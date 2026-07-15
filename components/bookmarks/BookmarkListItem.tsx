"use client";

import Link from "next/link";
import type { Job } from "@/types";
import { Logo } from "@/components/common/Logo";
import { formatDueDate } from "@/lib/format";

export function BookmarkListItem({
  job,
  applied,
  onRemove,
}: {
  job: Job;
  applied: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="row-card">
      <Link className="row-info" href={`/job/${job.id}`}>
        <Logo name={job.companyName} color={job.companyColor} size="sm" />
        <div>
          <h3>
            {job.companyName} · {job.position}
          </h3>
          <p>{formatDueDate(job.dueTime)}</p>
        </div>
      </Link>
      <div className="row-actions">
        {applied && <span className="status-pill">지원완료</span>}
        <button type="button" className="btn btn-outline" onClick={onRemove} aria-label="찜 해제">
          ✕
        </button>
      </div>
    </div>
  );
}
