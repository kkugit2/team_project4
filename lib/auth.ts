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

async function findUserByEmail(email: string): Promise<AuthUserRecord | undefined> {
  const users = await getTable<AuthUserRecord>(TABLE_KEYS.AUTH_USERS);
  return users.find((u) => u.email === email);
}

async function createSession(user: AuthUserRecord): Promise<Session> {
  const session: Session = { userId: user.userId, email: user.email, role: user.role };
  await setSingleton(TABLE_KEYS.SESSION, session);
  return session;
}

export interface JobseekerSignupInput {
  email: string;
  password: string;
  profile?: Partial<Omit<JobseekerProfile, "userId">>;
}

export async function signUpJobseeker(input: JobseekerSignupInput): Promise<Session | AppError> {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    return appError(ERROR_CODES.EMAIL_ALREADY_EXISTS, "이미 가입된 이메일입니다.");
  }
  const userId = genId("user");
  const user: AuthUserRecord = { userId, email: input.email, password: input.password, role: "jobseeker" };
  await insertRow(TABLE_KEYS.AUTH_USERS, user);

  const profile: JobseekerProfile = { ...emptyJobseekerProfile(userId), ...input.profile, userId };
  await upsertRow<JobseekerProfile>(TABLE_KEYS.JOBSEEKER_PROFILE, profile, (p) => p.userId === userId);

  await seedDemoScoutsForNewJobseeker(userId);

  return createSession(user);
}

export interface CompanySignupInput {
  email: string;
  password: string;
  companyName: string;
  profile?: Partial<Omit<CompanyProfile, "userId" | "companyName">>;
}

export async function signUpCompany(input: CompanySignupInput): Promise<Session | AppError> {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    return appError(ERROR_CODES.EMAIL_ALREADY_EXISTS, "이미 가입된 이메일입니다.");
  }
  const userId = genId("user");
  const user: AuthUserRecord = { userId, email: input.email, password: input.password, role: "company" };
  await insertRow(TABLE_KEYS.AUTH_USERS, user);

  const profile: CompanyProfile = {
    ...emptyCompanyProfile(userId, input.companyName),
    ...input.profile,
    userId,
    companyName: input.companyName,
  };
  await upsertRow<CompanyProfile>(TABLE_KEYS.COMPANY_PROFILE, profile, (p) => p.userId === userId);

  return createSession(user);
}

export async function login(email: string, password: string): Promise<Session | AppError> {
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    return appError(ERROR_CODES.INVALID_CREDENTIALS, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return createSession(user);
}

export async function logout(): Promise<void> {
  await setSingleton(TABLE_KEYS.SESSION, null);
}

export async function getSession(): Promise<Session | null> {
  return getSingleton<Session>(TABLE_KEYS.SESSION);
}
