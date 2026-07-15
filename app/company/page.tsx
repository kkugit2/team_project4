"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/nav/AuthGuard";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { EmptyState } from "@/components/common/EmptyState";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import { getCompanyProfile } from "@/lib/profiles";
import { listCandidatesForCompany, getCandidateSelfIntroContent } from "@/lib/selfIntro";
import { computeCandidateFitScore } from "@/lib/matchScore";
import { sendScout, listSentScouts, remainingMonthlyQuota } from "@/lib/scouts";
import { recordView } from "@/lib/viewedCandidates";
import { isAppError } from "@/lib/errors";
import { findTagsByIds } from "@/data/mockTags";
import type { CandidateSummary, CompanyProfile, Scout } from "@/types";

function ConditionSummary({ profile }: { profile: CompanyProfile }) {
  const skillChips = findTagsByIds(profile.preferredSkillTagIds);
  const hasAnyCondition =
    skillChips.length > 0 || profile.preferredExperienceType.length > 0 || profile.preferredGpaMin !== null || profile.internshipRequired;

  return (
    <div className="section-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>등록된 채용 조건</h3>
        <Link href="/company/mypage" className="btn btn-outline">
          채용 조건 수정
        </Link>
      </div>
      {!hasAnyCondition ? (
        <p className="hint" style={{ margin: 0 }}>
          아직 등록된 인재상 조건이 없어요. 채용 조건을 등록하면 지원자 랭킹을 확인할 수 있어요.
        </p>
      ) : (
        <div>
          {profile.preferredGpaMin !== null && <span className="chip">학점 {profile.preferredGpaMin} 이상</span>}
          {skillChips.map((tag) => (
            <span key={tag.id} className="chip">
              {tag.title}
            </span>
          ))}
          {profile.preferredExperienceType.map((type) => (
            <span key={type} className="chip">
              {type} 경험
            </span>
          ))}
          {profile.internshipRequired && <span className="chip">인턴십 경험 필수</span>}
        </div>
      )}
    </div>
  );
}

function CompanyLandingContent() {
  const { session } = useSession();
  const { showToast } = useToast();
  const companyId = session!.userId;

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [sentScouts, setSentScouts] = useState<Scout[]>([]);
  const [remainingQuota, setRemainingQuota] = useState(0);

  const reload = useCallback(() => {
    const profile = getCompanyProfile(companyId);
    setCompanyProfile(profile);
    setCandidates(listCandidatesForCompany(profile));
    setSentScouts(listSentScouts(companyId));
    setRemainingQuota(remainingMonthlyQuota(companyId));
  }, [companyId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const sentJobseekerIds = useMemo(() => new Set(sentScouts.map((s) => s.jobseekerId)), [sentScouts]);

  const ranked = useMemo(() => {
    if (!companyProfile) return [];
    return candidates
      .map((candidate) => ({
        candidate,
        matchResult: computeCandidateFitScore(
          { gpa: candidate.gpa, gpaScale: candidate.gpaScale, skillTagIds: candidate.skillTagIds, careerHistory: candidate.careerHistory },
          {
            preferredGpaMin: companyProfile.preferredGpaMin,
            preferredSkillTagIds: companyProfile.preferredSkillTagIds,
            preferredExperienceType: companyProfile.preferredExperienceType,
            internshipRequired: companyProfile.internshipRequired,
          }
        ),
      }))
      .sort((a, b) => b.matchResult.score - a.matchResult.score);
  }, [candidates, companyProfile]);

  const handleSendScout = (jobseekerId: string, message: string) => {
    if (!companyProfile) return;
    const result = sendScout(companyId, companyProfile.companyName, jobseekerId, message);
    if (isAppError(result)) {
      showToast(result.error.message);
      return;
    }
    showToast("스카웃을 발송했습니다");
    reload();
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>인재 랭킹</h1>
        <p>인재상 정보 제공에 동의한 지원자를 부합도 순으로 확인하고 스카웃을 제안하세요.</p>
      </div>

      {companyProfile && <ConditionSummary profile={companyProfile} />}

      {ranked.length === 0 ? (
        <EmptyState message="아직 정보 제공에 동의한 지원자가 없습니다." />
      ) : (
        <div className="list">
          {ranked.map(({ candidate, matchResult }, index) => (
            <CandidateCard
              key={candidate.selfIntroId}
              rank={index + 1}
              candidate={candidate}
              matchResult={matchResult}
              content={getCandidateSelfIntroContent(candidate)}
              alreadySent={sentJobseekerIds.has(candidate.jobseekerId)}
              remainingQuota={remainingQuota}
              onView={() => recordView(companyId, candidate.jobseekerId)}
              onSendScout={(message) => handleSendScout(candidate.jobseekerId, message)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function CompanyLandingPage() {
  return (
    <AuthGuard requiredRole="company">
      <CompanyLandingContent />
    </AuthGuard>
  );
}
