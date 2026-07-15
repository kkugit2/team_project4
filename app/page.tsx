"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/nav/SessionProvider";
import { DisclaimerBanner } from "@/components/common/DisclaimerBanner";
import { JobseekerStatsHome } from "@/components/home/JobseekerStatsHome";
import { getJobseekerProfile, isJobseekerProfileComplete } from "@/lib/profiles";
import { getJobs } from "@/lib/wanted";
import { computeProfileInsights, type ProfileInsights } from "@/lib/profileInsights";
import { MOCK_CANDIDATES } from "@/data/mockCandidates";

function JobseekerHome({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<ProfileInsights | null>(null);
  const [profileComplete, setProfileComplete] = useState(true);

  useEffect(() => {
    const profile = getJobseekerProfile(userId);
    setProfileComplete(isJobseekerProfileComplete(profile));
    getJobs().then((jobs) => {
      setInsights(computeProfileInsights(profile, jobs, MOCK_CANDIDATES));
    });
  }, [userId]);

  return (
    <main className="page">
      <div className="page-header">
        <h1>나의 시장 위치</h1>
        <p>내 프로필을 기준으로 지금 어디쯤 있는지, 무엇을 보완하면 좋을지 확인하세요.</p>
      </div>
      {!profileComplete && (
        <DisclaimerBanner>
          마이페이지에서 학점·기술스택 등 경력 정보를 입력하면 더 정확한 분석을 볼 수 있어요.{" "}
          <Link href="/mypage">마이페이지로 이동 →</Link>
        </DisclaimerBanner>
      )}
      {insights && <JobseekerStatsHome insights={insights} />}
    </main>
  );
}

function AnonymousLanding() {
  return (
    <main className="page">
      <div className="page-header">
        <h1>합격 가능성 진단부터 스카웃까지</h1>
        <p>
          원티드 채용공고 데이터를 기반으로, 구직자에게는 합격 가능성 진단과 자기계발 방향을, 기업에게는 인재상에
          맞는 지원자 발굴과 스카웃 채널을 제공합니다.
        </p>
      </div>
      <div className="section-card">
        <h3>지금 시작하세요</h3>
        <p style={{ marginBottom: 16 }}>로그인하면 나의 합격 가능성과 스카웃 제안을 확인할 수 있어요.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login" className="btn btn-primary">
            로그인
          </Link>
          <Link href="/signup" className="btn btn-outline">
            회원가입
          </Link>
          <Link href="/jobs" className="btn btn-outline">
            공고 둘러보기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.role === "company") {
      router.replace("/company");
    }
  }, [session, router]);

  if (isLoading || session?.role === "company") return <main className="page" />;

  if (session?.role === "jobseeker") return <JobseekerHome userId={session.userId} />;

  return <AnonymousLanding />;
}
