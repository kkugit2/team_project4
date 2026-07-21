import { TABLE_KEYS } from "./constants";
import { getTable, upsertRow } from "./localDb";
import type { JobseekerProfile, CompanyProfile } from "@/types";
import { emptyJobseekerProfile, emptyCompanyProfile } from "@/types";

export async function getJobseekerProfile(userId: string): Promise<JobseekerProfile> {
  const rows = await getTable<JobseekerProfile>(TABLE_KEYS.JOBSEEKER_PROFILE);
  const found = rows.find((p) => p.userId === userId);
  return found ?? emptyJobseekerProfile(userId);
}

export async function updateJobseekerProfile(profile: JobseekerProfile): Promise<JobseekerProfile> {
  return upsertRow(TABLE_KEYS.JOBSEEKER_PROFILE, profile, (p) => p.userId === profile.userId);
}

export function isJobseekerProfileComplete(profile: JobseekerProfile): boolean {
  return Boolean(profile.school && profile.major && profile.gpa !== null);
}

export async function getCompanyProfile(userId: string, companyName = ""): Promise<CompanyProfile> {
  const rows = await getTable<CompanyProfile>(TABLE_KEYS.COMPANY_PROFILE);
  const found = rows.find((p) => p.userId === userId);
  return found ?? emptyCompanyProfile(userId, companyName);
}

export async function updateCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
  return upsertRow(TABLE_KEYS.COMPANY_PROFILE, profile, (p) => p.userId === profile.userId);
}
