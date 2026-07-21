"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/nav/AuthGuard";
import { useSession } from "@/components/nav/SessionProvider";
import { useToast } from "@/components/common/Toast";
import { SelfIntroForm } from "@/components/selfIntro/SelfIntroForm";
import { FeedbackResult } from "@/components/selfIntro/FeedbackResult";
import { getJobs, getJob } from "@/lib/wanted";
import {
  submitSelfIntro,
  generateAndStoreFeedback,
  getFeedback,
  listSelfIntrosForJob,
} from "@/lib/selfIntro";
import { compareToCompetitors, type ComparisonResult } from "@/lib/competitorComparison";
import type { Job, FeedbackResult as FeedbackResultType } from "@/types";

function SelfIntroPageContent() {
  const { session } = useSession();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState(searchParams.get("jobId") ?? "");
  const [content, setContent] = useState("");
  const [consent, setConsent] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResultType | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const handleSubmit = async () => {
    if (!session || !jobId || !content.trim()) return;
    const job = await getJob(jobId);
    if (!job) {
      showToast("공고 정보를 불러올 수 없습니다");
      return;
    }
    const selfIntro = await submitSelfIntro({ userId: session.userId, jobId, content, sharedWithCompany: consent });
    const result = await generateAndStoreFeedback(selfIntro.id, job);
    const feedback = result ?? (await getFeedback(selfIntro.id));
    setFeedback(feedback);

    const allIntros = await listSelfIntrosForJob(jobId);
    const others = allIntros
      .filter((si) => si.id !== selfIntro.id)
      .map((si) => si.content);
    setComparison(compareToCompetitors(content, others));

    showToast("자기소개서 분석이 완료되었습니다");
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>지원서 작성 후 피드백</h1>
        <p>자기소개서를 입력하면 목표 공고 대비 강약점과 경쟁자 비교 피드백을 제공합니다.</p>
      </div>

      <SelfIntroForm
        jobs={jobs}
        jobId={jobId}
        onJobIdChange={setJobId}
        content={content}
        onContentChange={setContent}
        consent={consent}
        onConsentChange={setConsent}
        onSubmit={handleSubmit}
      />

      {feedback && comparison && <FeedbackResult content={content} feedback={feedback} comparison={comparison} />}
    </main>
  );
}

export default function SelfIntroPage() {
  return (
    <AuthGuard requiredRole="jobseeker">
      <Suspense fallback={<main className="page" />}>
        <SelfIntroPageContent />
      </Suspense>
    </AuthGuard>
  );
}
