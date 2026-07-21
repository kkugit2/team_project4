import { TABLE_KEYS } from "./constants";
import { getTable, insertRow, updateRow, removeRow } from "./localDb";
import type { Application, ApplicationStatus } from "@/types";

export async function listApplications(userId: string): Promise<Application[]> {
  const rows = await getTable<Application>(TABLE_KEYS.APPLICATIONS);
  return rows
    .filter((a) => a.userId === userId)
    .sort((a, b) => (a.appliedAt < b.appliedAt ? 1 : -1));
}

export async function hasApplied(userId: string, jobId: string): Promise<boolean> {
  const rows = await getTable<Application>(TABLE_KEYS.APPLICATIONS);
  return rows.some((a) => a.userId === userId && a.jobId === jobId);
}

export async function getApplication(userId: string, jobId: string): Promise<Application | null> {
  const rows = await getTable<Application>(TABLE_KEYS.APPLICATIONS);
  return rows.find((a) => a.userId === userId && a.jobId === jobId) ?? null;
}

/** Backend-Guideline: 최초 기록은 항상 status='self_reported' (PRD 4-7 지원 완료 판정 플로우) */
export async function addApplication(userId: string, jobId: string): Promise<Application> {
  const existing = await getApplication(userId, jobId);
  if (existing) return existing;
  return insertRow(TABLE_KEYS.APPLICATIONS, {
    userId,
    jobId,
    status: "self_reported" as ApplicationStatus,
    appliedAt: new Date().toISOString(),
  });
}

export async function updateApplicationStatus(userId: string, jobId: string, status: ApplicationStatus): Promise<Application | null> {
  return updateRow<Application>(
    TABLE_KEYS.APPLICATIONS,
    (a) => a.userId === userId && a.jobId === jobId,
    (a) => ({ ...a, status })
  );
}

export async function removeApplication(userId: string, jobId: string): Promise<void> {
  await removeRow<Application>(TABLE_KEYS.APPLICATIONS, (a) => a.userId === userId && a.jobId === jobId);
}
