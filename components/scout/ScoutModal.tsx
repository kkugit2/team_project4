"use client";

import { useState } from "react";
import { Modal } from "@/components/common/Modal";

export function ScoutModal({
  candidateLabel,
  remainingQuota,
  onSend,
  onClose,
}: {
  candidateLabel: string;
  remainingQuota: number;
  onSend: (message: string) => void;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");

  return (
    <Modal title={`${candidateLabel}에게 스카웃 제안`} onClose={onClose}>
      <p className="hint" style={{ margin: "0 0 12px" }}>
        스카웃은 관심 표시이며 서류/면접 프리패스가 아닙니다. 이번 달 남은 발송 가능 건수: {remainingQuota}건
      </p>
      <textarea
        rows={4}
        placeholder="포지션 소개와 관심을 갖게 된 이유를 간단히 적어주세요."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-outline" onClick={onClose}>
          취소
        </button>
        <button type="button" className="btn btn-company" disabled={!message.trim()} onClick={() => onSend(message)}>
          스카웃 보내기
        </button>
      </div>
    </Modal>
  );
}
