import type { Company } from "@/types";

// 원티드 /companies/{id} 응답 형태를 흉내낸 목업. legacy-static/js/data.js의 회사 정보를 확장했다.
export const MOCK_COMPANIES: Company[] = [
  {
    id: "c1",
    name: "테크노바",
    color: "#2563eb",
    description: "중소기업 업무 자동화를 돕는 클라우드 SaaS 스타트업입니다. 현재 800여 개 기업이 사용 중입니다.",
    benefits: "자율출퇴근제 · 최신 장비 지원 · 연 200만원 자기계발비 지원 · 점심/저녁 식대 지원 · 3년차 리프레시 휴가(2주)",
    cultureTagIds: [201, 204, 205],
    avgSalary: 51000000,
  },
  {
    id: "c2",
    name: "블루웨일랩스",
    color: "#0891b2",
    description: "5만여 이커머스 판매자가 사용하는 정산/재고 대시보드를 만듭니다.",
    benefits: "주 4.5일제 시범 운영 · 도서 구입비 무제한 · 사내 스터디 지원 · 신규 입사자 웰컴 키트",
    cultureTagIds: [206],
    avgSalary: 48000000,
  },
  {
    id: "c3",
    name: "그린소프트",
    color: "#16a34a",
    description: "친환경 소비 데이터를 분석해 리테일 기업에 인사이트를 제공합니다.",
    benefits: "재택근무 주 2회 · 개인별 분석 서버 지급 · 컨퍼런스 참가비 지원",
    cultureTagIds: [202],
    avgSalary: 55000000,
  },
  {
    id: "c4",
    name: "파인애플커머스",
    color: "#f59e0b",
    description: "도심형 새벽배송 인프라를 직접 구축/운영하는 커머스 기업입니다.",
    benefits: "상시 채용, 즉시 입사 가능 · 전 직원 신선식품 정기구독 제공 · 명절 상여금 지급",
    cultureTagIds: [],
    avgSalary: 49000000,
  },
  {
    id: "c5",
    name: "오로라디자인",
    color: "#9333ea",
    description: "여러 핀테크 기업의 앱/웹 UX를 설계하는 전문 스튜디오입니다.",
    benefits: "최신 디자인 툴 라이선스 전 직원 지급 · 외부 디자인 컨퍼런스 참가 지원 · 자유복장",
    cultureTagIds: [204],
    avgSalary: 47000000,
  },
  {
    id: "c6",
    name: "넥스트페이먼츠",
    color: "#1d4ed8",
    description: "연 20조원 규모의 결제를 처리하는 결제 인프라 기업입니다.",
    benefits: "국내 최고 수준 연봉 · 스톡옵션 지급 · 최신 장비 및 듀얼 모니터 지원",
    cultureTagIds: [203, 204],
    avgSalary: 58000000,
  },
  {
    id: "c7",
    name: "클라우드메이트",
    color: "#0f766e",
    description: "여러 클라우드(AWS/GCP/Azure)를 통합 관리하는 SaaS를 제공합니다.",
    benefits: "클라우드 자격증 취득 비용 전액 지원 · 사내 세미나/발표 문화 · 유연근무제",
    cultureTagIds: [206],
    avgSalary: 53000000,
  },
  {
    id: "c8",
    name: "스퀘어푸드",
    color: "#db2777",
    description: "1인가구를 위한 밀키트 정기구독 서비스를 운영하는 푸드테크 기업입니다.",
    benefits: "매달 자사 밀키트 무상 제공 · 마케팅 툴/광고비 운영 재량권 부여 · 우수사원 해외연수",
    cultureTagIds: [],
    avgSalary: 45000000,
  },
];

export function findCompanyById(id: string): Company | undefined {
  return MOCK_COMPANIES.find((c) => c.id === id);
}
