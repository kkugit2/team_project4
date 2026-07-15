import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOBS } from "@/data/mockJobs";

// 원티드 /jobs 목록 프록시 경계. 지금은 목업을 반환하지만, 실제 연동 시
// 이 파일 내부에서만 원티드 API 호출(+ job_cache 조회)로 바꾸면 된다.
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const skillTagsParam = request.nextUrl.searchParams.get("skillTags");
  const skillTags = skillTagsParam ? skillTagsParam.split(",").map(Number) : null;

  let jobs = MOCK_JOBS;
  if (category) jobs = jobs.filter((j) => j.category === category);
  if (skillTags && skillTags.length) {
    jobs = jobs.filter((j) => j.skillTagIds.some((id) => skillTags.includes(id)));
  }

  return NextResponse.json(jobs);
}
