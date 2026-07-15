import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOBS } from "@/data/mockJobs";
import { MOCK_COMPANIES } from "@/data/mockCompanies";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();
  if (!query) return NextResponse.json({ jobs: [], companies: [] });

  const jobs = MOCK_JOBS.filter(
    (j) => j.position.toLowerCase().includes(query) || j.companyName.toLowerCase().includes(query)
  );
  const companies = MOCK_COMPANIES.filter((c) => c.name.toLowerCase().includes(query));

  return NextResponse.json({ jobs, companies });
}
