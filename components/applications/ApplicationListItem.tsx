"use client";

import Link from "next/link";
import type { Application, ApplicationStatus, Job } from "@/types";
import { Logo } from "@/components/common/Logo";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "self_reported", label: "지원완료" },
  { value: "document_pass", label: "서류합격" },
  { value: "interview", label: "면접중" },
  { value: "hired", label: "최종합격" },
  { value: "rejected", label: "불합격" },
];

export function ApplicationListItem({
  application,
  job,
  onStatusChange,
  onRemove,
}: {
  application: Application;
  job: Job;
  onStatusChange: (status: ApplicationStatus) => void;
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
          <p>지원일 {formatDateTime(application.appliedAt)}</p>
        </div>
      </Link>
      <div className="row-actions">
        <select value={application.status} onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-outline" onClick={onRemove} aria-label="삭제">
          ✕
        </button>
      </div>
    </div>
  );
}
