import type { Tag, Company, JobDetail, CareerEntry } from "@/types";
import raw from "./dummyData.json";

// 원티드 태그/회사/공고 목업과 데모용 지원자·스카웃 시드를 dummyData.json 하나로 통합 관리한다.
// JSON은 타입과 조회 함수를 담을 수 없으므로, 이 파일이 그 최소한의 타입 부여 + 조회 헬퍼 역할만 한다.
// 실제 연동 시에도 이 파일이 내보내는 이름은 그대로 두고, 값의 출처만 원티드 API 응답으로 바꾸면 된다.

export const SKILL_TAGS = raw.skillTags as Tag[];
export const CATEGORY_TAGS = raw.categoryTags as Tag[];
export const ATTRACTION_TAGS = raw.attractionTags as Tag[];
export const ALL_TAGS: Tag[] = [...SKILL_TAGS, ...CATEGORY_TAGS, ...ATTRACTION_TAGS];

export function findTagById(id: number): Tag | undefined {
  return ALL_TAGS.find((t) => t.id === id);
}

export function findTagsByIds(ids: number[]): Tag[] {
  return ids.map((id) => findTagById(id)).filter((t): t is Tag => Boolean(t));
}

export const MOCK_COMPANIES = raw.companies as Company[];

export function findCompanyById(id: string): Company | undefined {
  return MOCK_COMPANIES.find((c) => c.id === id);
}

export const MOCK_JOBS = raw.jobs as JobDetail[];

export function findJobById(id: string): JobDetail | undefined {
  return MOCK_JOBS.find((j) => j.id === id);
}

export interface MockCandidate {
  jobseekerId: string;
  displayLabel: string;
  school: string;
  major: string;
  gpa: number;
  gpaScale: number;
  skillTagIds: number[];
  careerHistory: CareerEntry[];
  selfIntroId: string;
  jobId: string;
  content: string;
}

export const MOCK_CANDIDATES = raw.candidates as MockCandidate[];

export interface SeedScoutTemplate {
  companyId: string;
  companyName: string;
  message: string;
}

export const SEED_SCOUT_TEMPLATES = raw.seedScoutTemplates as SeedScoutTemplate[];
