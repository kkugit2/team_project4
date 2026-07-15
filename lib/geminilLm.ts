"use server";

// GEMINI API를 사용한 실제 LLM 기반 자소서 분석
// 기존 mockLlm.ts를 대체하는 모듈

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { JobDetail } from "@/types";

export interface LlmFeedback {
  strengths: string[];
  improvements: string[];
}

// GEMINI API 초기화
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * GEMINI API를 사용해 자소서 피드백 생성
 * @param resumeText 자소서 원문
 * @param job 지원 공고 상세정보
 * @returns 강점과 개선점 배열
 */
export async function generateFeedback(
  resumeText: string,
  job: JobDetail
): Promise<LlmFeedback> {
  const trimmed = resumeText.trim();

  if (!trimmed) {
    return {
      strengths: [],
      improvements: ["자기소개서 내용을 입력하면 분석 결과를 확인할 수 있습니다."]
    };
  }

  try {
    // 프롬프트 구성
    const prompt = `당신은 채용 전문가입니다. 다음 자소서를 공고 요건과 비교해 분석해주세요.

【공고 정보】
- 직무: ${job.position}
- 회사: ${job.companyName}
- 직군: ${job.category}
- 주요 업무: ${job.mainTasks || "정보 없음"}
- 자격 요건: ${job.requirements || "정보 없음"}

【지원자 자소서】
${trimmed}

다음 JSON 형식으로 답변해주세요 (JSON만 반환, 다른 텍스트 없음):
{
  "strengths": [
    "강점 1 (한 문장, 50자 이내)",
    "강점 2",
    "강점 3"
  ],
  "improvements": [
    "개선점 1 (한 문장, 50자 이내)",
    "개선점 2",
    "개선점 3"
  ]
}

주의:
- 각 항목은 정확히 한국어 한 문장이어야 함
- 구체적이고 실행 가능한 조언만 포함
- 자소서 내용을 직접 인용하지 말 것
- 부정적인 표현 피할 것`;

    // GEMINI API 호출
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // JSON 파싱
    // GEMINI가 마크다운 코드블록으로 감싸서 반환할 수 있으므로 정제
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from GEMINI");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // 응답 검증
    const strengths = Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((s: any) => typeof s === "string").slice(0, 3)
      : [];

    const improvements = Array.isArray(parsed.improvements)
      ? parsed.improvements.filter((i: any) => typeof i === "string").slice(0, 3)
      : [];

    // 최소 1개씩은 있어야 함
    if (strengths.length === 0) {
      strengths.push("자기소개서가 등록되었습니다. 아래 보완할 점을 참고해 다듬어보세요.");
    }
    if (improvements.length === 0) {
      improvements.push("전반적으로 직무 요건에 잘 부합하는 자기소개서입니다.");
    }

    return { strengths, improvements };
  } catch (error) {
    console.error("GEMINI API Error:", error);

    // Fallback: 규칙 기반 분석으로 대체
    return generateFallbackFeedback(trimmed, job);
  }
}

/**
 * API 호출 실패 시 규칙 기반 분석으로 대체
 */
function generateFallbackFeedback(
  resumeText: string,
  job: JobDetail
): LlmFeedback {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const normText = resumeText.toLowerCase();
  const sentenceCount = (resumeText.match(/[.!?]/g) ?? []).length;

  // 강점 분석
  if (resumeText.length >= 400) {
    strengths.push("경험을 구체적인 분량으로 서술하고 있습니다.");
  }
  if (sentenceCount >= 6) {
    strengths.push("문장 구성이 다양해 가독성이 좋습니다.");
  }
  if (normText.includes("성과") || normText.includes("달성") || normText.includes("개선")) {
    strengths.push("구체적인 성과와 결과를 제시하고 있습니다.");
  }

  if (strengths.length === 0) {
    strengths.push("자기소개서가 등록되었습니다. 아래 보완할 점을 참고해 다듬어보세요.");
  }

  // 개선점 분석
  if (resumeText.length < 400) {
    improvements.push(`경험을 더 구체적으로 작성하면 좋습니다. (현재 ${resumeText.length}자)`);
  }
  if (sentenceCount < 4) {
    improvements.push("문장을 나누어 기승전결 구조로 정리하면 가독성이 좋아집니다.");
  }
  if (!normText.includes("왜") && !normText.includes("이유") && !normText.includes("목표")) {
    improvements.push("일한 이유나 목표를 명확히 드러내면 지원동기가 더 강해집니다.");
  }

  if (improvements.length === 0) {
    improvements.push("전반적으로 직무 요건에 잘 부합하는 자기소개서입니다.");
  }

  return { strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3) };
}
