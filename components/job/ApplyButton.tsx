"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addApplication } from "@/lib/applications";
import { useToast } from "@/components/common/Toast";
import { Modal } from "@/components/common/Modal";
import { formatDateTime } from "@/lib/format";
import type { Application } from "@/types";

/**
 * PRD 4-7 지원 완료 판정 플로우:
 * 지원하기 클릭 → 새 탭으로 원티드 지원 페이지 오픈 → 탭 복귀(visibilitychange) 감지
 * → "지원을 완료하셨나요?" 확인 모달 → "예"일 때만 applications에 기록.
 */
export function ApplyButton({
  applyUrl,
  jobId,
  userId,
  application,
  onApplied,
}: {
  applyUrl: string;
  jobId: string;
  userId: string | null;
  application: Application | null;
  onApplied: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const awaitingReturn = useRef(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible" && awaitingReturn.current) {
        awaitingReturn.current = false;
        setShowConfirm(true);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const openExternal = () => {
    if (!userId) {
      showToast("로그인 후 이용할 수 있습니다");
      router.push("/login");
      return;
    }
    window.open(applyUrl, "_blank", "noopener");
    awaitingReturn.current = true;
  };

  const confirmApplied = (didApply: boolean) => {
    setShowConfirm(false);
    if (didApply && userId) {
      addApplication(userId, jobId);
      showToast("지원현황에 기록되었습니다");
      onApplied();
    }
  };

  if (application) {
    return (
      <>
        <span className="status-pill">
          ✓ 지원완료 ({formatDateTime(application.appliedAt)})
        </span>
        <button type="button" className="btn btn-outline" onClick={openExternal}>
          지원 페이지 다시 열기
        </button>
      </>
    );
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openExternal}>
        원티드에서 지원하기 ↗
      </button>
      {showConfirm && (
        <Modal title="지원을 완료하셨나요?" onClose={() => confirmApplied(false)}>
          <p style={{ marginBottom: 16 }}>
            외부 사이트(원티드)에서 실제로 지원서를 제출하셨다면 &quot;예&quot;를 선택해주세요. 제출 여부는
            자동으로 확인되지 않으며, 자진 신고로만 기록됩니다.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-outline" onClick={() => confirmApplied(false)}>
              아니오
            </button>
            <button type="button" className="btn btn-primary" onClick={() => confirmApplied(true)}>
              예, 완료했어요
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
