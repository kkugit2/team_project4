import type { Tag, Company, JobDetail, CareerEntry } from "@/types";
import raw from "@/dummyData.json";

// 저장소 루트의 dummyData.json(jobseekers 49명 + companies 48개)을 앱 도메인 타입으로 변환하는 어댑터.
// 원본 스키마는 스킬이 문자열이고 공고/태그 개념이 없으므로, 여기서 결정적(비랜덤) 규칙으로
// 태그 id 부여 · 회사→공고 1:1 생성 · 구직자→데모 지원자 변환을 수행한다.
// 내보내는 이름(MOCK_JOBS, findTagById 등)은 기존과 동일해 호출부는 변경할 필요가 없다.

interface RawJobseeker {
  school: string;
  major: string;
  graduation_status: string;
  gpa: number;
  gpa_scale: number;
  skills: string[];
  certifications: string[];
  career_years: number;
  career_history: { company: string; period: string; type: string }[];
}

interface RawCompany {
  name: string;
  preferred_gpa_min: number;
  preferred_skills: string[];
  preferred_experience_type: string[];
  internship_required: boolean;
}

const rawJobseekers = raw.jobseekers as RawJobseeker[];
const rawCompanies = raw.companies as RawCompany[];

// ---- 스킬 태그: 원본에 등장하는 모든 스킬 문자열에 등장 순서대로 id 부여 ----

const skillTitles: string[] = [];
for (const js of rawJobseekers) for (const s of js.skills) if (!skillTitles.includes(s)) skillTitles.push(s);
for (const c of rawCompanies) for (const s of c.preferred_skills) if (!skillTitles.includes(s)) skillTitles.push(s);

export const SKILL_TAGS: Tag[] = skillTitles.map((title, i) => ({ id: i + 1, type: "skill", title }));

const skillIdByTitle = new Map(SKILL_TAGS.map((t) => [t.title, t.id]));

function toSkillTagIds(titles: string[]): number[] {
  return titles.map((t) => skillIdByTitle.get(t)).filter((id): id is number => id !== undefined);
}

// ---- 직군 카테고리: 스킬 구성에서 결정적 규칙으로 추론 ----

const CATEGORY_RULES: { title: string; keywords: string[] }[] = [
  { title: "데이터/ML", keywords: ["machine learning", "tensorflow", "pytorch", "deep learning", "pandas", "tableau", "cuda", "matplotlib"] },
  { title: "모바일", keywords: ["android", "kotlin"] },
  { title: "게임/그래픽스", keywords: ["unreal engine", "opengl", "qt"] },
  { title: "시스템/임베디드", keywords: ["verilog", "matlab", "ros", "c"] },
  { title: "인프라/DevOps", keywords: ["kubernetes", "docker", "terraform", "grpc"] },
  { title: "프론트엔드", keywords: ["react", "vue.js", "css", "html", "graphql", "typescript", "javascript"] },
];

function inferCategory(skills: string[]): string {
  const lower = skills.map((s) => s.toLowerCase());
  for (const rule of CATEGORY_RULES) {
    if (lower.some((s) => rule.keywords.includes(s))) return rule.title;
  }
  return "서버/백엔드";
}

const categoryTitles = Array.from(new Set(rawCompanies.map((c) => inferCategory(c.preferred_skills)).concat("서버/백엔드")));

export const CATEGORY_TAGS: Tag[] = categoryTitles.map((title, i) => ({ id: 101 + i, type: "category", title }));

// 원본에 매력/복지 태그 개념이 없으므로 비워둔다 (없는 데이터를 지어내지 않는다).
export const ATTRACTION_TAGS: Tag[] = [];

export const ALL_TAGS: Tag[] = [...SKILL_TAGS, ...CATEGORY_TAGS, ...ATTRACTION_TAGS];

export function findTagById(id: number): Tag | undefined {
  return ALL_TAGS.find((t) => t.id === id);
}

export function findTagsByIds(ids: number[]): Tag[] {
  return ids.map((id) => findTagById(id)).filter((t): t is Tag => Boolean(t));
}

// 회사 · 공고 데이터는 CSV(jobs.csv, companies.csv)에서 로드
// lib/csvLoader.ts 참조

// ---- 데모 지원자: jobseekers 49명을 기업용 랭킹(4-2) 시드 지원자로 변환 ----

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

function indexToLetters(i: number): string {
  let n = i;
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

// 주의: jobId는 CSV 공고 ID(374736 등)로 설정됨
// 실제로는 lib/csvLoader의 getJobsFromCSV()에서 가져온 ID를 사용해야 함

export const MOCK_CANDIDATES: MockCandidate[] = rawJobseekers.map((js, i) => {
  const skillTagIds = toSkillTagIds(js.skills);
  const lastCareer = js.career_history[js.career_history.length - 1];
  const careerSentence = lastCareer
    ? `${lastCareer.company}에서 ${lastCareer.type}으로 근무한 경험이 있습니다.`
    : "학업과 프로젝트를 통해 실무 역량을 쌓고 있습니다.";

  // 임시: CSV 공고 ID 매핑 (첫 공고 또는 skillTagIds 기반)
  // 실제로는 getJobsFromCSV()로부터 가져와야 함
  const csvJobIds = ["374736", "374735", "374288", "292867", "342694"];
  const jobId = csvJobIds[i % csvJobIds.length];

  return {
    jobseekerId: `seed-${i + 1}`,
    displayLabel: `지원자 ${indexToLetters(i)}`,
    school: js.school,
    major: js.major,
    gpa: js.gpa,
    gpaScale: js.gpa_scale,
    skillTagIds,
    careerHistory: js.career_history.map((h) => ({
      company: h.company,
      period: h.period,
      role: h.type,
      isInternship: h.type === "인턴",
    })),
    selfIntroId: `seed-si-${i + 1}`,
    jobId,
    content: `${js.skills.slice(0, 3).join(", ")}을(를) 다루는 ${js.major} 전공자입니다. ${careerSentence}`,
  };
});

// 스카웃 템플릿은 Supabase에서 관리됨
