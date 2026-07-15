// UI-UX-Guideline_all.md 4-2 구직자 홈(통계 분석) 계산. 순수 함수 — I/O 없음.
import { computeJobseekerPassProbability } from "./matchScore";
import { findTagById } from "@/data/dummyData";
import type { Job, JobseekerProfile } from "@/types";

type PeerPool = { skillTagIds: number[]; careerHistory: unknown[] }[];

const ELIGIBLE_THRESHOLD = 50;
const WEAKNESS_TOP_N = 3;

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export interface ProfileInsights {
  careerCount: number;
  skillCount: number;
  certCount: number;
  eligibleJobCount: number;
  avgPeerSkillCount: number;
  avgPeerCareerCount: number;
  skillCoverage: { have: number; marketTotal: number };
  strengths: string[];
  weaknesses: string[];
}

export function computeProfileInsights(profile: JobseekerProfile, jobs: Job[], peers: PeerPool): ProfileInsights {
  const careerCount = profile.careerHistory.length;
  const skillCount = profile.skillTagIds.length;
  const certCount = profile.certifications.length;

  const eligibleJobCount = jobs.filter((job) => {
    const { score } = computeJobseekerPassProbability(
      { gpa: profile.gpa, gpaScale: profile.gpaScale, skillTagIds: profile.skillTagIds, careerHistory: profile.careerHistory },
      { preferredGpaMin: null, preferredSkillTagIds: job.skillTagIds, preferredExperienceType: [], internshipRequired: false }
    );
    return score >= ELIGIBLE_THRESHOLD;
  }).length;

  const avgPeerSkillCount = average(peers.map((p) => p.skillTagIds.length));
  const avgPeerCareerCount = average(peers.map((p) => p.careerHistory.length));

  const skillFrequency = new Map<number, number>();
  jobs.forEach((job) => {
    job.skillTagIds.forEach((id) => {
      skillFrequency.set(id, (skillFrequency.get(id) ?? 0) + 1);
    });
  });

  const marketSkillIds = new Set(skillFrequency.keys());
  const have = profile.skillTagIds.filter((id) => marketSkillIds.has(id)).length;

  const mySkillSet = new Set(profile.skillTagIds);

  const strengths = Array.from(skillFrequency.entries())
    .filter(([id, freq]) => mySkillSet.has(id) && freq >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => findTagById(id)?.title)
    .filter((title): title is string => Boolean(title));

  const weaknesses = Array.from(skillFrequency.entries())
    .filter(([id]) => !mySkillSet.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, WEAKNESS_TOP_N)
    .map(([id]) => findTagById(id)?.title)
    .filter((title): title is string => Boolean(title));

  return {
    careerCount,
    skillCount,
    certCount,
    eligibleJobCount,
    avgPeerSkillCount,
    avgPeerCareerCount,
    skillCoverage: { have, marketTotal: marketSkillIds.size },
    strengths,
    weaknesses,
  };
}
