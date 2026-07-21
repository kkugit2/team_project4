// Backend-Guideline 7장: 스카웃 시스템. 발송 한도/만료 규칙은 순수 함수로 분리해
// 나중에 서버 라우트로 그대로 옮길 수 있게 한다.
import { TABLE_KEYS, SCOUT_MONTHLY_LIMIT, SCOUT_EXPIRY_DAYS } from "./constants";
import { appError, ERROR_CODES, type AppError } from "./errors";
import { genId, getTable, setTable, insertRow, removeRow, getSingleton, setSingleton } from "./localDb";
import type { Scout } from "@/types";

// SEED_SCOUT_TEMPLATES는 삭제됨 (CSV 기반으로 변경)


const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// ---- 순수 헬퍼 (서버로 그대로 이식 가능) ----

export function countScoutsSentInLast30Days(companyId: string, allScouts: Scout[], now: Date = new Date()): number {
  const cutoff = now.getTime() - THIRTY_DAYS_MS;
  return allScouts.filter((s) => s.companyId === companyId && new Date(s.sentAt).getTime() >= cutoff).length;
}

export function isWithinMonthlyLimit(
  companyId: string,
  allScouts: Scout[],
  limit: number = SCOUT_MONTHLY_LIMIT,
  now: Date = new Date()
): boolean {
  return countScoutsSentInLast30Days(companyId, allScouts, now) < limit;
}

export function computeExpiresAt(sentAt: Date): Date {
  return new Date(sentAt.getTime() + SCOUT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

export function lazilyExpire(scout: Scout, now: Date = new Date()): Scout {
  if (scout.status === "sent" && now.getTime() > new Date(scout.expiresAt).getTime()) {
    return { ...scout, status: "expired" };
  }
  return scout;
}

// ---- 데이터 접근 (localStorage, 나중에 /api/scouts로 교체) ----

function allScouts(): Scout[] {
  return getTable<Scout>(TABLE_KEYS.SCOUTS);
}

function persistLazyExpiry(rows: Scout[]): Scout[] {
  const now = new Date();
  const updated = rows.map((s) => lazilyExpire(s, now));
  setTable(TABLE_KEYS.SCOUTS, updated);
  return updated;
}

export function sendScout(
  companyId: string,
  companyName: string,
  jobseekerId: string,
  message: string
): Scout | AppError {
  const rows = persistLazyExpiry(allScouts());
  if (!isWithinMonthlyLimit(companyId, rows)) {
    return appError(ERROR_CODES.SCOUT_LIMIT_EXCEEDED, "최근 30일간 발송 가능한 스카웃 건수(10건)를 모두 사용했습니다.");
  }
  const sentAt = new Date();
  const scout: Scout = {
    id: genId("scout"),
    companyId,
    companyName,
    jobseekerId,
    message,
    status: "sent",
    sentAt: sentAt.toISOString(),
    expiresAt: computeExpiresAt(sentAt).toISOString(),
  };
  return insertRow(TABLE_KEYS.SCOUTS, scout);
}

export function listReceivedScouts(jobseekerId: string): Scout[] {
  return persistLazyExpiry(allScouts()).filter((s) => s.jobseekerId === jobseekerId);
}

export function listSentScouts(companyId: string): Scout[] {
  return persistLazyExpiry(allScouts()).filter((s) => s.companyId === companyId);
}

export function respondToScout(scoutId: string, action: "accepted" | "rejected"): Scout | AppError {
  const rows = persistLazyExpiry(allScouts());
  const idx = rows.findIndex((s) => s.id === scoutId);
  if (idx === -1) return appError(ERROR_CODES.NOT_FOUND, "스카웃 제안을 찾을 수 없습니다.");
  if (rows[idx].status !== "sent") return appError(ERROR_CODES.FORBIDDEN, "이미 처리되었거나 만료된 제안입니다.");
  rows[idx] = { ...rows[idx], status: action };
  setTable(TABLE_KEYS.SCOUTS, rows);
  return rows[idx];
}

/**
 * UI-UX-Guideline_all.md 4-4 "제안 취소". Backend-Guideline 7-2의 상태 전이표(sent→accepted|rejected|expired)에
 * 새 상태를 추가하지 않기 위해, 취소는 상태 변경이 아니라 대기중(sent) 행 자체를 삭제하는 방식으로 구현한다.
 */
export function withdrawScout(companyId: string, scoutId: string): true | AppError {
  const rows = persistLazyExpiry(allScouts());
  const scout = rows.find((s) => s.id === scoutId);
  if (!scout) return appError(ERROR_CODES.NOT_FOUND, "스카웃 제안을 찾을 수 없습니다.");
  if (scout.companyId !== companyId) return appError(ERROR_CODES.FORBIDDEN, "본인이 발송한 스카웃만 취소할 수 있습니다.");
  if (scout.status !== "sent") return appError(ERROR_CODES.FORBIDDEN, "대기중인 제안만 취소할 수 있습니다.");
  removeRow<Scout>(TABLE_KEYS.SCOUTS, (s) => s.id === scoutId);
  return true;
}

export function remainingMonthlyQuota(companyId: string): number {
  const rows = persistLazyExpiry(allScouts());
  return Math.max(0, SCOUT_MONTHLY_LIMIT - countScoutsSentInLast30Days(companyId, rows));
}

// ---- 신규 구직자 데모 시드 (마이페이지가 비어 보이지 않도록 1회 시드) ----

interface SeededFlags {
  scoutsSeededFor: string[];
}

export function seedDemoScoutsForNewJobseeker(jobseekerId: string): void {
  // TODO: Supabase 연동 시 CSV 데이터에서 샘플 회사의 스카웃 제안을 생성
  // 현재는 빈 상태로 유지 (스카웃 기능은 사용자가 직접 발송)
  const flags = getSingleton<SeededFlags>(TABLE_KEYS.SEEDED_FLAGS) ?? { scoutsSeededFor: [] };
  flags.scoutsSeededFor.push(jobseekerId);
  setSingleton(TABLE_KEYS.SEEDED_FLAGS, flags);
}
