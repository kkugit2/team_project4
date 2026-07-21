import { NextRequest, NextResponse } from "next/server";

import { searchJobs } from "@/lib/csvLoader";


export async function GET(request: NextRequest) {
  try {
    const query = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();
    if (!query) return NextResponse.json({ jobs: [], companies: [] });

    const jobs = searchJobs(query);

    // TODO: Supabase와 연동 시 실제 회사 데이터를 검색
    const companies: any[] = [];

    return NextResponse.json({ jobs, companies });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
