import { NextRequest, NextResponse } from "next/server";

import { getJobsFromCSV, getCompanyLogoUrl } from "@/lib/csvLoader";


export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const skillTagsParam = request.nextUrl.searchParams.get("skillTags");
    const skillTags = skillTagsParam ? skillTagsParam.split(",").map(Number) : null;

    let jobs = getJobsFromCSV();

    if (category) {
      jobs = jobs.filter((j) => j.category === category);
    }
    if (skillTags && skillTags.length) {
      jobs = jobs.filter((j) => j.skillTagIds.some((id) => skillTags.includes(id)));
    }

    // 회사 로고 URL을 추가
    const enrichedJobs = jobs.map(job => ({
      ...job,
      companyLogoUrl: getCompanyLogoUrl(job.companyId),
    }));

    return NextResponse.json(enrichedJobs);
  } catch (error) {
    console.error("Error fetching jobs from CSV:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
