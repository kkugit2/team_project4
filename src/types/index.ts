// 사용자 관련 타입
export type UserType = 'job_seeker' | 'recruiter';

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

// 구직자 프로필
export interface JobSeekerProfile {
  id: string;
  user_id: string;
  education: string | null;
  gpa: number | null;
  created_at: string;
  updated_at: string;
}

// 자격증
export interface Certification {
  id: string;
  user_id: string;
  cert_name: string;
  issued_date: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// 경력
export interface Experience {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 기업 프로필
export interface RecruiterProfile {
  id: string;
  user_id: string;
  company_name: string;
  desired_traits: DesiredTraits | null;
  created_at: string;
  updated_at: string;
}

// 기업의 원하는 인재상
export interface DesiredTraits {
  preferred_gpa_min: number | null;
  preferred_skills: string[];
  preferred_experience_type: string | null;
  internship_required: boolean;
}

// 채용공고 (더미데이터용)
export interface JobPosting {
  id: string;
  company_id: string;
  company_name: string;
  position_title: string;
  experience_requirement: string;
  required_skills: string[];
  location: string;
  deadline: string;
  description: string;
}

// 기업 데이터 (더미)
export interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  description: string;
  preferred_gpa_min: number;
  preferred_skills: string[];
  preferred_experience_type: string;
  internship_required: boolean;
  size: string;
  founded_year: number;
  work_type: string;
  benefits: string[];
  logo_url: string;
  background_image_url: string;
}

// 구직자 데이터 (더미)
export interface SeekerDummy {
  id: string;
  name: string;
  email: string;
  gpa: number;
  skills: string[];
  career_history: string;
  internship_experience: boolean;
  created_at: string;
}

// 지원 현황
export interface Application {
  id: string;
  job_seeker_id: string;
  job_posting_id: string;
  status: 'not_applied' | 'applied';
  created_at: string;
  updated_at: string;
}

// 찜하기
export interface Bookmark {
  id: string;
  user_id: string;
  job_posting_id: string;
  company_name: string;
  position_name: string;
  created_at: string;
  updated_at: string;
}

// 로그인 폼 데이터
export interface LoginFormData {
  email: string;
  password: string;
}

// 회원가입 폼 데이터
export interface SignUpFormData {
  userType: UserType | null;
  email: string;
  password: string;
  passwordConfirm: string;
  education: string;
  gpa: number | null;
  skills: string[];
  experienceType: string;
  hasInternship: boolean;
}

// 유효성 검증 에러
export interface ValidationError {
  field: string;
  message: string;
}

// 합격 확률 계산 결과
export interface PassingProbabilityResult {
  percentage: number;
  fulfills: {
    gpa: boolean;
    skills: boolean;
    experience: boolean;
    internship: boolean;
  };
  total_requirements: number;
  fulfilled_count: number;
  description: string;
}
