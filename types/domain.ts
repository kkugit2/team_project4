// 원티드 Open API가 제공하는 형태를 흉내낸 도메인 타입.
// 실제 연동 시에도 이 타입들의 필드는 유지하고, lib/wanted.ts의 어댑터 내부만 교체한다.

export type TagType = "skill" | "category" | "attraction";

export interface Tag {
  id: number;
  type: TagType;
  title: string;
}

export interface PromoImage {
  label: string;
  bg: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyColor: string;
  companyLogoUrl?: string;
  category: string;
  position: string;
  location: string;
  dueTime: string | null;
  applyUrl: string;
  skillTagIds: number[];
  salary: {
    newHire: number;
    average: number;
  } | null;
}

export interface JobDetail extends Job {
  intro: string;
  mainTasks: string;
  requirements: string;
  preferredPoints: string;
  hireRounds: string;
  benefits: string;
  promoImages: PromoImage[];
}

export interface Company {
  id: string;
  name: string;
  color: string;
  description: string;
  benefits: string;
  cultureTagIds: number[];
  avgSalary?: number;
}
