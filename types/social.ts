export type Role = "jobseeker" | "company";

export interface Session {
  userId: string;
  email: string;
  role: Role;
}

/** 최초 기록은 항상 'self_reported' (Backend-Guideline 3장). 이후 마이페이지에서 자진 갱신 가능한 진행 상태. */
export type ApplicationStatus =
  | "self_reported"
  | "document_pass"
  | "interview"
  | "hired"
  | "rejected";

export interface Application {
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Bookmark {
  userId: string;
  jobId: string;
  createdAt: string;
}

export interface SelfIntro {
  id: string;
  userId: string;
  jobId: string;
  content: string;
  submittedAt: string;
  sharedWithCompany: boolean;
}

export interface FeedbackResult {
  selfIntroId: string;
  strengths: string[];
  improvements: string[];
  generatedAt: string;
}

export interface MatchCriterionBasis {
  applicable: boolean;
  met: boolean;
  weight: number;
  detail?: string;
}

export interface MatchBasis {
  gpa: MatchCriterionBasis;
  skills: MatchCriterionBasis & { matchedSkillIds: number[] };
  experience: MatchCriterionBasis;
  internship: MatchCriterionBasis;
}

export interface MatchScoreResult {
  score: number;
  basis: MatchBasis;
}

export interface MatchScore extends MatchScoreResult {
  jobseekerId: string;
  companyId: string;
  computedAt: string;
}

export type ScoutStatus = "sent" | "accepted" | "rejected" | "expired";

export interface Scout {
  id: string;
  companyId: string;
  companyName: string;
  jobseekerId: string;
  message: string;
  status: ScoutStatus;
  sentAt: string;
  expiresAt: string;
}

export interface ViewedCandidate {
  companyId: string;
  jobseekerId: string;
  viewedAt: string;
}

export interface CandidateSummary {
  jobseekerId: string;
  /** 익명화된 표시용 라벨 (예: "지원자 A") */
  displayLabel: string;
  school: string;
  major: string;
  gpa: number | null;
  gpaScale: number;
  skillTagIds: number[];
  careerHistory: import("./profile").CareerEntry[];
  selfIntroId: string;
  jobId: string;
  appliedToThisCompany: boolean;
}
