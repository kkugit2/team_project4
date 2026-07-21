import { TABLE_KEYS } from "./constants";
import { getTable, insertRow, removeRow } from "./localDb";
import type { Bookmark } from "@/types";

export function listBookmarks(userId: string): Bookmark[] {
  return getTable<Bookmark>(TABLE_KEYS.BOOKMARKS)
    .filter((b) => b.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function isBookmarked(userId: string, jobId: string): boolean {
  return getTable<Bookmark>(TABLE_KEYS.BOOKMARKS).some((b) => b.userId === userId && b.jobId === jobId);
}

/** 찜 토글 후 최종 상태(true=찜됨)를 반환한다. */
export function toggleBookmark(userId: string, jobId: string): boolean {
  const bookmarked = isBookmarked(userId, jobId);
  if (bookmarked) {
    removeRow<Bookmark>(TABLE_KEYS.BOOKMARKS, (b) => b.userId === userId && b.jobId === jobId);
    return false;
  }
  insertRow<Bookmark>(TABLE_KEYS.BOOKMARKS, { userId, jobId, createdAt: new Date().toISOString() });
  return true;
}
