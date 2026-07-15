import type { Scout } from "@/types";
import { formatDateTime } from "@/lib/format";
import styles from "./ScoutInboxItem.module.css";

const STATUS_LABEL: Record<Scout["status"], string> = {
  sent: "응답 대기",
  accepted: "수락함",
  rejected: "거절함",
  expired: "만료됨",
};

export function ScoutInboxItem({
  scout,
  onRespond,
}: {
  scout: Scout;
  onRespond: (action: "accepted" | "rejected") => void;
}) {
  return (
    <div className="row-card">
      <div className="row-info">
        <div>
          <h3>{scout.companyName}에서 스카웃 제안</h3>
          <p className={styles.message}>{scout.message}</p>
          <p>
            발송일 {formatDateTime(scout.sentAt)} · 만료 {formatDateTime(scout.expiresAt)}
          </p>
        </div>
      </div>
      <div className="row-actions">
        {scout.status === "sent" ? (
          <>
            <button type="button" className="btn btn-outline" onClick={() => onRespond("rejected")}>
              거절
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onRespond("accepted")}>
              수락
            </button>
          </>
        ) : (
          <span className="status-pill">{STATUS_LABEL[scout.status]}</span>
        )}
      </div>
    </div>
  );
}
