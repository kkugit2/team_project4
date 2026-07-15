// legacy-static/js/app.js 포맷 함수 포팅.

export function formatWon(amount: number): string {
  return `${Math.round(amount / 10000).toLocaleString("ko-KR")}만원`;
}

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return "상시모집";
  return `${dateStr.replaceAll("-", ".")} 마감`;
}

/** UI-UX-Guideline_all.md 1-2: D-day는 Mono체로 표기하는 데이터 값이다. */
export function formatDday(dateStr: string | null): string {
  if (!dateStr) return "상시모집";
  const due = new Date(dateStr);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "D-DAY";
  if (diffDays < 0) return "마감";
  return `D-${diffDays}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type ScoreLevel = "high" | "mid" | "low";

/** UI-UX-Guideline_all.md 2장 색상 규칙: 70+/40~69/40미만 3단계 */
export function scoreLevel(value: number): ScoreLevel {
  if (value >= 70) return "high";
  if (value >= 40) return "mid";
  return "low";
}
