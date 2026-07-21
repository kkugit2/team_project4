// /api/wanted/* 프록시 경계를 호출하는 클라이언트 계층. 실제 원티드 API로 바뀌어도
// 이 파일의 함수 시그니처와 호출부는 그대로 유지된다 (Route Handler 내부만 교체).
import type { Job, JobDetail, Company } from "@/types";

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
  const res = await fetch(`/api/wanted/jobs/${id}`);
  if (!res.ok) return null;
  return toDomainJobDetail((await res.json()) as JobDetail);
}

export async function getCompany(id: string): Promise<Company | null> {
  const res = await fetch(`/api/wanted/companies/${id}`);
  if (!res.ok) return null;
  return toDomainCompany((await res.json()) as Company);
}

export async function searchWanted(query: string): Promise<{ jobs: Job[]; companies: Company[] }> {
  const res = await fetch(`/api/wanted/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return { jobs: [], companies: [] };
  return res.json();
}
