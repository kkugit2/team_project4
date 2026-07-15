"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/nav/AuthGuard";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { EmptyState } from "@/components/common/EmptyState";
import { CompanyProfileForm } from "@/components/profile/CompanyProfileForm";
import { SentScoutList } from "@/components/scout/SentScoutList";
import { getCompanyProfile, updateCompanyProfile } from "@/lib/profiles";
import { getTags } from "@/lib/tags";
import { listViewed } from "@/lib/viewedCandidates";
import { listSentScouts, remainingMonthlyQuota } from "@/lib/scouts";
import type { CompanyProfile, Scout, Tag, ViewedCandidate } from "@/types";
import { formatDateTime } from "@/lib/format";

function CompanyMyPageContent() {
  const { session } = useSession();
  const { showToast } = useToast();
  const companyId = session!.userId;

  const [profile, setProfile] = useState<CompanyProfile>(() => getCompanyProfile(companyId));
  const [skillTags, setSkillTags] = useState<Tag[]>([]);
  const [viewed, setViewed] = useState<ViewedCandidate[]>([]);
  const [sentScouts, setSentScouts] = useState<Scout[]>([]);
  const [remainingQuota, setRemainingQuota] = useState(0);

  useEffect(() => {
    getTags("skill").then(setSkillTags);
    setViewed(listViewed(companyId));
    setSentScouts(listSentScouts(companyId));
    setRemainingQuota(remainingMonthlyQuota(companyId));
  }, [companyId]);

  const saveProfile = () => {
    updateCompanyProfile(profile);
    showToast("인재상 정보가 저장되었습니다");
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>기업 마이페이지</h1>
        <p>인재상 정보를 관리하고 열람/스카웃 이력을 확인하세요.</p>
      </div>

      <div className="section-card">
        <h3>인재상 프로필</h3>
        <CompanyProfileForm value={profile} onChange={setProfile} skillTags={skillTags} />
        <button type="button" className="btn btn-company" onClick={saveProfile}>
          저장
        </button>
      </div>

      <div className="section-card">
        <h3>확인한 지원자 로그</h3>
        {viewed.length === 0 ? (
          <EmptyState message="아직 열람한 지원자가 없습니다." />
        ) : (
          <div className="list">
            {viewed.map((v) => (
              <div key={`${v.companyId}-${v.jobseekerId}`} className="row-card">
                <div className="row-info">
                  <div>
                    <h3>지원자 {v.jobseekerId.slice(-4).toUpperCase()}</h3>
                    <p>열람일 {formatDateTime(v.viewedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-card">
        <h3>스카웃 발송 내역</h3>
        <p className="hint">최근 30일간 남은 발송 가능 건수: {remainingQuota}건</p>
        {sentScouts.length === 0 ? (
          <EmptyState message="아직 발송한 스카웃이 없습니다." />
        ) : (
          <SentScoutList scouts={sentScouts} />
        )}
      </div>
    </main>
  );
}

export default function CompanyMyPage() {
  return (
    <AuthGuard requiredRole="company">
      <CompanyMyPageContent />
    </AuthGuard>
  );
}
