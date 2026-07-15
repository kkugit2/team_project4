export interface CareerEntry {
  company: string;
  period: string;
  role: string;
  isInternship: boolean;
}

export interface JobseekerProfile {
  userId: string;
  school: string;
  major: string;
  graduationStatus: string;
  gpa: number | null;
  gpaScale: number;
  certifications: string[];
  careerHistory: CareerEntry[];
  /** 태그 API의 skill id를 문자열로 저장 (Backend-Guideline 5-2) */
  skillTagIds: number[];
  resumeText: string;
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  /** 원티드 실제 회사와 연결 시 사용(선택). 지금은 mock Company.id(문자열) 체계를 그대로 쓰고,
   *  실 연동 시 원티드의 정수 company id로 교체한다. */
  wantedCompanyId?: string;
  preferredGpaMin: number | null;
  preferredSkillTagIds: number[];
  preferredExperienceType: string[];
  internshipRequired: boolean;
}

export function emptyJobseekerProfile(userId: string): JobseekerProfile {
  return {
    userId,
    school: "",
    major: "",
    graduationStatus: "",
    gpa: null,
    gpaScale: 4.5,
    certifications: [],
    careerHistory: [],
    skillTagIds: [],
    resumeText: "",
  };
}

export function emptyCompanyProfile(userId: string, companyName: string): CompanyProfile {
  return {
    userId,
    companyName,
    preferredGpaMin: null,
    preferredSkillTagIds: [],
    preferredExperienceType: [],
    internshipRequired: false,
  };
}
