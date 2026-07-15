// /api/wanted/* 프록시 경계를 호출하는 클라이언트 계층. 실제 원티드 API로 바뀌어도
// 이 파일의 함수 시그니처와 호출부는 그대로 유지된다 (Route Handler 내부만 교체).
//
// 환경변수 NEXT_PUBLIC_USE_REAL_DATA:
// - true: /public/real_data_json 데이터 사용 (realDataAdapter)
// - false: /api/wanted/* API 프록시 사용 (Mock 데이터)

import type { Job, JobDetail, Company } from "@/types";
import * as realDataAdapter from "@/lib/realDataAdapter";
import { MOCK_JOBS, MOCK_CANDIDATES } from "@/data/dummyData";

const USE_REAL_DATA = process.env.NEXT_PUBLIC_USE_REAL_DATA === "true";

// 실 API 응답 필드가 어긋나도 이 어댑터 안에서만 고치면 되도록, 원본을 그대로 넘기지 않는다.
function toDomainJob(raw: Job): Job {
  return raw;
}

function toDomainJobDetail(raw: JobDetail): JobDetail {
  return raw;
}

function toDomainCompany(raw: Company): Company {
  return raw;
}

export interface JobFilters {
  category?: string;
  skillTags?: number[];
}

export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  if (USE_REAL_DATA) {
    let jobs = await realDataAdapter.loadAllJobs();

    // real_data에서 skillTagIds가 비어있으므로, MOCK_JOBS에서 보충
    const jobMap = new Map(jobs.map(j => [j.id, j]));
    for (const mockJob of MOCK_JOBS) {
      if (!jobMap.has(mockJob.id)) {
        jobMap.set(mockJob.id, mockJob);
      } else {
        // 기존 real_data에 skillTagIds 보충
        const existing = jobMap.get(mockJob.id)!;
        if (existing.skillTagIds.length === 0 && mockJob.skillTagIds.length > 0) {
          existing.skillTagIds = mockJob.skillTagIds;
        }
      }
    }
    jobs = Array.from(jobMap.values());

    // 필터링: category
    if (filters?.category) {
      jobs = jobs.filter((j) => j.category === filters.category);
    }

    // 필터링: skillTags (교집합)
    if (filters?.skillTags?.length) {
      jobs = jobs.filter((j) =>
        filters.skillTags!.some((tagId) => j.skillTagIds.includes(tagId))
      );
    }

    return jobs;
  }

  // 기존 API 호출
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.skillTags?.length) params.set("skillTags", filters.skillTags.join(","));
  const qs = params.toString();
  const res = await fetch(`/api/wanted/jobs${qs ? `?${qs}` : ""}`);
  if (!res.ok) return [];
  const raw = (await res.json()) as Job[];
  return raw.map(toDomainJob);
}

export async function getJob(id: string): Promise<JobDetail | null> {
  if (USE_REAL_DATA) {
    return realDataAdapter.loadJobDetail(id);
  }

  // 기존 API 호출
  const res = await fetch(`/api/wanted/jobs/${id}`);
  if (!res.ok) return null;
  return toDomainJobDetail((await res.json()) as JobDetail);
}

export async function getCompany(id: string): Promise<Company | null> {
  if (USE_REAL_DATA) {
    return realDataAdapter.loadCompany(id);
  }

  // 기존 API 호출
  const res = await fetch(`/api/wanted/companies/${id}`);
  if (!res.ok) return null;
  return toDomainCompany((await res.json()) as Company);
}

export async function searchWanted(query: string): Promise<{ jobs: Job[]; companies: Company[] }> {
  const res = await fetch(`/api/wanted/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return { jobs: [], companies: [] };
  return res.json();
}
