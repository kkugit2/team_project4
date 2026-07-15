"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { JobCard } from "@/components/job/JobCard";
import { JobFilterBar, type JobSort } from "@/components/job/JobFilterBar";
import { DisclaimerBanner } from "@/components/common/DisclaimerBanner";
import { getJobs } from "@/lib/wanted";
import { getJobseekerProfile, isJobseekerProfileComplete } from "@/lib/profiles";
import { computeJobseekerPassProbability } from "@/lib/matchScore";
import { hasApplied } from "@/lib/applications";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import type { Job, JobseekerProfile } from "@/types";

export default function HomePage() {
  const { session, isLoading: sessionLoading } = useSession();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<JobSort>("due");
  const [profile, setProfile] = useState<JobseekerProfile | null>(null);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  useEffect(() => {
    if (session?.role === "jobseeker") {
      setProfile(getJobseekerProfile(session.userId));
    } else {
      setProfile(null);
    }
  }, [session]);

  const isJobseeker = session?.role === "jobseeker";
  const profileReady = isJobseeker && profile !== null && isJobseekerProfileComplete(profile);

  const categories = useMemo(() => Array.from(new Set(jobs.map((j) => j.category))), [jobs]);

  const scored = useMemo(() => {
    return jobs.map((job) => {
      let passProbability: number | null = null;
      if (profileReady && profile) {
        // 공고 자체의 skill_tags를 "회사 선호 스킬"로 간주하는 간이 매칭(PRD 1-1 B안).
        // 등록 기업(4-2)의 완전한 인재상 매칭과 달리, 원티드 공고는 gpa/경험/인턴 요건이 없어 스킬만 비교한다.
        const { score } = computeJobseekerPassProbability(
          { gpa: profile.gpa, gpaScale: profile.gpaScale, skillTagIds: profile.skillTagIds, careerHistory: profile.careerHistory },
          { preferredGpaMin: null, preferredSkillTagIds: job.skillTagIds, preferredExperienceType: [], internshipRequired: false }
        );
        passProbability = score;
      }
      return { job, passProbability };
    });
  }, [jobs, profileReady, profile]);

  const filtered = useMemo(() => {
    let list = category ? scored.filter((s) => s.job.category === category) : scored;
    list = [...list].sort((a, b) => {
      if (sort === "score") return (b.passProbability ?? -1) - (a.passProbability ?? -1);
      if (!a.job.dueTime) return 1;
      if (!b.job.dueTime) return -1;
      return a.job.dueTime < b.job.dueTime ? -1 : 1;
    });
    return list;
  }, [scored, category, sort]);

  const handleToggleBookmark = (jobId: string) => {
    if (!session) {
      showToast("로그인 후 이용할 수 있습니다");
      return;
    }
    const bookmarked = toggleBookmark(session.userId, jobId);
    showToast(bookmarked ? "찜 목록에 추가했습니다" : "찜 목록에서 제거했습니다");
    forceRerender((n) => n + 1);
  };

  if (sessionLoading) return <main className="page" />;

  return (
    <main className="page">
      <div className="page-header">
        <h1>채용 공고</h1>
        <p>회사명, 직군, 합격확률, 연봉 정보를 한눈에 확인하세요.</p>
      </div>

      {!session && (
        <DisclaimerBanner>
          로그인하면 합격확률, 지원현황, 찜 목록을 확인할 수 있어요. <Link href="/login">로그인하러 가기 →</Link>
        </DisclaimerBanner>
      )}
      {isJobseeker && !profileReady && (
        <DisclaimerBanner>
          마이페이지에서 학점·기술스택 등 경력 정보를 입력하면 합격확률을 볼 수 있어요.{" "}
          <Link href="/mypage">마이페이지로 이동 →</Link>
        </DisclaimerBanner>
      )}

      <JobFilterBar
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        showScoreSort={profileReady}
      />

      <div className="job-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {filtered.map(({ job, passProbability }) => (
          <JobCard
            key={job.id}
            job={job}
            passProbability={passProbability}
            applied={session ? hasApplied(session.userId, job.id) : false}
            bookmarked={session ? isBookmarked(session.userId, job.id) : false}
            onToggleBookmark={isJobseeker ? () => handleToggleBookmark(job.id) : undefined}
          />
        ))}
      </div>
    </main>
  );
}
