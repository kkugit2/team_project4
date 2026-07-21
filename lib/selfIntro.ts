// Backend-Guideline 6장: 자소서 제출/피드백/기업 노출 통제.
// listCandidatesForCompany가 shared_with_company 필터를 거는 유일한 관문이다 (동의 없는 노출 원천 차단).
import { TABLE_KEYS } from "./constants";
import { genId, getTable, insertRow, upsertRow } from "./localDb";
import { getJobseekerProfile } from "./profiles";
import { hasApplied } from "./applications";
import { generateFeedback } from "./mockLlm";

import { MOCK_CANDIDATES } from "@/data/dummyData";

import type { SelfIntro, FeedbackResult, JobDetail, CandidateSummary, CompanyProfile } from "@/types";

export async function submitSelfIntro(input: {
  userId: string;
  jobId: string;
  content: string;
  sharedWithCompany: boolean;
}): Promise<SelfIntro> {
  const selfIntro: SelfIntro = {
    id: genId("si"),
    userId: input.userId,
    jobId: input.jobId,
    content: input.content,
    submittedAt: new Date().toISOString(),
    sharedWithCompany: input.sharedWithCompany,
  };
  await insertRow(TABLE_KEYS.SELF_INTROS, selfIntro);
  return selfIntro;
}

export async function listSelfIntrosByUser(userId: string): Promise<SelfIntro[]> {
  const rows = await getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS);
  return rows
    .filter((si) => si.userId === userId)
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export async function listSelfIntrosForJob(jobId: string): Promise<SelfIntro[]> {
  const rows = await getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS);
  return rows.filter((si) => si.jobId === jobId);
}

export async function getSelfIntro(id: string): Promise<SelfIntro | null> {
  const rows = await getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS);
  return rows.find((si) => si.id === id) ?? null;
}

export async function generateAndStoreFeedback(selfIntroId: string, job: JobDetail): Promise<FeedbackResult | null> {
  const si = await getSelfIntro(selfIntroId);
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

export async function getFeedback(selfIntroId: string): Promise<FeedbackResult | null> {
  const rows = await getTable<FeedbackResult>(TABLE_KEYS.FEEDBACK_RESULTS);
  return rows.find((r) => r.selfIntroId === selfIntroId) ?? null;
}

/** 동의(shared_with_company=true)한 자소서만 반환하는 단일 관문. 실제 가입자 + 데모 시드 후보를 합쳐 반환한다. */
export async function listCandidatesForCompany(companyProfile: CompanyProfile): Promise<CandidateSummary[]> {
  const rows = await getTable<SelfIntro>(TABLE_KEYS.SELF_INTROS);
  const realShared = rows.filter((si) => si.sharedWithCompany);

  const realCandidates: CandidateSummary[] = await Promise.all(
    realShared.map(async (si) => {
      const profile = await getJobseekerProfile(si.userId);
      // TODO: wantedCompanyId 비교는 API 라우트에서 처리 (csvLoader는 서버 전용)
      const appliedToThisCompany = false;
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
    })
  );

  // 기업 랜딩(4-2)을 혼자서도 데모할 수 있도록 시드된 가상 후보 — 실제 지원 여부는 데모 목적상
  // "이 후보가 실제로 이 공고에 지원했다"고 가정해 계산한다 (data/mockCandidates.ts 참고).
  const seededCandidates: CandidateSummary[] = MOCK_CANDIDATES.map((c) => {
    // TODO: wantedCompanyId 비교는 API 라우트에서 처리
    const appliedToThisCompany = false;
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

export async function getCandidateSelfIntroContent(candidate: CandidateSummary): Promise<string> {
  const real = await getSelfIntro(candidate.selfIntroId);
  if (real) return real.content;
  const seeded = MOCK_CANDIDATES.find((c) => c.selfIntroId === candidate.selfIntroId);
  return seeded?.content ?? "";
}
