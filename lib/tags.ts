import type { Tag, TagType } from "@/types";

// /api/tags/:type (캐시 우선 조회 계약)을 호출하는 클라이언트 계층.
export async function getTags(type: TagType): Promise<Tag[]> {
  const res = await fetch(`/api/tags/${type}`);
  if (!res.ok) return [];
  return res.json();
}
