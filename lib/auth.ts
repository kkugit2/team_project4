// Supabase Auth 호출 시그니처를 모사한 목업 인증. 데모 전용 — 비밀번호를 평문으로 저장하며
// 실제 연동 시 이 파일의 함수 본문만 Supabase Auth 호출로 교체하면 된다 (호출부는 변경 불필요).
import { TABLE_KEYS } from "./constants";
import { appError, ERROR_CODES, type AppError } from "./errors";
import { genId, getTable, insertRow, setSingleton, getSingleton, upsertRow } from "./localDb";
import type { Role, Session, JobseekerProfile, CompanyProfile } from "@/types";
import { emptyJobseekerProfile, emptyCompanyProfile } from "@/types";
import { seedDemoScoutsForNewJobseeker } from "./scouts";

interface AuthUserRecord {
  userId: string;
  email: string;
  /** 데모 전용 평문 저장. 실제 서비스에서는 절대 이렇게 저장하지 않는다 (MVP 한계, Backend-Guideline 1-1 참고). */
  password: string;
  role: Role;
}

function findUserByEmail(email: string): AuthUserRecord | undefined {
  return getTable<AuthUserRecord>(TABLE_KEYS.AUTH_USERS).find((u) => u.email === email);
}

function createSession(user: AuthUserRecord): Session {
  const session: Session = { userId: user.userId, email: user.email, role: user.role };
  setSingleton(TABLE_KEYS.SESSION, session);
  return session;
}

export interface JobseekerSignupInput {
  email: string;
  password: string;
  profile?: Partial<Omit<JobseekerProfile, "userId">>;
}

export function signUpJobseeker(input: JobseekerSignupInput): Session | AppError {
  if (findUserByEmail(input.email)) {
    return appError(ERROR_CODES.EMAIL_ALREADY_EXISTS, "이미 가입된 이메일입니다.");
  }
  const userId = genId("user");
  const user: AuthUserRecord = { userId, email: input.email, password: input.password, role: "jobseeker" };
  insertRow(TABLE_KEYS.AUTH_USERS, user);

  const profile: JobseekerProfile = { ...emptyJobseekerProfile(userId), ...input.profile, userId };
  upsertRow<JobseekerProfile>(TABLE_KEYS.JOBSEEKER_PROFILE, profile, (p) => p.userId === userId);

  seedDemoScoutsForNewJobseeker(userId);

  return createSession(user);
}

export interface CompanySignupInput {
  email: string;
  password: string;
  companyName: string;
  profile?: Partial<Omit<CompanyProfile, "userId" | "companyName">>;
}

export function signUpCompany(input: CompanySignupInput): Session | AppError {
  if (findUserByEmail(input.email)) {
    return appError(ERROR_CODES.EMAIL_ALREADY_EXISTS, "이미 가입된 이메일입니다.");
  }
  const userId = genId("user");
  const user: AuthUserRecord = { userId, email: input.email, password: input.password, role: "company" };
  insertRow(TABLE_KEYS.AUTH_USERS, user);

  const profile: CompanyProfile = {
    ...emptyCompanyProfile(userId, input.companyName),
    ...input.profile,
    userId,
    companyName: input.companyName,
  };
  upsertRow<CompanyProfile>(TABLE_KEYS.COMPANY_PROFILE, profile, (p) => p.userId === userId);

  return createSession(user);
}

export function login(email: string, password: string): Session | AppError {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return appError(ERROR_CODES.INVALID_CREDENTIALS, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return createSession(user);
}

export function logout(): void {
  setSingleton(TABLE_KEYS.SESSION, null);
}

export function getSession(): Session | null {
  return getSingleton<Session>(TABLE_KEYS.SESSION);
}
