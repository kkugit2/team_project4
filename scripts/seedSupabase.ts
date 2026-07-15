/**
 * Supabase 시드 스크립트
 * localStorage의 더미 데이터를 Supabase로 마이그레이션합니다.
 *
 * 실행: npx ts-node scripts/seedSupabase.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface JobseekerProfile {
  userId: string;
  school: string;
  major: string;
  graduationStatus: string;
  gpa: number | null;
  gpaScale: number;
  skillTagIds: number[];
  careerHistory: Array<{
    company: string;
    period: string;
    role: string;
    isInternship: boolean;
  }>;
  certifications: Array<{
    name: string;
    date: string;
  }>;
}

interface CompanyProfile {
  userId: string;
  companyName: string;
  preferredGpaMin: number | null;
  preferredSkillTagIds: number[];
  preferredExperienceType: string[];
  internshipRequired: boolean;
  wantedCompanyId?: number;
}

// 더미 데이터
const DUMMY_JOBSEEKERS: JobseekerProfile[] = [
  {
    userId: "jobseeker-001",
    school: "서울대학교",
    major: "컴퓨터공학",
    graduationStatus: "졸업",
    gpa: 3.8,
    gpaScale: 4.0,
    skillTagIds: [1, 2, 3, 5],
    careerHistory: [
      {
        company: "네이버",
        period: "2023-01 ~ 2024-12",
        role: "백엔드 엔지니어",
        isInternship: false,
      },
    ],
    certifications: [
      { name: "AWS Solutions Architect", date: "2023-06" },
    ],
  },
];

const DUMMY_COMPANIES: CompanyProfile[] = [
  {
    userId: "company-001",
    companyName: "네이버",
    preferredGpaMin: 3.5,
    preferredSkillTagIds: [1, 2, 3],
    preferredExperienceType: ["백엔드", "개발"],
    internshipRequired: false,
    wantedCompanyId: 6817,
  },
  {
    userId: "company-002",
    companyName: "카카오",
    preferredGpaMin: 3.2,
    preferredSkillTagIds: [1, 4, 5],
    preferredExperienceType: ["풀스택"],
    internshipRequired: false,
    wantedCompanyId: 13751,
  },
];

async function seed() {
  console.log("🌱 Supabase 시드 시작...\n");

  try {
    // 1. 더미 사용자 프로필 삽입
    console.log("📝 구직자 프로필 삽입...");
    for (const seeker of DUMMY_JOBSEEKERS) {
      const { error } = await supabase.from("jobseeker_profile").insert({
        user_id: seeker.userId,
        school: seeker.school,
        major: seeker.major,
        graduation_status: seeker.graduationStatus,
        gpa: seeker.gpa,
        gpa_scale: seeker.gpaScale,
        skills: seeker.skillTagIds.map(String),
        career_history: seeker.careerHistory,
        certifications: seeker.certifications,
      });
      if (error) console.error("❌ 구직자 삽입 오류:", error);
    }
    console.log(`✅ ${DUMMY_JOBSEEKERS.length}개 구직자 프로필 삽입 완료\n`);

    // 2. 더미 기업 프로필 삽입
    console.log("🏢 기업 프로필 삽입...");
    for (const company of DUMMY_COMPANIES) {
      const { error } = await supabase.from("company_profile").insert({
        user_id: company.userId,
        company_name: company.companyName,
        preferred_gpa_min: company.preferredGpaMin,
        preferred_skills: company.preferredSkillTagIds.map(String),
        preferred_experience_type: company.preferredExperienceType,
        internship_required: company.internshipRequired,
        wanted_company_id: company.wantedCompanyId,
      });
      if (error) console.error("❌ 기업 삽입 오류:", error);
    }
    console.log(`✅ ${DUMMY_COMPANIES.length}개 기업 프로필 삽입 완료\n`);

    console.log("✨ 시드 완료!");
  } catch (error) {
    console.error("❌ 시드 중 오류 발생:", error);
    process.exit(1);
  }
}

seed();
