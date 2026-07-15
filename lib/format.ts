// legacy-static/js/app.js 포맷 함수 포팅.

export function formatWon(amount: number): string {
  return `${Math.round(amount / 10000).toLocaleString("ko-KR")}만원`;
}

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return "상시모집";
  return `${dateStr.replaceAll("-", ".")} 마감`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type ScoreLevel = "high" | "mid" | "low";

export function scoreLevel(value: number): ScoreLevel {
  if (value >= 65) return "high";
  if (value >= 40) return "mid";
  return "low";
}
