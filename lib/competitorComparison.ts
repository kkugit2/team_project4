// Backend-Guideline 6-3: 경쟁자 비교분석 최소 표본 규칙. 순수 함수.
import { MIN_COMPARISON_SAMPLE } from "./constants";

export interface ComparisonOk {
  status: "ok";
  sampleSize: number;
  averageLength: number;
  lengthPercentile: number;
}

export interface ComparisonInsufficient {
  status: "insufficient_data";
  sampleSize: number;
}

export type ComparisonResult = ComparisonOk | ComparisonInsufficient;

/** otherContents: 같은 공고에 제출된 "본인을 제외한" 다른 자소서 본문들 */
export function compareToCompetitors(currentContent: string, otherContents: string[]): ComparisonResult {
  const sampleSize = otherContents.length;
  if (sampleSize < MIN_COMPARISON_SAMPLE) {
    return { status: "insufficient_data", sampleSize };
  }

  const lengths = otherContents.map((c) => c.trim().length);
  const averageLength = Math.round(lengths.reduce((sum, l) => sum + l, 0) / lengths.length);
  const currentLength = currentContent.trim().length;
  const below = lengths.filter((l) => l <= currentLength).length;
  const lengthPercentile = Math.round((below / lengths.length) * 100);

  return { status: "ok", sampleSize, averageLength, lengthPercentile };
}
