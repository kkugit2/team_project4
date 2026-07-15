// Supabase 테이블명과 동일하게 맞춘 localStorage 키 (Backend-Guideline 3장).
export const TABLE_KEYS = {
  AUTH_USERS: "jm_auth_users",
  SESSION: "jm_current_session",
  JOBSEEKER_PROFILE: "jm_jobseeker_profile",
  COMPANY_PROFILE: "jm_company_profile",
  APPLICATIONS: "jm_applications",
  BOOKMARKS: "jm_bookmarks",
  SELF_INTROS: "jm_self_intros",
  FEEDBACK_RESULTS: "jm_feedback_results",
  SCOUTS: "jm_scouts",
  VIEWED_CANDIDATES: "jm_viewed_candidates",
  SEEDED_FLAGS: "jm_seeded_flags",
} as const;

/** Backend-Guideline 5-1: 매칭 스코어 항목별 기본 가중치 */
export const MATCH_WEIGHTS = {
  gpa: 25,
  skills: 35,
  experience: 25,
  internship: 15,
} as const;

/** Backend-Guideline 7-1: 기업당 스카웃 발송 한도 (최근 30일 롤링) */
export const SCOUT_MONTHLY_LIMIT = 10;

/** Backend-Guideline 7-2: 스카웃 유효기간 */
export const SCOUT_EXPIRY_DAYS = 7;

/** Backend-Guideline 6-3: 경쟁자 비교분석 최소 표본 */
export const MIN_COMPARISON_SAMPLE = 5;
