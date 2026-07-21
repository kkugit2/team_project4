"use client";

import { useEffect, useState, useCallback } from "react";
import { AuthGuard } from "@/components/nav/AuthGuard";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { EmptyState } from "@/components/common/EmptyState";
import { JobseekerProfileForm } from "@/components/profile/JobseekerProfileForm";
import { ApplicationListItem } from "@/components/applications/ApplicationListItem";
import { BookmarkListItem } from "@/components/bookmarks/BookmarkListItem";
import { ScoutInboxItem } from "@/components/scout/ScoutInboxItem";
import { getJobseekerProfile, updateJobseekerProfile } from "@/lib/profiles";
import { getTags } from "@/lib/tags";
import { getJob } from "@/lib/wanted";
import { listApplications, updateApplicationStatus, removeApplication } from "@/lib/applications";
import { listBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { listReceivedScouts, respondToScout } from "@/lib/scouts";
import { isAppError } from "@/lib/errors";
import type { Application, Bookmark, Job, JobseekerProfile, Scout, Tag, ApplicationStatus } from "@/types";

function MyPageContent() {
  const { session } = useSession();
  const { showToast } = useToast();
  const userId = session!.userId;

  const [profile, setProfile] = useState<JobseekerProfile | null>(null);
  const [skillTags, setSkillTags] = useState<Tag[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [jobsById, setJobsById] = useState<Record<string, Job>>({});

  const reload = useCallback(async () => {
    const apps = await listApplications(userId);
    const marks = await listBookmarks(userId);
    setApplications(apps);
    setBookmarks(marks);
    const scoutData = await listReceivedScouts(userId);
    setScouts(scoutData);

    const ids = Array.from(new Set([...apps.map((a) => a.jobId), ...marks.map((b) => b.jobId)]));
    const jobs = await Promise.all(ids.map((id) => getJob(id)));
    const map: Record<string, Job> = {};
    jobs.forEach((j) => {
      if (j) map[j.id] = j;
    });
    setJobsById(map);
  }, [userId]);

  useEffect(() => {
    (async () => {
      const prof = await getJobseekerProfile(userId);
      setProfile(prof);
    })();
    getTags("skill").then(setSkillTags);
    reload();
  }, [reload, userId]);

  const saveProfile = async () => {
    if (profile) {
      await updateJobseekerProfile(profile);
      showToast("프로필이 저장되었습니다");
    }
  };

  const handleStatusChange = async (jobId: string, status: ApplicationStatus) => {
    await updateApplicationStatus(userId, jobId, status);
    await reload();
    showToast("지원 상태를 변경했습니다");
  };

  const handleRemoveApplication = async (jobId: string) => {
    await removeApplication(userId, jobId);
    await reload();
    showToast("지원현황에서 삭제했습니다");
  };

  const handleRemoveBookmark = async (jobId: string) => {
    await toggleBookmark(userId, jobId);
    await reload();
    showToast("찜 목록에서 제거했습니다");
  };

  const handleRespondScout = async (scoutId: string, action: "accepted" | "rejected") => {
    const result = await respondToScout(scoutId, action);
    if (isAppError(result)) {
      showToast(result.error.message);
      return;
    }
    await reload();
    showToast(action === "accepted" ? "스카웃을 수락했습니다" : "스카웃을 거절했습니다");
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>마이페이지</h1>
        <p>내 프로필, 지원현황, 찜 목록, 스카웃 제안을 관리하세요.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>
        <div className="section-card">
          <h3>프로필 요약 · 수정</h3>
          {profile && (
            <>
              <JobseekerProfileForm value={profile} onChange={setProfile} skillTags={skillTags} />
              <button type="button" className="btn btn-primary" onClick={saveProfile} style={{ width: "100%" }}>
                저장
              </button>
            </>
          )}
        </div>

        <div>
          <div className="section-card">
            <h3>나의 지원현황</h3>
            {applications.length === 0 ? (
              <EmptyState message="아직 지원한 공고가 없습니다." linkHref="/jobs" linkLabel="채용 공고 보러가기" />
            ) : (
              <div className="list">
                {applications.map((app) => {
                  const job = jobsById[app.jobId];
                  if (!job) return null;
                  return (
                    <ApplicationListItem
                      key={app.jobId}
                      application={app}
                      job={job}
                      onStatusChange={(status) => handleStatusChange(app.jobId, status)}
                      onRemove={() => handleRemoveApplication(app.jobId)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-card">
            <h3>찜 목록</h3>
            {bookmarks.length === 0 ? (
              <EmptyState message="찜한 공고가 없습니다." linkHref="/jobs" linkLabel="채용 공고 보러가기" />
            ) : (
              <div className="list">
                {bookmarks.map((b) => {
                  const job = jobsById[b.jobId];
                  if (!job) return null;
                  return (
                    <BookmarkListItem
                      key={b.jobId}
                      job={job}
                      applied={applications.some((a) => a.jobId === b.jobId)}
                      onRemove={() => handleRemoveBookmark(b.jobId)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-card">
            <h3>스카웃함</h3>
            {scouts.length === 0 ? (
              <EmptyState message="받은 스카웃 제안이 없습니다." />
            ) : (
              <div className="list">
                {scouts.map((s) => (
                  <ScoutInboxItem key={s.id} scout={s} onRespond={(action) => handleRespondScout(s.id, action)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MyPage() {
  return (
    <AuthGuard requiredRole="jobseeker">
      <MyPageContent />
    </AuthGuard>
  );
}
