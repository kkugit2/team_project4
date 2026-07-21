import { TABLE_KEYS } from "./constants";
import { getTable, insertRow } from "./localDb";
import type { ViewedCandidate } from "@/types";

export async function recordView(companyId: string, jobseekerId: string): Promise<void> {
  const rows = await getTable<ViewedCandidate>(TABLE_KEYS.VIEWED_CANDIDATES);
  if (rows.some((r) => r.companyId === companyId && r.jobseekerId === jobseekerId)) return;
  await insertRow<ViewedCandidate>(TABLE_KEYS.VIEWED_CANDIDATES, {
    companyId,
    jobseekerId,
    viewedAt: new Date().toISOString(),
  });
}

export async function listViewed(companyId: string): Promise<ViewedCandidate[]> {
  const rows = await getTable<ViewedCandidate>(TABLE_KEYS.VIEWED_CANDIDATES);
  return rows
    .filter((r) => r.companyId === companyId)
    .sort((a, b) => (a.viewedAt < b.viewedAt ? 1 : -1));
}
