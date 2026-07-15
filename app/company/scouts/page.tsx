"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/nav/AuthGuard";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { EmptyState } from "@/components/common/EmptyState";
import { SentScoutList } from "@/components/scout/SentScoutList";
import { listSentScouts, remainingMonthlyQuota, withdrawScout } from "@/lib/scouts";
import { isAppError } from "@/lib/errors";
import type { Scout, ScoutStatus } from "@/types";

const FILTERS: { key: ScoutStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "sent", label: "대기중" },
  { key: "accepted", label: "수락됨" },
  { key: "rejected", label: "거절됨" },
  { key: "expired", label: "만료됨" },
];

function ScoutManagementContent() {
  const { session } = useSession();
  const { showToast } = useToast();
  const companyId = session!.userId;

  const [scouts, setScouts] = useState<Scout[]>([]);
  const [remainingQuota, setRemainingQuota] = useState(0);
  const [filter, setFilter] = useState<ScoutStatus | "all">("all");

  const reload = useCallback(() => {
    setScouts(listSentScouts(companyId));
    setRemainingQuota(remainingMonthlyQuota(companyId));
  }, [companyId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => (filter === "all" ? scouts : scouts.filter((s) => s.status === filter)), [scouts, filter]);

  const handleWithdraw = (scoutId: string) => {
    const result = withdrawScout(companyId, scoutId);
    if (isAppError(result)) {
      showToast(result.error.message);
      return;
    }
    showToast("스카웃 제안을 취소했습니다");
    reload();
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>스카웃 관리</h1>
        <p>발송한 스카웃 제안을 상태별로 확인하고 관리하세요.</p>
      </div>

      <p className="hint">이번 달 발송 가능 건수: {remainingQuota}건</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`btn ${filter === f.key ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="해당 상태의 스카웃 제안이 없습니다." />
      ) : (
        <SentScoutList scouts={filtered} onWithdraw={handleWithdraw} />
      )}
    </main>
  );
}

export default function ScoutManagementPage() {
  return (
    <AuthGuard requiredRole="company">
      <ScoutManagementContent />
    </AuthGuard>
  );
}
