// 실제 원티드 데이터 (real_data) 어댑터
// 빌드 타임: jobs.json (csv-parser로 생성)
// 런타임: job_details.csv (클라이언트사이드 PapaParse로 파싱)
// localStorage: 캐싱

import type { Job, JobDetail, Company, Tag } from "@/types";

const JOBS_JSON_URL = "/real_data_json/jobs.json";
const JOB_DETAILS_CSV_URL = "/real_data_json/job_details.csv";
const COMPANIES_JSON_URL = "/real_data_json/companies.json";
const CATEGORIES_JSON_URL = "/real_data_json/categories.json";
const ATTRACTIONS_JSON_URL = "/real_data_json/attractions.json";

const CACHE_PREFIX = "real_data_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// 캐시 관리
function getCachedData<T>(key: string): T | null {
  if (typeof window === "undefined") return null; // SSR 환경에서는 사용 불가

  const cached = localStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;

  try {
    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const now = Date.now();

    // 캐시가 유효한지 확인
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return data;
  } catch (e) {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cached));
  } catch (e) {
    console.warn("Failed to cache data:", e);
  }
}

// JSON 로드
async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

// CSV 파싱 (간단한 구현, PapaParse 없이)
function parseSimpleCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split("\n");
  if (lines.length === 0) return [];

  // 헤더 파싱
  const headerLine = lines[0];
  let headers: string[] = [];

  // BOM 제거
  const cleanHeader = headerLine.replace(/^﻿/, "");

  // 쉼표로 분리 (간단한 방식, 따옴표 처리 제외)
  headers = cleanHeader.split(",").map((h) => h.trim());

  // 데이터 행 파싱 (이 부분은 복잡한 CSV는 제대로 처리하지 못함)
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // 간단한 파싱: 쉼표로 분리
    const values = line.split(",").map((v) => v.trim());

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    results.push(row);
  }

  return results;
}

// Job Details CSV 로드
async function fetchJobDetailsCSV(): Promise<Record<string, Record<string, string>>> {
  const cached = getCachedData<Record<string, Record<string, string>>>(
    "job_details_map"
  );
  if (cached) return cached;

  try {
    const response = await fetch(JOB_DETAILS_CSV_URL);
    if (!response.ok) throw new Error("Failed to fetch job details");

    const csvText = await response.text();
    const rows = parseSimpleCSV(csvText);

    // ID를 키로 하는 맵 생성
    const map: Record<string, Record<string, string>> = {};
    rows.forEach((row) => {
      if (row.id) {
        map[row.id.trim()] = row;
      }
    });

    setCachedData("job_details_map", map);
    return map;
  } catch (error) {
    console.error("Failed to load job details:", error);
    return {}; // 빈 맵 반환 (상세 정보 없이도 기본 정보는 표시)
  }
}

function parseJSON(str: string): unknown[] {
  if (!str || typeof str !== "string") return [];
  try {
    const normalized = str
      .replace(/'/g, '"')
      .replace(/None/g, "null")
      .replace(/True/g, "true")
      .replace(/False/g, "false");
    return JSON.parse(normalized);
  } catch (e) {
    return [];
  }
}

// 공개 인터페이스

/** 모든 공고 로드 */
export async function loadAllJobs(): Promise<Job[]> {
  const cached = getCachedData<Job[]>("all_jobs");
  if (cached) return cached;

  try {
    const jobs = await fetchJSON<Job[]>(JOBS_JSON_URL);
    setCachedData("all_jobs", jobs);
    return jobs;
  } catch (error) {
    console.error("Failed to load jobs:", error);
    return [];
  }
}

/** 특정 공고 상세정보 로드 */
export async function loadJobDetail(jobId: string): Promise<JobDetail | null> {
  try {
    const jobDetailsMap = await fetchJobDetailsCSV();
    const jobDetailRow = jobDetailsMap[jobId.trim()];

    if (!jobDetailRow) {
      // job_details가 없으면 기본 job 정보로 JobDetail 생성
      const jobs = await loadAllJobs();
      const job = jobs.find((j) => j.id === jobId);
      if (!job) return null;

      // Job을 JobDetail로 변환 (상세정보는 기본값으로)
      const jobDetail: JobDetail = {
        ...job,
        intro: "",
        mainTasks: "",
        requirements: "",
        preferredPoints: "",
        hireRounds: "",
        benefits: "주어진 복지 정보가 없습니다.",
        promoImages: []
      };
      return jobDetail;
    }

    // job_details 정보를 jobDetail 타입으로 변환
    const jobDetail: JobDetail = {
      id: jobDetailRow.id || jobId,
      companyId: jobDetailRow["company.id"] || "",
      companyName: jobDetailRow["company.name"] || "",
      companyColor: jobDetailRow["company.color"] || "#2563eb",
      category: jobDetailRow["category_tags.parent_tag.title"] || "Other",
      position: jobDetailRow["detail.name"] || "",
      location: jobDetailRow["address.full_location"] || "Unknown",
      dueTime: jobDetailRow.due_time || null,
      applyUrl: jobDetailRow.url || "",
      skillTagIds: [],
      salary: null,
      intro: jobDetailRow["detail.intro"] || "",
      mainTasks: jobDetailRow["detail.main_tasks"] || "",
      requirements: jobDetailRow["detail.requirements"] || "",
      preferredPoints: jobDetailRow["detail.preferred_points"] || "",
      hireRounds: jobDetailRow["detail.hire_rounds"] || "",
      benefits: jobDetailRow["detail.benefits"] || "",
      promoImages: []
    };

    return jobDetail;
  } catch (error) {
    console.error(`Failed to load job detail for ${jobId}:`, error);
    return null;
  }
}

/** 모든 회사 로드 */
export async function loadAllCompanies(): Promise<Company[]> {
  const cached = getCachedData<Company[]>("all_companies");
  if (cached) return cached;

  try {
    const companies = await fetchJSON<Company[]>(COMPANIES_JSON_URL);
    setCachedData("all_companies", companies);
    return companies;
  } catch (error) {
    console.error("Failed to load companies:", error);
    return [];
  }
}

/** 특정 회사 정보 로드 */
export async function loadCompany(companyId: string): Promise<Company | null> {
  const companies = await loadAllCompanies();
  return companies.find((c) => c.id === companyId) || null;
}

/** 모든 카테고리 태그 로드 */
export async function loadAllCategories(): Promise<Tag[]> {
  const cached = getCachedData<Tag[]>("all_categories");
  if (cached) return cached;

  try {
    const categories = await fetchJSON<Tag[]>(CATEGORIES_JSON_URL);
    setCachedData("all_categories", categories);
    return categories;
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

/** 모든 매력 태그 로드 */
export async function loadAllAttractions(): Promise<Tag[]> {
  const cached = getCachedData<Tag[]>("all_attractions");
  if (cached) return cached;

  try {
    const attractions = await fetchJSON<Tag[]>(ATTRACTIONS_JSON_URL);
    setCachedData("all_attractions", attractions);
    return attractions;
  } catch (error) {
    console.error("Failed to load attractions:", error);
    return [];
  }
}

/** 태그 ID로 찾기 */
export async function findTagById(id: number): Promise<Tag | null> {
  const [categories, attractions] = await Promise.all([
    loadAllCategories(),
    loadAllAttractions()
  ]);

  const allTags = [...categories, ...attractions];
  return allTags.find((t) => t.id === id) || null;
}

/** 복수 태그 ID로 찾기 */
export async function findTagsByIds(ids: number[]): Promise<Tag[]> {
  const [categories, attractions] = await Promise.all([
    loadAllCategories(),
    loadAllAttractions()
  ]);

  const allTags = [...categories, ...attractions];
  return ids
    .map((id) => allTags.find((t) => t.id === id))
    .filter((t): t is Tag => Boolean(t));
}
