"use client";

import { useState } from "react";
import { ScoutModal } from "./ScoutModal";

export function ScoutButton({
  candidateLabel,
  remainingQuota,
  alreadySent,
  onSend,
}: {
  candidateLabel: string;
  remainingQuota: number;
  alreadySent: boolean;
  onSend: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (alreadySent) {
    return <span className="status-pill">스카웃 발송함</span>;
  }

  return (
    <>
      <button type="button" className="btn btn-company" onClick={() => setOpen(true)}>
        스카웃 제안
      </button>
      {open && (
        <ScoutModal
          candidateLabel={candidateLabel}
          remainingQuota={remainingQuota}
          onClose={() => setOpen(false)}
          onSend={(message) => {
            onSend(message);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
