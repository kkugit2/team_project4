import type { Tag } from "@/types";

// 원티드 태그 API(스킬/직군/매력) 마스터 리스트를 흉내낸 고정 목업.
// 실제 연동 시 lib/tags.ts 내부에서 원티드 /tags/* 응답으로 교체하고, id 체계만 유지한다.

export const SKILL_TAGS: Tag[] = [
  { id: 1, type: "skill", title: "Python" },
  { id: 2, type: "skill", title: "Django" },
  { id: 3, type: "skill", title: "FastAPI" },
  { id: 4, type: "skill", title: "React" },
  { id: 5, type: "skill", title: "TypeScript" },
  { id: 6, type: "skill", title: "SQL" },
  { id: 7, type: "skill", title: "pandas" },
  { id: 8, type: "skill", title: "Kubernetes" },
  { id: 9, type: "skill", title: "Docker" },
  { id: 10, type: "skill", title: "AWS" },
  { id: 11, type: "skill", title: "Figma" },
  { id: 12, type: "skill", title: "GA(Google Analytics)" },
  { id: 13, type: "skill", title: "Terraform" },
  { id: 14, type: "skill", title: "Java" },
  { id: 15, type: "skill", title: "Spring" },
  { id: 16, type: "skill", title: "Node.js" },
];

export const CATEGORY_TAGS: Tag[] = [
  { id: 101, type: "category", title: "서버/백엔드" },
  { id: 102, type: "category", title: "프론트엔드" },
  { id: 103, type: "category", title: "데이터" },
  { id: 104, type: "category", title: "기획/PM" },
  { id: 105, type: "category", title: "디자인" },
  { id: 106, type: "category", title: "인프라/DevOps" },
  { id: 107, type: "category", title: "마케팅" },
];

export const ATTRACTION_TAGS: Tag[] = [
  { id: 201, type: "attraction", title: "자율출퇴근" },
  { id: 202, type: "attraction", title: "재택근무" },
  { id: 203, type: "attraction", title: "스톡옵션" },
  { id: 204, type: "attraction", title: "최신 장비 지원" },
  { id: 205, type: "attraction", title: "자기계발비 지원" },
  { id: 206, type: "attraction", title: "유연근무제" },
];

export const ALL_TAGS: Tag[] = [...SKILL_TAGS, ...CATEGORY_TAGS, ...ATTRACTION_TAGS];

export function findTagById(id: number): Tag | undefined {
  return ALL_TAGS.find((t) => t.id === id);
}

export function findTagsByIds(ids: number[]): Tag[] {
  return ids.map((id) => findTagById(id)).filter((t): t is Tag => Boolean(t));
}
