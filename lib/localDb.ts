// Supabase 기반 데이터 접근 계층
// 이전: localStorage 사용 → 현재: Supabase Postgres 사용
// 함수 시그니처는 유지하여 호출부 변경 최소화

import { supabase, supabaseServer } from '@/lib/supabase';
import { TABLE_KEYS } from '@/lib/constants';

// 테이블 이름 매핑
const tableNameMap: Record<string, string> = {
  [TABLE_KEYS.JOBSEEKER_PROFILE]: 'jobseeker_profile',
  [TABLE_KEYS.COMPANY_PROFILE]: 'company_profile',
  [TABLE_KEYS.APPLICATIONS]: 'applications',
  [TABLE_KEYS.BOOKMARKS]: 'bookmarks',
  [TABLE_KEYS.SELF_INTROS]: 'self_intros',
  [TABLE_KEYS.FEEDBACK_RESULTS]: 'feedback_results',
  [TABLE_KEYS.SCOUTS]: 'scouts',
  [TABLE_KEYS.VIEWED_CANDIDATES]: 'viewed_candidates',
  // localStorage 전용 (Supabase 없음)
  [TABLE_KEYS.AUTH_USERS]: 'auth_users',
  [TABLE_KEYS.SESSION]: 'session',
  [TABLE_KEYS.SEEDED_FLAGS]: 'seeded_flags',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getTableName(key: string): string {
  return tableNameMap[key] || key;
}

function isLocalStorageTable(key: string): boolean {
  // localStorage 전용 테이블들
  const localStorageKeys = [
    TABLE_KEYS.AUTH_USERS,
    TABLE_KEYS.SESSION,
    TABLE_KEYS.SEEDED_FLAGS,
  ];
  return localStorageKeys.includes(key as any);
}

function readLocalStorage<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalStorage<T>(key: string, rows: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(rows));
}

export async function getTable<T>(key: string): Promise<T[]> {
  // localStorage 전용 테이블
  if (isLocalStorageTable(key)) {
    return readLocalStorage<T>(key);
  }

  // Supabase 테이블
  try {
    const tableName = getTableName(key);
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }

    return (data || []) as T[];
  } catch (err) {
    console.error(`Error in getTable(${key}):`, err);
    return [];
  }
}

export function setTable<T>(key: string, rows: T[]): void {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    writeLocalStorage(key, rows);
    return;
  }

  // Supabase는 개별 CRUD 연산으로만 지원
  // setTable 호출은 거의 없으므로 로그만 남김
  console.warn(`setTable called for ${key} - use insertRow/updateRow instead`);
}

export async function insertRow<T>(key: string, row: T): Promise<T> {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    const rows = readLocalStorage<T>(key);
    rows.push(row);
    writeLocalStorage(key, rows);
    return row;
  }

  // Supabase
  try {
    const tableName = getTableName(key);
    const { data, error } = await supabase
      .from(tableName)
      .insert([row as any])
      .select()
      .single();

    if (error) {
      // viewed_candidates는 선택사항 기능이므로 에러 무시
      if (tableName === 'viewed_candidates') {
        return row as T;
      }
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }

    return (data || row) as T;
  } catch (err) {
    // viewed_candidates는 선택사항 기능이므로 에러 무시
    if (getTableName(key) === 'viewed_candidates') {
      return row as T;
    }
    console.error(`Error in insertRow(${key}):`, err);
    throw err;
  }
}

export async function upsertRow<T>(
  key: string,
  row: T,
  matches: (r: T) => boolean
): Promise<T> {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    const rows = readLocalStorage<T>(key);
    const idx = rows.findIndex(matches);
    if (idx === -1) rows.push(row);
    else rows[idx] = row;
    writeLocalStorage(key, rows);
    return rows[idx];
  }

  // Supabase: UPSERT 사용
  try {
    const tableName = getTableName(key);
    const { data, error } = await supabase
      .from(tableName)
      .upsert([row as any], { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error(`Error upserting into ${tableName}:`, error);
      throw error;
    }

    return (data || row) as T;
  } catch (err) {
    console.error(`Error in upsertRow(${key}):`, err);
    throw err;
  }
}

export async function updateRow<T>(
  key: string,
  matches: (r: T) => boolean,
  updater: (r: T) => T
): Promise<T | null> {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    const rows = readLocalStorage<T>(key);
    const idx = rows.findIndex(matches);
    if (idx === -1) return null;
    rows[idx] = updater(rows[idx]);
    writeLocalStorage(key, rows);
    return rows[idx];
  }

  // Supabase: 먼저 조회 후 업데이트
  try {
    const tableName = getTableName(key);
    const { data: rows, error: fetchError } = await supabase
      .from(tableName)
      .select('*');

    if (fetchError) throw fetchError;

    const rowToUpdate = (rows || []).find((r: T) => matches(r));
    if (!rowToUpdate) return null;

    const updated = updater(rowToUpdate);
    const { data, error } = await supabase
      .from(tableName)
      .update(updated as any)
      .eq('id', (updated as any).id)
      .select()
      .single();

    if (error) throw error;

    return (data || updated) as T;
  } catch (err) {
    console.error(`Error in updateRow(${key}):`, err);
    return null;
  }
}

export async function removeRow<T>(
  key: string,
  matches: (r: T) => boolean
): Promise<void> {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    const rows = readLocalStorage<T>(key);
    const filtered = rows.filter((r) => !matches(r));
    writeLocalStorage(key, filtered);
    return;
  }

  // Supabase: 먼저 조회 후 삭제
  try {
    const tableName = getTableName(key);
    const { data: rows, error: fetchError } = await supabase
      .from(tableName)
      .select('id');

    if (fetchError) throw fetchError;

    const rowToDelete = (rows || []).find((r: any) => matches(r as T));
    if (!rowToDelete) return;

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', (rowToDelete as any).id);

    if (error) throw error;
  } catch (err) {
    console.error(`Error in removeRow(${key}):`, err);
  }
}

export function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function getSingleton<T>(key: string): Promise<T | null> {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    const rows = readLocalStorage<T>(key);
    return rows.length > 0 ? rows[0] : null;
  }

  // Supabase
  try {
    const tableName = getTableName(key);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      console.error(`Error fetching ${tableName}:`, error);
    }

    return (data || null) as T | null;
  } catch (err) {
    console.error(`Error in getSingleton(${key}):`, err);
    return null;
  }
}

export async function setSingleton<T>(key: string, value: T): Promise<void> {
  // localStorage 전용
  if (isLocalStorageTable(key)) {
    writeLocalStorage(key, [value]);
    return;
  }

  // Supabase: 모두 삭제 후 삽입
  try {
    const tableName = getTableName(key);

    // Delete all
    await supabase.from(tableName).delete().gte('id', 0);

    // Insert new
    await supabase.from(tableName).insert([value as any]);
  } catch (err) {
    console.error(`Error in setSingleton(${key}):`, err);
  }
}
