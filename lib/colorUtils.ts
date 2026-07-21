// 기업 ID 또는 이름을 기반으로 고유한 색상 생성
const COMPANY_COLORS = [
  '#1D3557', // 기본 네이비 (primary)
  '#457B9D', // 하늘색
  '#A23B72', // 자주색
  '#F1FAEE', // 아이보리 (글자색이 필요하지만 배경용으로 사용 가능)
  '#E63946', // 빨강
  '#457B9D', // 청록색
  '#2A9D8F', // 초록색
  '#E76F51', // 주황색
  '#264653', // 진회색
  '#D6CDA4', // 황토색
  '#8E7DBE', // 라벤더
  '#6A994E', // 초록색2
  '#BC4749', // 와인색
  '#386641', // 깊은 초록
  '#A7C957', // 라임색
];

export function getCompanyColor(companyIdOrName: string | number): string {
  // String을 숫자로 변환 (ID 기반)
  let hash = 0;
  const str = String(companyIdOrName);

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % COMPANY_COLORS.length;
  return COMPANY_COLORS[index];
}

// 색상의 명도를 기반으로 글자색 결정 (검은색 또는 흰색)
export function getContrastTextColor(backgroundColor: string): string {
  // 간단한 명도 계산 (hex 색상 기준)
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? '#000000' : '#FFFFFF';
}
