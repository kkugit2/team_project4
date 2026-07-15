"use client";

import type { Job } from "@/types";

export function SelfIntroForm({
  jobs,
  jobId,
  onJobIdChange,
  content,
  onContentChange,
  consent,
  onConsentChange,
  onSubmit,
}: {
  jobs: Job[];
  jobId: string;
  onJobIdChange: (id: string) => void;
  content: string;
  onContentChange: (v: string) => void;
  consent: boolean;
  onConsentChange: (v: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="section-card">
      <h3>자기소개서 분석</h3>
      <div className="field">
        <label>목표 공고</label>
        <select value={jobId} onChange={(e) => onJobIdChange(e.target.value)}>
          <option value="">공고를 선택하세요</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.companyName} · {j.position}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>자기소개서</label>
        <textarea
          rows={10}
          placeholder="자기소개서를 입력하세요."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>
      <div className="field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={consent} onChange={(e) => onConsentChange(e.target.checked)} />
          이 자기소개서 요약이 해당 기업의 인재상 매칭에 활용되는 것에 동의합니다. (선택)
        </label>
        <p className="hint">동의하지 않으면 기업 화면에는 절대 노출되지 않습니다.</p>
      </div>
      <button type="button" className="btn btn-primary" disabled={!jobId || !content.trim()} onClick={onSubmit}>
        분석하기
      </button>
    </div>
  );
}
