// 구직자가 처음 가입할 때 마이페이지(4-5) "스카웃함"이 비어 보이지 않도록 심어주는 데모용 스카웃 템플릿.
// lib/scouts.ts의 seedDemoScoutsForNewJobseeker에서 1회만 사용된다.
export interface SeedScoutTemplate {
  companyId: string;
  companyName: string;
  message: string;
}

export const SEED_SCOUT_TEMPLATES: SeedScoutTemplate[] = [
  {
    companyId: "c1",
    companyName: "테크노바",
    message: "프로필을 보고 백엔드 포지션에 관심이 있으실 것 같아 제안드립니다. 편하실 때 확인 부탁드려요.",
  },
  {
    companyId: "c7",
    companyName: "클라우드메이트",
    message: "인프라/DevOps 직군에서 좋은 시너지를 낼 수 있을 것 같아 스카웃 제안을 드립니다.",
  },
];
