import { TABLE_KEYS } from "./constants";
import { getTable, insertRow } from "./localDb";
import type { ViewedCandidate } from "@/types";

export function recordView(companyId: string, jobseekerId: string): void {
  const rows = getTable<ViewedCandidate>(TABLE_KEYS.VIEWED_CANDIDATES);
  if (rows.some((r) => r.companyId === companyId && r.jobseekerId === jobseekerId)) return;
  insertRow<ViewedCandidate>(TABLE_KEYS.VIEWED_CANDIDATES, {
    companyId,
    jobseekerId,
    viewedAt: new Date().toISOString(),
  });
}

export function listViewed(companyId: string): ViewedCandidate[] {
  return getTable<ViewedCandidate>(TABLE_KEYS.VIEWED_CANDIDATES)
    .filter((r) => r.companyId === companyId)
    .sort((a, b) => (a.viewedAt < b.viewedAt ? 1 : -1));
}
