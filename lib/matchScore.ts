// Backend-Guideline 5장 매칭 스코어(충족률) 계산. 순수 함수 — I/O 없음, 서버로 그대로 이식 가능.
import { MATCH_WEIGHTS } from "./constants";
import type { JobseekerProfile, CompanyProfile, MatchBasis, MatchScoreResult } from "@/types";

type JobseekerScoringInput = Pick<JobseekerProfile, "gpa" | "gpaScale" | "skillTagIds" | "careerHistory">;
type CompanyScoringInput = Pick<
  CompanyProfile,
  "preferredGpaMin" | "preferredSkillTagIds" | "preferredExperienceType" | "internshipRequired"
>;

/** 회사의 preferred_gpa_min은 4.5만점 스케일로 입력된다고 가정한다 (구직자 gpa_scale과의 정규화 비교 기준). */
const COMPANY_GPA_REFERENCE_SCALE = 4.5;

export function computeMatchScore(
  jobseeker: JobseekerScoringInput,
  companyPrefs: CompanyScoringInput
): MatchScoreResult {
  const gpaApplicable = companyPrefs.preferredGpaMin !== null;
  const gpaMet =
    gpaApplicable && jobseeker.gpa !== null && jobseeker.gpaScale > 0
      ? jobseeker.gpa / jobseeker.gpaScale >= companyPrefs.preferredGpaMin! / COMPANY_GPA_REFERENCE_SCALE
      : false;

  const matchedSkillIds = jobseeker.skillTagIds.filter((id) => companyPrefs.preferredSkillTagIds.includes(id));
  const skillsApplicable = companyPrefs.preferredSkillTagIds.length > 0;
  const skillsMet = skillsApplicable && matchedSkillIds.length > 0;

  const experienceApplicable = companyPrefs.preferredExperienceType.length > 0;
  const experienceMet =
    experienceApplicable &&
    jobseeker.careerHistory.some((entry) =>
      companyPrefs.preferredExperienceType.some(
        (type) =>
          entry.role.toLowerCase().includes(type.toLowerCase()) ||
          entry.company.toLowerCase().includes(type.toLowerCase())
      )
    );

  const internshipApplicable = companyPrefs.internshipRequired;
  const internshipMet = internshipApplicable && jobseeker.careerHistory.some((e) => e.isInternship);

  const basis: MatchBasis = {
    gpa: { applicable: gpaApplicable, met: gpaMet, weight: MATCH_WEIGHTS.gpa },
    skills: { applicable: skillsApplicable, met: skillsMet, weight: MATCH_WEIGHTS.skills, matchedSkillIds },
    experience: { applicable: experienceApplicable, met: experienceMet, weight: MATCH_WEIGHTS.experience },
    internship: { applicable: internshipApplicable, met: internshipMet, weight: MATCH_WEIGHTS.internship },
  };

  const applicableWeight = [basis.gpa, basis.skills, basis.experience, basis.internship].reduce(
    (sum, b) => sum + (b.applicable ? b.weight : 0),
    0
  );
  const metWeight = [basis.gpa, basis.skills, basis.experience, basis.internship].reduce(
    (sum, b) => sum + (b.applicable && b.met ? b.weight : 0),
    0
  );

  const score = applicableWeight > 0 ? Math.round((metWeight / applicableWeight) * 100) : 0;
  return { score, basis };
}

/** 구직자 관점: "이 공고(기업)에 내가 합격할 확률" — 4-1, 4-7에서 사용 */
export const computeJobseekerPassProbability = computeMatchScore;

/** 기업 관점: "이 지원자가 우리 인재상에 얼마나 부합하는지" — 4-2에서 사용 (공식은 동일, 인자만 반대) */
export const computeCandidateFitScore = computeMatchScore;

export const MATCH_CRITERIA_LABELS: Record<keyof MatchBasis, string> = {
  gpa: "학점",
  skills: "기술스택",
  experience: "유사경험",
  internship: "인턴십",
};

/** 매칭 게이지 중앙 "충족수/전체" 표기를 위한 헬퍼. 적용된(applicable) 조건 중 몇 개를 충족했는지 센다. */
export function countApplicableCriteria(basis: MatchBasis): { met: number; applicable: number } {
  const entries = [basis.gpa, basis.skills, basis.experience, basis.internship];
  const applicable = entries.filter((c) => c.applicable).length;
  const met = entries.filter((c) => c.applicable && c.met).length;
  return { met, applicable };
}
