import { NextResponse } from "next/server";

import { getJobById, getCompanyById } from "@/lib/csvLoader";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = getJobById(id);

    if (!job) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "존재하지 않는 공고입니다." } },
        { status: 404 }
      );
    }

    // 회사 이미지 정보 추가
    const company = getCompanyById(job.companyId);
    const enrichedJob = {
      ...job,
      companyLogoUrl: company?.logoUrl || '',
      companyTitleImageUrl: company?.titleImageUrl || '',
    };

    return NextResponse.json(enrichedJob);
  } catch (error) {
    console.error("Error fetching job from CSV:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "공고 정보를 불러올 수 없습니다." } },
      { status: 500 }
    );
  }
}
