// 자소서 분석 (규칙 기반, LLM 미사용) — 자소서 텍스트와 공고 요건을 키워드 비교
// 인터페이스를 analyzeResume(resumeText, job) 형태로 고정해두면 추후 LLM/Edge Function 호출로 교체 가능

export function analyzeResume(resumeText, job) {
  const text = String(resumeText || "");
  const lower = text.toLowerCase();

  const jobSkills = (job.skill_tags || []).map((t) => t.title).filter(Boolean);
  const mentioned = jobSkills.filter((s) => lower.includes(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !mentioned.includes(s));

  const strengths = [];
  const improvements = [];

  if (mentioned.length) {
    strengths.push(`${mentioned.join(", ")} 관련 경험이 자소서에 드러나 있어요 — 공고 요건과 잘 맞아요.`);
  }

  const achievementSignals = ["%", "달성", "개선", "성과", "출시", "구축", "리드", "주도"];
  const hasAchievement = achievementSignals.some((k) => text.includes(k));
  if (hasAchievement) {
    strengths.push("정량적인 성과나 구체적인 결과가 언급되어 설득력이 있어요.");
  }

  if (text.length >= 300) {
    strengths.push("충분한 분량으로 경험을 구체적으로 설명하고 있어요.");
  }

  if (!strengths.length) {
    strengths.push("아직 뚜렷한 강점을 찾기 어려워요 — 구체적인 프로젝트 경험을 추가해보세요.");
  }

  if (missing.length) {
    improvements.push(`${missing.slice(0, 3).join(", ")}에 대한 경험을 추가하면 이 공고와의 연결점이 더 명확해져요.`);
  }
  if (!hasAchievement) {
    improvements.push("구체적인 수치나 성과를 함께 적으면 신뢰도가 올라가요.");
  }
  if (text.length < 300) {
    improvements.push("분량이 다소 짧아요 — 구체적인 사례를 더 추가하면 좋아요.");
  }
  if (!improvements.length) {
    improvements.push("현재 기준으로는 뚜렷한 보완점이 보이지 않아요.");
  }

  return { strengths, improvements, mentionedSkills: mentioned, missingSkills: missing };
}
