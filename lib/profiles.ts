import { TABLE_KEYS } from "./constants";
import { getTable, upsertRow } from "./localDb";
import type { JobseekerProfile, CompanyProfile } from "@/types";
import { emptyJobseekerProfile, emptyCompanyProfile } from "@/types";

export function getJobseekerProfile(userId: string): JobseekerProfile {
  const found = getTable<JobseekerProfile>(TABLE_KEYS.JOBSEEKER_PROFILE).find((p) => p.userId === userId);
  return found ?? emptyJobseekerProfile(userId);
}

export function updateJobseekerProfile(profile: JobseekerProfile): JobseekerProfile {
  return upsertRow(TABLE_KEYS.JOBSEEKER_PROFILE, profile, (p) => p.userId === profile.userId);
}

export function isJobseekerProfileComplete(profile: JobseekerProfile): boolean {
  return Boolean(profile.school && profile.major && profile.gpa !== null);
}

export function getCompanyProfile(userId: string, companyName = ""): CompanyProfile {
  const found = getTable<CompanyProfile>(TABLE_KEYS.COMPANY_PROFILE).find((p) => p.userId === userId);
  return found ?? emptyCompanyProfile(userId, companyName);
}

export function updateCompanyProfile(profile: CompanyProfile): CompanyProfile {
  return upsertRow(TABLE_KEYS.COMPANY_PROFILE, profile, (p) => p.userId === profile.userId);
}
