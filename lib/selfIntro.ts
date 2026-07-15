// Backend-Guideline 6장: 자소서 제출/피드백/기업 노출 통제.
// listCandidatesForCompany가 shared_with_company 필터를 거는 유일한 관문이다 (동의 없는 노출 원천 차단).
import { TABLE_KEYS } from "./constants";
import { genId, getTable, insertRow, upsertRow } from "./localDb";
import { getJobseekerProfile } from "./profiles";
import { hasApplied } from "./applications";
import { generateFeedback } from "./mockLlm";
import { findJobById, MOCK_CANDIDATES } from "@/data/dummyData";
import type { SelfIntro, FeedbackResult, JobDetail, CandidateSummary, CompanyProfile } from "@/types";

export function submitSelfIntro(input: {
  userId: string;
  jobId: string;
  content: string;
  sharedWithCompany: boolean;
}): SelfIntro {
  const selfIntro: SelfIntro = {
    id: genId("si"),
    userId: input.userId,
    jobId: input.jobId,
    content: input.content,
    submittedAt: new Date().toISOString(),
    sharedWithCompany: input.sharedWithCompany,
  };
  insertRow(TABLE_KEYS.SELF_INTROS, selfIntro);
  return selfIntro;
}

export function listSelfIntrosByUser(userId: string): SelfIntro[] {
  return getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS)
    .filter((si) => si.userId === userId)
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export function listSelfIntrosForJob(jobId: string): SelfIntro[] {
  return getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS).filter((si) => si.jobId === jobId);
}

export function getSelfIntro(id: string): SelfIntro | null {
  return getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS).find((si) => si.id === id) ?? null;
}

export function generateAndStoreFeedback(selfIntroId: string, job: JobDetail): FeedbackResult | null {
  const si = getSelfIntro(selfIntroId);
  if (!si) return null;
  const { strengths, improvements } = generateFeedback(si.content, job);
  const result: FeedbackResult = {
    selfIntroId,
    strengths,
    improvements,
    generatedAt: new Date().toISOString(),
  };
  return upsertRow(TABLE_KEYS.FEEDBACK_RESULTS, result, (r) => r.selfIntroId === selfIntroId);
}

export function getFeedback(selfIntroId: string): FeedbackResult | null {
  return getTable<FeedbackResult>(TABLE_KEYS.FEEDBACK_RESULTS).find((r) => r.selfIntroId === selfIntroId) ?? null;
}

/** 동의(shared_with_company=true)한 자소서만 반환하는 단일 관문. 실제 가입자 + 데모 시드 후보를 합쳐 반환한다. */
export function listCandidatesForCompany(companyProfile: CompanyProfile): CandidateSummary[] {
  const realShared = getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS).filter((si) => si.sharedWithCompany);

  const realCandidates: CandidateSummary[] = realShared.map((si) => {
    const profile = getJobseekerProfile(si.userId);
    const job = findJobById(si.jobId);
    const appliedToThisCompany = Boolean(
      companyProfile.wantedCompanyId &&
        job?.companyId === companyProfile.wantedCompanyId &&
        hasApplied(si.userId, si.jobId)
    );
    return {
      jobseekerId: si.userId,
      displayLabel: `지원자 ${si.userId.slice(-4).toUpperCase()}`,
      school: profile.school,
      major: profile.major,
      gpa: profile.gpa,
      gpaScale: profile.gpaScale,
      skillTagIds: profile.skillTagIds,
      careerHistory: profile.careerHistory,
      selfIntroId: si.id,
      jobId: si.jobId,
      appliedToThisCompany,
    };
  });

  // 기업 랜딩(4-2)을 혼자서도 데모할 수 있도록 시드된 가상 후보 — 실제 지원 여부는 데모 목적상
  // "이 후보가 실제로 이 공고에 지원했다"고 가정해 계산한다 (data/mockCandidates.ts 참고).
  const seededCandidates: CandidateSummary[] = MOCK_CANDIDATES.map((c) => {
    const job = findJobById(c.jobId);
    const appliedToThisCompany = Boolean(companyProfile.wantedCompanyId && job?.companyId === companyProfile.wantedCompanyId);
    return {
      jobseekerId: c.jobseekerId,
      displayLabel: c.displayLabel,
      school: c.school,
      major: c.major,
      gpa: c.gpa,
      gpaScale: c.gpaScale,
      skillTagIds: c.skillTagIds,
      careerHistory: c.careerHistory,
      selfIntroId: c.selfIntroId,
      jobId: c.jobId,
      appliedToThisCompany,
    };
  });

  return [...realCandidates, ...seededCandidates];
}

export function getCandidateSelfIntroContent(candidate: CandidateSummary): string {
  const real = getSelfIntro(candidate.selfIntroId);
  if (real) return real.content;
  const seeded = MOCK_CANDIDATES.find((c) => c.selfIntroId === candidate.selfIntroId);
  return seeded?.content ?? "";
}
