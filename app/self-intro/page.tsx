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
    const selfIntro = submitSelfIntro({ userId: session.userId, jobId, content, sharedWithCompany: consent });

    // API 라우트를 통해 GEMINI 피드백 생성
    try {
      const response = await fetch("/api/self-intro/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: content, job }),
      });

      if (response.ok) {
        const apiData = await response.json();
        // API에서 받은 피드백 (strengths, improvements)
        const geminiResult = apiData.data;
        if (geminiResult && geminiResult.strengths && geminiResult.improvements) {
          // localStorage에 저장
          const storedFeedback = await generateAndStoreFeedback(selfIntro.id, geminiResult.strengths, geminiResult.improvements);
          setFeedback(storedFeedback ?? getFeedback(selfIntro.id));
        } else {
          showToast("피드백 형식이 올바르지 않습니다");
        }
      } else {
        showToast("피드백 생성에 실패했습니다");
      }
    } catch (error) {
      console.error("Feedback API error:", error);
      showToast("피드백 생성 중 오류가 발생했습니다");
    }

    const others = listSelfIntrosForJob(jobId)
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
