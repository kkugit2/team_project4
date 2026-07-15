"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import type { CandidateSummary, CompanyProfile, Scout } from "@/types";

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
        fitScore: computeCandidateFitScore(
          { gpa: candidate.gpa, gpaScale: candidate.gpaScale, skillTagIds: candidate.skillTagIds, careerHistory: candidate.careerHistory },
          {
            preferredGpaMin: companyProfile.preferredGpaMin,
            preferredSkillTagIds: companyProfile.preferredSkillTagIds,
            preferredExperienceType: companyProfile.preferredExperienceType,
            internshipRequired: companyProfile.internshipRequired,
          }
        ).score,
      }))
      .sort((a, b) => b.fitScore - a.fitScore);
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
        <h1>지원자 발굴</h1>
        <p>인재상 정보 제공에 동의한 지원자를 부합도 순으로 확인하고 스카웃을 제안하세요.</p>
      </div>

      {ranked.length === 0 ? (
        <EmptyState message="아직 정보 제공에 동의한 지원자가 없습니다." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {ranked.map(({ candidate, fitScore }) => (
            <CandidateCard
              key={candidate.selfIntroId}
              candidate={candidate}
              fitScore={fitScore}
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
