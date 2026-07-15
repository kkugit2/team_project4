import { TABLE_KEYS } from "./constants";
import { getTable, insertRow, updateRow, removeRow } from "./localDb";
import type { Application, ApplicationStatus } from "@/types";

export function listApplications(userId: string): Application[] {
  return getTable<Application>(TABLE_KEYS.APPLICATIONS)
    .filter((a) => a.userId === userId)
    .sort((a, b) => (a.appliedAt < b.appliedAt ? 1 : -1));
}

export function hasApplied(userId: string, jobId: string): boolean {
  return getTable<Application>(TABLE_KEYS.APPLICATIONS).some((a) => a.userId === userId && a.jobId === jobId);
}

export function getApplication(userId: string, jobId: string): Application | null {
  return getTable<Application>(TABLE_KEYS.APPLICATIONS).find((a) => a.userId === userId && a.jobId === jobId) ?? null;
}

/** Backend-Guideline: 최초 기록은 항상 status='self_reported' (PRD 4-7 지원 완료 판정 플로우) */
export function addApplication(userId: string, jobId: string): Application {
  const existing = getApplication(userId, jobId);
  if (existing) return existing;
  return insertRow(TABLE_KEYS.APPLICATIONS, {
    userId,
    jobId,
    status: "self_reported" as ApplicationStatus,
    appliedAt: new Date().toISOString(),
  });
}

export function updateApplicationStatus(userId: string, jobId: string, status: ApplicationStatus): Application | null {
  return updateRow<Application>(
    TABLE_KEYS.APPLICATIONS,
    (a) => a.userId === userId && a.jobId === jobId,
    (a) => ({ ...a, status })
  );
}

export function removeApplication(userId: string, jobId: string): void {
  removeRow<Application>(TABLE_KEYS.APPLICATIONS, (a) => a.userId === userId && a.jobId === jobId);
}
