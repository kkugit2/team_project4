// 매칭 게이지 (원형 프로그레스) — 매칭도가 나오는 모든 화면에서 재사용되는 시그니처 컴포넌트
import { gaugeTier } from "./matching.js";

export function gaugeHtml(score, { size = 88, stroke = 8, unit = "매칭도" } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const tier = gaugeTier(pct);

  return `
    <div class="gauge gauge-${tier}" style="width:${size}px;height:${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="gauge-track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" />
        <circle class="gauge-value" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}" />
      </svg>
      <div class="gauge-label">
        <span class="num">${Math.round(pct)}</span>
        <span class="unit">${unit}</span>
      </div>
    </div>`;
}
