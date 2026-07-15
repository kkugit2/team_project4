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

// ---- 회사 · 공고: companies 48개를 회사 1개 + 공고 1개로 1:1 변환 ----

const COMPANY_COLORS = ["#2563eb", "#0891b2", "#16a34a", "#f59e0b", "#9333ea", "#1d4ed8", "#0f766e", "#db2777", "#b45309", "#4f46e5"];
const LOCATIONS = ["서울 강남구", "서울 서초구", "경기 판교", "서울 송파구", "서울 마포구", "서울 성동구", "경기 성남시", "서울 영등포구"];

const POSITION_BY_CATEGORY: Record<string, string> = {
  "서버/백엔드": "백엔드 개발자",
  프론트엔드: "프론트엔드 개발자",
  "데이터/ML": "데이터/ML 엔지니어",
  모바일: "모바일 개발자",
  "게임/그래픽스": "게임 클라이언트 개발자",
  "시스템/임베디드": "임베디드 소프트웨어 엔지니어",
  "인프라/DevOps": "DevOps 엔지니어",
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export const MOCK_COMPANIES: Company[] = rawCompanies.map((c, i) => ({
  id: `c${i + 1}`,
  name: c.name,
  color: COMPANY_COLORS[i % COMPANY_COLORS.length],
  description: `${c.name}은(는) ${c.preferred_skills.join(", ")} 역량을 갖춘 인재를 찾고 있습니다.`,
  benefits: "복지 정보는 회사 채용 페이지에서 확인할 수 있어요.",
  cultureTagIds: [],
}));

export function findCompanyById(id: string): Company | undefined {
  return MOCK_COMPANIES.find((c) => c.id === id);
}

export const MOCK_JOBS: JobDetail[] = rawCompanies.map((c, i) => {
  const category = inferCategory(c.preferred_skills);
  const newHire = 38000000 + (i % 8) * 1000000;
  const requirementParts = [
    `선호 기술: ${c.preferred_skills.join(", ")}`,
    `학점 ${c.preferred_gpa_min} 이상 (4.5 만점 기준)`,
    `선호 경험: ${c.preferred_experience_type.join(", ")}`,
  ];
  if (c.internship_required) requirementParts.push("인턴십 경험 필수");

  return {
    id: `j${i + 1}`,
    companyId: `c${i + 1}`,
    companyName: c.name,
    companyColor: COMPANY_COLORS[i % COMPANY_COLORS.length],
    category,
    position: POSITION_BY_CATEGORY[category] ?? "소프트웨어 엔지니어",
    location: LOCATIONS[i % LOCATIONS.length],
    dueTime: i % 9 === 0 ? null : `2026-08-${pad2((i % 28) + 1)}`,
    applyUrl: `https://example.com/careers/${i + 1}`,
    skillTagIds: toSkillTagIds(c.preferred_skills),
    salary: { newHire, average: newHire + 7000000 },
    intro: `${c.name}은(는) ${c.preferred_skills.join(", ")} 역량을 갖춘 인재를 찾고 있습니다.`,
    mainTasks: `${c.preferred_skills.join(" · ")} 기반 서비스 개발 및 운영`,
    requirements: requirementParts.join(" · "),
    preferredPoints: `${c.preferred_experience_type.join("/")} 경험 보유자 우대`,
    hireRounds: "서류전형 → 실무면접 → 최종면접",
    benefits: "복지 정보는 회사 채용 페이지에서 확인할 수 있어요.",
    promoImages: [],
  };
});

export function findJobById(id: string): JobDetail | undefined {
  return MOCK_JOBS.find((j) => j.id === id);
}

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

/** 스킬 교집합이 가장 큰 공고를 결정적으로 선택 (동률이면 앞선 공고) */
function bestMatchingJobId(skillTagIds: number[]): string {
  let best = MOCK_JOBS[0];
  let bestOverlap = -1;
  for (const job of MOCK_JOBS) {
    const overlap = job.skillTagIds.filter((id) => skillTagIds.includes(id)).length;
    if (overlap > bestOverlap) {
      best = job;
      bestOverlap = overlap;
    }
  }
  return best.id;
}

export const MOCK_CANDIDATES: MockCandidate[] = rawJobseekers.map((js, i) => {
  const skillTagIds = toSkillTagIds(js.skills);
  const lastCareer = js.career_history[js.career_history.length - 1];
  const careerSentence = lastCareer
    ? `${lastCareer.company}에서 ${lastCareer.type}으로 근무한 경험이 있습니다.`
    : "학업과 프로젝트를 통해 실무 역량을 쌓고 있습니다.";
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
    jobId: bestMatchingJobId(skillTagIds),
    content: `${js.skills.slice(0, 3).join(", ")}을(를) 다루는 ${js.major} 전공자입니다. ${careerSentence}`,
  };
});

// ---- 신규 구직자 스카웃함 데모 시드: 앞의 두 회사가 보낸 것으로 구성 ----

export interface SeedScoutTemplate {
  companyId: string;
  companyName: string;
  message: string;
}

export const SEED_SCOUT_TEMPLATES: SeedScoutTemplate[] = MOCK_COMPANIES.slice(0, 2).map((c) => ({
  companyId: c.id,
  companyName: c.name,
  message: `${c.name}에서 프로필을 보고 관심이 있어 스카웃 제안을 드립니다. 편하실 때 확인 부탁드려요.`,
}));
