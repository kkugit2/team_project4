import fs from 'fs';
import path from 'path';
import { Job, Company, JobDetail } from '@/types/domain';
import { getCompanyColor } from '@/lib/colorUtils';

interface RawJobRow {
  id?: string;
  name?: string;
  'company.id'?: string;
  'company.name'?: string;
  'due_time'?: string;
  'title_img.origin'?: string;
  'title_img.thumb'?: string;
  'logo_img.origin'?: string;
  'logo_img.thumb'?: string;
  'category_tags.parent_tag.title'?: string;
  'category_tags.parent_tag.id'?: string;
  'address.location'?: string;
  'url'?: string;
  'category_tags.child_tags'?: string;
  'reward.total'?: string;
  'reward.recommender'?: string;
  'reward.recommendee'?: string;
  [key: string]: string | undefined;
}

interface RawCompanyRow {
  'company.id'?: string;
  'company.name'?: string;
  'company.logo_url.origin'?: string;
  'company.logo_url.thumb'?: string;
  'company.images'?: string;
  'company.description'?: string;
  'company.url'?: string;
  [key: string]: string | undefined;
}

interface CachedCompanyData {
  company: Company;
  logoUrl: string;
  titleImageUrl: string;
}

let cachedJobs: Job[] | null = null;
let cachedJobDetails: Map<string, JobDetail> | null = null;
let cachedCompanies: Map<string, CachedCompanyData> | null = null;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseJobsCSV(): Job[] {
  if (cachedJobs) return cachedJobs;

  const csvPath = path.join(process.cwd(), 'jobs.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');

  const headerLine = lines[0].replace(/^﻿/, ''); // Remove BOM
  const headers = parseCSVLine(headerLine).map(h => h.trim());

  const jobs: Job[] = [];
  const seenIds = new Set<string>();

  // 최대 500개 항목만 로드 (성능상)
  for (let i = 1; i < Math.min(lines.length, 501); i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const row: RawJobRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    if (!row.id || !row.name) continue;

    // 중복된 ID는 건너뛴다
    if (seenIds.has(row.id)) continue;
    seenIds.add(row.id);

    const companyId = row['company.id'] || '0';
    const companyColor = getCompanyColor(companyId);

    const job: Job = {
      id: row.id,
      companyId: companyId,
      companyName: row['company.name'] || 'Unknown',
      companyColor: companyColor,
      category: row['category_tags.parent_tag.title'] || 'Other',
      position: row.name,
      location: row['address.location'] || '',
      dueTime: row['due_time'] || null,
      applyUrl: row['url'] || `https://www.wanted.co.kr/wd/${row.id}`,
      skillTagIds: [],
      salary: null,
    };

    jobs.push(job);
  }

  cachedJobs = jobs;
  return jobs;
}

function parseJobDetailsCSV(): Map<string, JobDetail> {
  if (cachedJobDetails) return cachedJobDetails;

  const csvPath = path.join(process.cwd(), 'jobs.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');

  const headerLine = lines[0].replace(/^﻿/, ''); // Remove BOM
  const headers = parseCSVLine(headerLine).map(h => h.trim());

  const details = new Map<string, JobDetail>();

  for (let i = 1; i < Math.min(lines.length, 501); i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const row: RawJobRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    if (!row.id || !row.name) continue;

    const companyId = row['company.id'] || '0';
    const companyColor = getCompanyColor(companyId);

    const jobDetail: JobDetail = {
      id: row.id,
      companyId: companyId,
      companyName: row['company.name'] || 'Unknown',
      companyColor: companyColor,
      category: row['category_tags.parent_tag.title'] || 'Other',
      position: row.name,
      location: row['address.location'] || '',
      dueTime: row['due_time'] || null,
      applyUrl: row['url'] || `https://www.wanted.co.kr/wd/${row.id}`,
      skillTagIds: [],
      salary: null,
      intro: row.name,
      mainTasks: '',
      requirements: '',
      preferredPoints: '',
      hireRounds: '',
      benefits: '',
      promoImages: row['title_img.origin']
        ? [{ label: 'main', bg: row['title_img.origin'] }]
        : [],
    };

    details.set(row.id, jobDetail);
  }

  cachedJobDetails = details;
  return details;
}

function parseCompaniesCSV(): Map<string, CachedCompanyData> {
  if (cachedCompanies) return cachedCompanies;

  const csvPath = path.join(process.cwd(), 'companies.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');

  const headerLine = lines[0].replace(/^﻿/, ''); // Remove BOM
  const headers = parseCSVLine(headerLine).map(h => h.trim());

  const companies = new Map<string, CachedCompanyData>();

  // 최대 500개 항목만 로드
  for (let i = 1; i < Math.min(lines.length, 501); i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const row: RawCompanyRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    if (!row['company.id'] || !row['company.name']) continue;

    const companyId = row['company.id'];
    const logoUrl = row['company.logo_url.origin'] || row['company.logo_url.thumb'] || '';

    // images JSON 파싱
    let titleImageUrl = '';
    try {
      if (row['company.images']) {
        const images = JSON.parse(row['company.images'].replace(/\\\"/g, '"'));
        const titleImage = images.find((img: any) => img.is_title);
        if (titleImage) {
          titleImageUrl = titleImage.origin || titleImage.thumb;
        }
      }
    } catch (e) {
      // JSON 파싱 실패 시 무시
    }

    const company: Company = {
      id: companyId,
      name: row['company.name'],
      color: getCompanyColor(companyId),
      description: row['company.description'] || '',
      benefits: '',
      cultureTagIds: [],
    };

    const cachedData: CachedCompanyData = {
      company,
      logoUrl,
      titleImageUrl,
    };

    companies.set(companyId, cachedData);
  }

  cachedCompanies = companies;
  return companies;
}

export function getJobsFromCSV(): Job[] {
  return parseJobsCSV();
}

export function getJobById(id: string): JobDetail | undefined {
  const details = parseJobDetailsCSV();
  return details.get(id);
}

export function getCompanyById(id: string): CachedCompanyData | undefined {
  const companies = parseCompaniesCSV();
  return companies.get(id);
}

export function getCompaniesFromCSV(): Company[] {
  const companies = parseCompaniesCSV();
  return Array.from(companies.values()).map(c => c.company);
}

export function getCompanyLogoUrl(companyId: string): string {
  const cached = getCompanyById(companyId);
  return cached?.logoUrl || '';
}

export function getCompanyTitleImageUrl(companyId: string): string {
  const cached = getCompanyById(companyId);
  return cached?.titleImageUrl || cached?.logoUrl || '';
}

export function searchJobs(query: string): Job[] {
  const jobs = parseJobsCSV();
  const lowerQuery = query.toLowerCase();

  return jobs.filter(
    job =>
      job.position.toLowerCase().includes(lowerQuery) ||
      job.companyName.toLowerCase().includes(lowerQuery)
  );
}
