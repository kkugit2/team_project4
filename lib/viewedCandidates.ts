import { TABLE_KEYS } from "./constants";
import { getTable, insertRow } from "./localDb";
import type { ViewedCandidate } from "@/types";

export async function recordView(companyId: string, jobseekerId: string): Promise<void> {
  // TODO: Supabase RLS 정책 구성 후 활성화
  // 현재는 로컬메모리에만 기록하지 않음 (선택사항 기능)
  try {
    const rows = await getTable<any>(TABLE_KEYS.VIEWED_CANDIDATES);
    if (rows.some((r) => r.company_id === companyId && r.jobseeker_id === jobseekerId)) return;
    await insertRow(TABLE_KEYS.VIEWED_CANDIDATES, {
      company_id: companyId,
      jobseeker_id: jobseekerId,
      viewed_at: new Date().toISOString(),
    });
  } catch (err) {
    // RLS 정책 오류 무시 - 필수 기능 아님
    console.debug('viewed_candidates 기록 실패 (optional):', err);
  }
}

export async function listViewed(companyId: string): Promise<ViewedCandidate[]> {
  const rows = await getTable<any>(TABLE_KEYS.VIEWED_CANDIDATES);
  return rows
    .filter((r) => r.company_id === companyId)
    .map((r) => ({
      companyId: r.company_id,
      jobseekerId: r.jobseeker_id,
      viewedAt: r.viewed_at,
    }))
    .sort((a, b) => (a.viewedAt < b.viewedAt ? 1 : -1));
}
