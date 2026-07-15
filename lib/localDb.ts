// 유일하게 window.localStorage를 직접 건드리는 모듈. 나머지 lib/*는 전부 이 파일을 거친다.
// 실제 Supabase 연동 시에는 이 파일의 함수 "본문"만 쿼리 호출로 바꾸면 되고,
// 호출부(다른 lib 모듈)는 변경할 필요가 없도록 시그니처를 유지한다.

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getTable<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function setTable<T>(key: string, rows: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(rows));
}

export function insertRow<T>(key: string, row: T): T {
  const rows = getTable<T>(key);
  rows.push(row);
  setTable(key, rows);
  return row;
}

export function upsertRow<T>(key: string, row: T, matches: (r: T) => boolean): T {
  const rows = getTable<T>(key);
  const idx = rows.findIndex(matches);
  if (idx === -1) rows.push(row);
  else rows[idx] = row;
  setTable(key, rows);
  return row;
}

export function updateRow<T>(key: string, matches: (r: T) => boolean, updater: (r: T) => T): T | null {
  const rows = getTable<T>(key);
  const idx = rows.findIndex(matches);
  if (idx === -1) return null;
  rows[idx] = updater(rows[idx]);
  setTable(key, rows);
  return rows[idx];
}

export function removeRow<T>(key: string, matches: (r: T) => boolean): void {
  setTable(
    key,
    getTable<T>(key).filter((r) => !matches(r))
  );
}

export function getSingleton<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setSingleton<T>(key: string, value: T | null): void {
  if (!isBrowser()) return;
  if (value === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, JSON.stringify(value));
}

export function genId(prefix: string): string {
  const rand = isBrowser() && "randomUUID" in window.crypto
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rand}`;
}
