import { supabase } from "./supabaseClient";
import type { JobseekerProfile, CompanyProfile } from "@/types";
import { emptyJobseekerProfile, emptyCompanyProfile } from "@/types";

export async function getJobseekerProfile(userId: string): Promise<JobseekerProfile> {
  try {
    const { data, error } = await supabase
      .from("jobseeker_profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return emptyJobseekerProfile(userId);
    }

    return {
      userId: data.user_id,
      school: data.school || "",
      major: data.major || "",
      graduationStatus: data.graduation_status || "",
      gpa: data.gpa,
      gpaScale: data.gpa_scale || 4.0,
      skillTagIds: data.skills?.map((s: string) => parseInt(s, 10)) || [],
      careerHistory: data.career_history || [],
      certifications: data.certifications || [],
      resumeText: data.resume_text || "",
    };
  } catch {
    return emptyJobseekerProfile(userId);
  }
}

export async function updateJobseekerProfile(profile: JobseekerProfile): Promise<JobseekerProfile> {
  try {
    const { error } = await supabase.from("jobseeker_profile").upsert({
      user_id: profile.userId,
      school: profile.school,
      major: profile.major,
      graduation_status: profile.graduationStatus,
      gpa: profile.gpa,
      gpa_scale: profile.gpaScale,
      skills: profile.skillTagIds.map(String),
      career_history: profile.careerHistory,
      certifications: profile.certifications,
      resume_text: profile.resumeText,
    });

    if (error) {
      console.error("Update profile error:", error);
    }
    return profile;
  } catch (e) {
    console.error("Update profile exception:", e);
    return profile;
  }
}

export function isJobseekerProfileComplete(profile: JobseekerProfile): boolean {
  return Boolean(profile.school && profile.major && profile.gpa !== null);
}

export async function getCompanyProfile(userId: string, companyName = ""): Promise<CompanyProfile> {
  try {
    const { data, error } = await supabase
      .from("company_profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return emptyCompanyProfile(userId, companyName);
    }

    return {
      userId: data.user_id,
      companyName: data.company_name || companyName,
      preferredGpaMin: data.preferred_gpa_min,
      preferredSkillTagIds: data.preferred_skills?.map((s: string) => parseInt(s, 10)) || [],
      preferredExperienceType: data.preferred_experience_type || [],
      internshipRequired: data.internship_required || false,
      wantedCompanyId: data.wanted_company_id,
    };
  } catch {
    return emptyCompanyProfile(userId, companyName);
  }
}

export async function updateCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
  try {
    const { error } = await supabase.from("company_profile").upsert({
      user_id: profile.userId,
      company_name: profile.companyName,
      preferred_gpa_min: profile.preferredGpaMin,
      preferred_skills: profile.preferredSkillTagIds?.map(String) || [],
      preferred_experience_type: profile.preferredExperienceType || [],
      internship_required: profile.internshipRequired,
      wanted_company_id: profile.wantedCompanyId,
    });

    if (error) {
      console.error("Update company profile error:", error);
    }
    return profile;
  } catch (e) {
    console.error("Update company profile exception:", e);
    return profile;
  }
}
