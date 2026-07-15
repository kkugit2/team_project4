"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { JobDetailSections } from "@/components/job/JobDetailSections";
import { ApplyButton } from "@/components/job/ApplyButton";
import { EmptyState } from "@/components/common/EmptyState";
import { getJob, getCompany } from "@/lib/wanted";
import { getJobseekerProfile, isJobseekerProfileComplete } from "@/lib/profiles";
import { computeJobseekerPassProbability } from "@/lib/matchScore";
import { getApplication } from "@/lib/applications";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import type { JobDetail, Company, Application, MatchScoreResult } from "@/types";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { session } = useSession();
  const { showToast } = useToast();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchScoreResult | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    getJob(id).then((j) => {
      if (!j) {
        setNotFound(true);
        return;
      }
      setJob(j);
      getCompany(j.companyId).then(setCompany);
    });
  }, [id]);

  useEffect(() => {
    if (!job || !session) return;
    if (session.role === "jobseeker") {
      const profile = getJobseekerProfile(session.userId);
      if (isJobseekerProfileComplete(profile)) {
        const result = computeJobseekerPassProbability(
          { gpa: profile.gpa, gpaScale: profile.gpaScale, skillTagIds: profile.skillTagIds, careerHistory: profile.careerHistory },
          { preferredGpaMin: null, preferredSkillTagIds: job.skillTagIds, preferredExperienceType: [], internshipRequired: false }
        );
        setMatchResult(result);
      }
      setApplication(getApplication(session.userId, job.id));
      setBookmarked(isBookmarked(session.userId, job.id));
    }
  }, [job, session]);

  if (notFound) {
    return (
      <main className="page">
        <EmptyState message="존재하지 않는 공고입니다." linkHref="/jobs" linkLabel="목록으로 돌아가기" />
      </main>
    );
  }

  if (!job) return <main className="page" />;

  const isJobseeker = session?.role === "jobseeker";

  const handleToggleBookmark = () => {
    if (!session) {
      showToast("로그인 후 이용할 수 있습니다");
      return;
    }
    setBookmarked(toggleBookmark(session.userId, job.id));
    showToast(bookmarked ? "찜 목록에서 제거했습니다" : "찜 목록에 추가했습니다");
  };

  return (
    <main className="page">
      <Link href="/jobs" style={{ display: "inline-block", marginBottom: 16, color: "var(--text-muted)", fontSize: 14 }}>
        ← 목록으로
      </Link>

      <JobDetailSections
        job={job}
        company={company}
        matchResult={matchResult}
        actionSlot={
          <>
            {isJobseeker && (
              <ApplyButton
                applyUrl={job.applyUrl}
                jobId={job.id}
                userId={session?.userId ?? null}
                application={application}
                onApplied={() => setApplication(getApplication(session!.userId, job.id))}
              />
            )}
            {isJobseeker && (
              <button type="button" className={`btn btn-outline ${bookmarked ? "active" : ""}`} onClick={handleToggleBookmark}>
                {bookmarked ? "★ 찜 완료" : "☆ 찜하기"}
              </button>
            )}
            {isJobseeker && (
              <Link className="btn btn-outline" href={`/self-intro?jobId=${job.id}`}>
                자기소개서 분석
              </Link>
            )}
          </>
        }
      />
    </main>
  );
}
