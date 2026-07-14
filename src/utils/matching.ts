import { Company, PassingProbabilityResult } from '../types';

/**
 * 합격 확률 계산 함수
 * 기업의 요구사항과 구직자 정보를 비교하여 충족률을 계산
 *
 * PRD 섹션 3-1-1 참고
 */
export const calculatePassingProbability = (
  company: Company,
  seekerGPA: number | null,
  seekerSkills: string[],
  seekerCareerHistory: string,
  hasInternshipExperience: boolean
): PassingProbabilityResult => {
  let totalRequirements = 0;
  let fulfilledCount = 0;
  const fulfills = {
    gpa: false,
    skills: false,
    experience: false,
    internship: false,
  };

  // 1. 학점 확인
  if (company.preferred_gpa_min !== null && company.preferred_gpa_min > 0) {
    totalRequirements++;
    if (seekerGPA !== null && seekerGPA >= company.preferred_gpa_min) {
      fulfills.gpa = true;
      fulfilledCount++;
    }
  }

  // 2. 기술스택 확인
  if (company.preferred_skills && company.preferred_skills.length > 0) {
    totalRequirements++;
    const hasMatchingSkill = company.preferred_skills.some((companySkill) =>
      seekerSkills.some((seekerSkill) =>
        seekerSkill.toLowerCase().includes(companySkill.toLowerCase()) ||
        companySkill.toLowerCase().includes(seekerSkill.toLowerCase())
      )
    );
    if (hasMatchingSkill) {
      fulfills.skills = true;
      fulfilledCount++;
    }
  }

  // 3. 경험 유형 확인
  if (company.preferred_experience_type && company.preferred_experience_type.trim()) {
    totalRequirements++;
    const lowerCareerHistory = seekerCareerHistory.toLowerCase();
    const lowerExperienceType = company.preferred_experience_type.toLowerCase();
    if (
      lowerCareerHistory.includes(lowerExperienceType) ||
      lowerCareerHistory.includes('engineer') ||
      lowerCareerHistory.includes('developer')
    ) {
      fulfills.experience = true;
      fulfilledCount++;
    }
  }

  // 4. 인턴십 경험 확인
  if (company.internship_required) {
    totalRequirements++;
    if (hasInternshipExperience) {
      fulfills.internship = true;
      fulfilledCount++;
    }
  }

  // 요구사항이 없는 경우 100%
  if (totalRequirements === 0) {
    return {
      percentage: 100,
      fulfills,
      total_requirements: 1,
      fulfilled_count: 1,
      description: '요구사항이 설정되지 않았습니다',
    };
  }

  const percentage = Math.round((fulfilledCount / totalRequirements) * 100);

  return {
    percentage,
    fulfills,
    total_requirements: totalRequirements,
    fulfilled_count: fulfilledCount,
    description: `요구사항 ${totalRequirements}개 중 ${fulfilledCount}개 충족`,
  };
};

/**
 * 합격 확률에 따른 색상 코드 반환
 */
export const getPassingProbabilityColor = (percentage: number): 'green' | 'orange' | 'red' => {
  if (percentage >= 75) return 'green';
  if (percentage >= 50) return 'orange';
  return 'red';
};

/**
 * 합격 확률에 따른 텍스트 레벨 반환
 */
export const getPassingProbabilityLevel = (percentage: number): '높음' | '중간' | '낮음' => {
  if (percentage >= 75) return '높음';
  if (percentage >= 50) return '중간';
  return '낮음';
};
