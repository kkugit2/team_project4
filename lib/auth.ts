// Supabase 기반 인증. 함수 시그니처는 유지하고 내부만 구현.
// MVP 단계: profiles 테이블에 직접 저장하는 간단한 인증 (Backend-Guideline 1-1 한계)
import { genId } from "./localDb";
import { TABLE_KEYS } from "./constants";
import { appError, ERROR_CODES, type AppError } from "./errors";
import { setSingleton, getSingleton } from "./localDb";
import { supabase } from "./supabaseClient";
import type { Role, Session, JobseekerProfile, CompanyProfile } from "@/types";
import { emptyJobseekerProfile, emptyCompanyProfile } from "@/types";
import { seedDemoScoutsForNewJobseeker } from "./scouts";

interface AuthUserRecord {
  user_id: string;
  email: string;
  password: string;
  role: Role;
}

function createSession(userId: string, email: string, role: Role): Session {
  const session: Session = { userId, email, role };
  setSingleton(TABLE_KEYS.SESSION, session);
  return session;
}

export interface JobseekerSignupInput {
  email: string;
  password: string;
  profile?: Partial<Omit<JobseekerProfile, "userId">>;
}

export async function signUpJobseeker(input: JobseekerSignupInput): Promise<Session | AppError> {
  try {
    // 이메일 중복 확인
    const { data: existing } = await supabase
      .from("auth_users_local")
      .select("user_id")
      .eq("email", input.email)
      .limit(1);

    if (existing && existing.length > 0) {
      return appError(ERROR_CODES.EMAIL_ALREADY_EXISTS, "이미 가입된 이메일입니다.");
    }

    // 새 사용자 생성
    const userId = genId("user");
    const { error: authError } = await supabase.from("auth_users_local").insert({
      user_id: userId,
      email: input.email,
      password: input.password,
      role: "jobseeker",
    });

    if (authError) {
      return appError(ERROR_CODES.AUTH_ERROR, "회원가입에 실패했습니다.");
    }

    // 프로필 생성
    const jobseekerProfile: JobseekerProfile = {
      ...emptyJobseekerProfile(userId),
      ...input.profile,
      userId,
    };

    const { error: profileError } = await supabase.from("jobseeker_profile").insert({
      user_id: userId,
      school: jobseekerProfile.school,
      major: jobseekerProfile.major,
      graduation_status: jobseekerProfile.graduationStatus,
      gpa: jobseekerProfile.gpa,
      gpa_scale: jobseekerProfile.gpaScale,
      skills: jobseekerProfile.skillTagIds.map(String),
      career_history: jobseekerProfile.careerHistory,
      certifications: jobseekerProfile.certifications,
    });

    if (profileError) {
      return appError(ERROR_CODES.AUTH_ERROR, "프로필 저장에 실패했습니다.");
    }

    seedDemoScoutsForNewJobseeker(userId);
    return createSession(userId, input.email, "jobseeker");
  } catch (e) {
    return appError(ERROR_CODES.AUTH_ERROR, "회원가입 중 오류가 발생했습니다.");
  }
}

export interface CompanySignupInput {
  email: string;
  password: string;
  companyName: string;
  profile?: Partial<Omit<CompanyProfile, "userId" | "companyName">>;
}

export async function signUpCompany(input: CompanySignupInput): Promise<Session | AppError> {
  try {
    // 이메일 중복 확인
    const { data: existing } = await supabase
      .from("auth_users_local")
      .select("user_id")
      .eq("email", input.email)
      .limit(1);

    if (existing && existing.length > 0) {
      return appError(ERROR_CODES.EMAIL_ALREADY_EXISTS, "이미 가입된 이메일입니다.");
    }

    // 새 사용자 생성
    const userId = genId("user");
    const { error: authError } = await supabase.from("auth_users_local").insert({
      user_id: userId,
      email: input.email,
      password: input.password,
      role: "company",
    });

    if (authError) {
      return appError(ERROR_CODES.AUTH_ERROR, "회원가입에 실패했습니다.");
    }

    // 회사 프로필 생성
    const companyProfile: CompanyProfile = {
      ...emptyCompanyProfile(userId, input.companyName),
      ...input.profile,
      userId,
      companyName: input.companyName,
    };

    const { error: profileError } = await supabase.from("company_profile").insert({
      user_id: userId,
      company_name: companyProfile.companyName,
      preferred_gpa_min: companyProfile.preferredGpaMin,
      preferred_skills: companyProfile.preferredSkillTagIds?.map(String) || [],
      preferred_experience_type: companyProfile.preferredExperienceType || [],
      internship_required: companyProfile.internshipRequired,
    });

    if (profileError) {
      return appError(ERROR_CODES.AUTH_ERROR, "회사 프로필 저장에 실패했습니다.");
    }

    return createSession(userId, input.email, "company");
  } catch (e) {
    return appError(ERROR_CODES.AUTH_ERROR, "회원가입 중 오류가 발생했습니다.");
  }
}

export async function login(email: string, password: string): Promise<Session | AppError> {
  try {
    const { data, error } = await supabase
      .from("auth_users_local")
      .select("user_id, role")
      .eq("email", email)
      .eq("password", password)
      .limit(1);

    if (error || !data || data.length === 0) {
      return appError(ERROR_CODES.INVALID_CREDENTIALS, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const user = data[0];
    return createSession(user.user_id, email, user.role as Role);
  } catch (e) {
    return appError(ERROR_CODES.AUTH_ERROR, "로그인 중 오류가 발생했습니다.");
  }
}

export function logout(): void {
  setSingleton(TABLE_KEYS.SESSION, null);
}

export function getSession(): Session | null {
  return getSingleton<Session>(TABLE_KEYS.SESSION);
}
