import type { Scout } from "@/types";
import { formatDateTime } from "@/lib/format";

const STATUS_LABEL: Record<Scout["status"], string> = {
  sent: "응답 대기",
  accepted: "수락됨",
  rejected: "거절됨",
  expired: "만료됨",
};

export function SentScoutList({ scouts }: { scouts: Scout[] }) {
  return (
    <div className="list">
      {scouts.map((s) => (
        <div key={s.id} className="row-card">
          <div className="row-info">
            <div>
              <h3>지원자 {s.jobseekerId.slice(-4).toUpperCase()}</h3>
              <p>발송일 {formatDateTime(s.sentAt)}</p>
            </div>
          </div>
          <div className="row-actions">
            <span className="status-pill">{STATUS_LABEL[s.status]}</span>
            {s.status === "accepted" && <span className="status-pill">스카웃 수락자</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
