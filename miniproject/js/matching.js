// 자체 매칭 스코어 로직 (MVP, 0~100). LLM/외부 API 없이 즉시 계산.
// PRD_all.md 3절 "핵심 제약" B안 기준 — 화면에는 항상 "참고용" 임을 함께 표기할 것.

function norm(s) {
  return String(s || "").trim().toLowerCase();
}

function overlap(listA, listB) {
  const setB = new Set((listB || []).map(norm));
  const matched = (listA || []).filter((s) => setB.has(norm(s)));
  return matched;
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

/**
 * 구직자 → 공고 매칭 (공고 카드 배지 / 합격확률 참고용)
 * job: { annual_from, annual_to, skill_tags: [{title}], requirements, preferred_points }
 * profile: { career_years, skills: [], certifications: [] }
 */
export function computeJobMatchScore(profile, job) {
  if (!profile) return null;

  const careerYears = Number(profile.career_years) || 0;
  const from = job.annual_from ?? 0;
  const to = job.annual_to ?? null;

  let careerScore;
  if (careerYears >= from && (to == null || to === 0 || careerYears <= to)) {
    careerScore = 100;
  } else if (careerYears < from) {
    careerScore = clamp(100 - (from - careerYears) * 25);
  } else {
    careerScore = clamp(100 - (careerYears - to) * 15);
  }

  const jobSkillTitles = (job.skill_tags || []).map((t) => t.title).filter(Boolean);
  const matchedSkills = overlap(profile.skills, jobSkillTitles);
  const skillScore = jobSkillTitles.length
    ? clamp((matchedSkills.length / jobSkillTitles.length) * 100)
    : 70; // 공고에 스킬 태그가 없으면 중립값

  const reqText = norm((job.requirements || "") + " " + (job.preferred_points || ""));
  const certHits = (profile.certifications || []).filter((c) => c && reqText.includes(norm(c)));
  const certScore = (profile.certifications || []).length
    ? clamp((certHits.length / profile.certifications.length) * 100)
    : 50;

  const score = Math.round(careerScore * 0.45 + skillScore * 0.45 + certScore * 0.1);

  const missingSkills = jobSkillTitles.filter(
    (t) => !matchedSkills.some((m) => norm(m) === norm(t))
  );

  return {
    score: clamp(score),
    basis: {
      careerScore: Math.round(careerScore),
      skillScore: Math.round(skillScore),
      certScore: Math.round(certScore),
      matchedSkills,
      missingSkills,
    },
  };
}

/**
 * 기업 → 구직자 매칭 (인재 랭킹 / 인재상 부합도)
 * companyProfile: { preferred_gpa_min, preferred_skills, preferred_experience_type, internship_required }
 * profile: { gpa, gpa_scale, skills, career_history }
 */
export function computeCompanyMatchScore(profile, companyProfile) {
  if (!profile || !companyProfile) return null;

  const gpaScale = Number(profile.gpa_scale) || 4.5;
  const gpaNormalized = profile.gpa != null ? (Number(profile.gpa) / gpaScale) * 4.5 : null;
  const minGpa = companyProfile.preferred_gpa_min != null ? Number(companyProfile.preferred_gpa_min) : null;

  let gpaScore = 70;
  if (minGpa != null && gpaNormalized != null) {
    gpaScore = gpaNormalized >= minGpa ? 100 : clamp(100 - (minGpa - gpaNormalized) * 40);
  }

  const preferredSkills = companyProfile.preferred_skills || [];
  const matchedSkills = overlap(profile.skills, preferredSkills);
  const skillScore = preferredSkills.length
    ? clamp((matchedSkills.length / preferredSkills.length) * 100)
    : 70;

  const careerHistory = profile.career_history || [];
  const experienceTypes = careerHistory.map((c) => norm(c.type || c.role || ""));
  const preferredTypes = (companyProfile.preferred_experience_type || []).map(norm);
  const experienceScore = preferredTypes.length
    ? clamp(
        (preferredTypes.filter((t) => experienceTypes.some((e) => e.includes(t))).length /
          preferredTypes.length) *
          100
      )
    : 70;

  const hasInternship = careerHistory.some((c) => norm(c.type || c.role || "").includes("인턴"));
  const internshipScore = companyProfile.internship_required ? (hasInternship ? 100 : 20) : 100;

  const score = Math.round(
    gpaScore * 0.2 + skillScore * 0.4 + experienceScore * 0.2 + internshipScore * 0.2
  );

  return {
    score: clamp(score),
    basis: {
      gpaScore: Math.round(gpaScore),
      skillScore: Math.round(skillScore),
      experienceScore: Math.round(experienceScore),
      internshipScore: Math.round(internshipScore),
      matchedSkills,
    },
  };
}

export function gaugeTier(score) {
  if (score >= 70) return "navy";
  if (score >= 40) return "mid";
  return "warn";
}
