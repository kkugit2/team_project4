import type { Scout } from "@/types";
import { formatDateTime } from "@/lib/format";

const STATUS_LABEL: Record<Scout["status"], string> = {
  sent: "응답 대기",
  accepted: "수락됨",
  rejected: "거절됨",
  expired: "만료됨",
};

export function SentScoutList({ scouts, onWithdraw }: { scouts: Scout[]; onWithdraw?: (scoutId: string) => void }) {
  return (
    <div className="list">
      {scouts.map((s) => (
        <div key={s.id} className="row-card">
          <div className="row-info">
            <div>
              <h3>지원자 {s.jobseekerId.slice(-4).toUpperCase()}</h3>
              <p>발송일 {formatDateTime(s.sentAt)}</p>
              {s.status === "sent" && <p>만료 예정 {formatDateTime(s.expiresAt)}</p>}
            </div>
          </div>
          <div className="row-actions">
            <span className="status-pill">{STATUS_LABEL[s.status]}</span>
            {s.status === "accepted" && <span className="hint" style={{ margin: 0 }}>수락됨 · 후속 컨택은 별도 채널로 진행해주세요</span>}
            {s.status === "sent" && onWithdraw && (
              <button type="button" className="btn btn-outline" onClick={() => onWithdraw(s.id)}>
                제안 취소
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
