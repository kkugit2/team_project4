// 실제 LLM 연동 전까지 사용하는 더미 분석 로직. generateFeedback의 입출력 형태(Backend-Guideline 6-2:
// { strengths: [], improvements: [] })만 유지하면 내부 구현을 Claude API 호출로 그대로 교체할 수 있다.
import type { JobDetail } from "@/types";

import { findTagsByIds } from "@/data/dummyData";


export interface LlmFeedback {
  strengths: string[];
  improvements: string[];
}

function extractJobKeywords(job: JobDetail): string[] {
  return findTagsByIds(job.skillTagIds).map((t) => t.title);
}

export function generateFeedback(resumeText: string, job: JobDetail): LlmFeedback {
  const trimmed = resumeText.trim();
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (!trimmed) {
    improvements.push("자기소개서 내용을 입력하면 분석 결과를 확인할 수 있습니다.");
    return { strengths, improvements };
  }

  const keywords = extractJobKeywords(job);
  const normText = trimmed.toLowerCase();
  const hitKeywords = keywords.filter((k) => normText.includes(k.toLowerCase()));
  const missingKeywords = keywords.filter((k) => !hitKeywords.includes(k));
  const sentenceCount = (trimmed.match(/[.!?]/g) ?? []).length;

  if (hitKeywords.length > 0) {
    strengths.push(`이 공고의 핵심 키워드(${hitKeywords.slice(0, 3).join(", ")})를 잘 반영하고 있습니다.`);
  }
  if (trimmed.length >= 400) {
    strengths.push("경험을 구체적인 분량으로 서술하고 있습니다.");
  }
  if (sentenceCount >= 6) {
    strengths.push("문장 구성이 다양해 가독성이 좋습니다.");
  }
  if (strengths.length === 0) {
    strengths.push("자기소개서가 등록되었습니다. 아래 보완할 점을 참고해 다듬어보세요.");
  }

  if (missingKeywords.length > 0) {
    improvements.push(`이 공고의 요구 스킬 중 "${missingKeywords.slice(0, 3).join(", ")}"와 관련된 경험을 보완하면 좋습니다.`);
  }
  if (trimmed.length < 400) {
    improvements.push(`경험을 더 구체적인 사례와 수치로 보완하면 좋습니다. (현재 ${trimmed.length}자)`);
  }
  if (sentenceCount < 4) {
    improvements.push("문장을 나누어 기승전결 구조로 정리하면 가독성이 좋아집니다.");
  }
  if (improvements.length === 0) {
    improvements.push("전반적으로 직무 요건에 잘 부합하는 자기소개서입니다.");
  }

  return { strengths, improvements };
}
