import type { CareerEntry } from "@/types";

// 기업용 랜딩페이지(4-2)를 혼자서도 데모할 수 있도록 미리 시드해두는 가상 지원자.
// 실제 localStorage 자소서 제출자와 합쳐져 lib/selfIntro.listCandidatesForCompany에서 사용된다.
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

export const MOCK_CANDIDATES: MockCandidate[] = [
  {
    jobseekerId: "seed-1",
    displayLabel: "지원자 A",
    school: "한빛대학교",
    major: "컴퓨터공학과",
    gpa: 4.1,
    gpaScale: 4.5,
    skillTagIds: [1, 2, 3, 6],
    careerHistory: [{ company: "스타트업 인턴", period: "2025.01-2025.06", role: "백엔드", isInternship: true }],
    selfIntroId: "seed-si-1",
    jobId: "j1",
    content: "Django 기반 사이드 프로젝트를 운영하며 REST API 설계 경험을 쌓았습니다.",
  },
  {
    jobseekerId: "seed-2",
    displayLabel: "지원자 B",
    school: "강남대학교",
    major: "소프트웨어학과",
    gpa: 3.8,
    gpaScale: 4.5,
    skillTagIds: [4, 5],
    careerHistory: [],
    selfIntroId: "seed-si-2",
    jobId: "j2",
    content: "React와 TypeScript로 팀 프로젝트 대시보드를 구현한 경험이 있습니다.",
  },
  {
    jobseekerId: "seed-3",
    displayLabel: "지원자 C",
    school: "서한대학교",
    major: "산업공학과",
    gpa: 4.3,
    gpaScale: 4.3,
    skillTagIds: [6, 7],
    careerHistory: [{ company: "데이터랩", period: "2024.07-2024.12", role: "데이터 분석 인턴", isInternship: true }],
    selfIntroId: "seed-si-3",
    jobId: "j3",
    content: "pandas로 판매 데이터를 분석해 재고 최적화 리포트를 작성한 경험이 있습니다.",
  },
  {
    jobseekerId: "seed-4",
    displayLabel: "지원자 D",
    school: "한빛대학교",
    major: "컴퓨터공학과",
    gpa: 3.6,
    gpaScale: 4.5,
    skillTagIds: [8, 9, 10],
    careerHistory: [{ company: "클라우드 스타트업", period: "2024.01-2024.12", role: "인프라", isInternship: false }],
    selfIntroId: "seed-si-4",
    jobId: "j7",
    content: "Kubernetes 클러스터 운영 및 CI/CD 파이프라인 구축 경험이 있습니다.",
  },
  {
    jobseekerId: "seed-5",
    displayLabel: "지원자 E",
    school: "동서대학교",
    major: "디자인학과",
    gpa: 4.0,
    gpaScale: 4.5,
    skillTagIds: [11],
    careerHistory: [],
    selfIntroId: "seed-si-5",
    jobId: "j5",
    content: "핀테크 서비스 UX 리서치 프로젝트에 참여해 와이어프레임을 제작했습니다.",
  },
  {
    jobseekerId: "seed-6",
    displayLabel: "지원자 F",
    school: "강남대학교",
    major: "경영학과",
    gpa: 3.9,
    gpaScale: 4.5,
    skillTagIds: [12],
    careerHistory: [{ company: "이커머스 스타트업", period: "2025.03-2025.08", role: "마케팅 인턴", isInternship: true }],
    selfIntroId: "seed-si-6",
    jobId: "j8",
    content: "퍼포먼스 마케팅 캠페인을 직접 운영하며 GA로 채널별 성과를 분석했습니다.",
  },
];
