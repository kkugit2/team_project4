import { NextResponse } from "next/server";

import { getCompanyById } from "@/lib/csvLoader";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cachedData = getCompanyById(id);

    if (!cachedData) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "존재하지 않는 회사입니다." } },
        { status: 404 }
      );
    }

    // 회사 정보와 이미지 URL을 함께 반환
    const response = {
      ...cachedData.company,
      logoUrl: cachedData.logoUrl,
      titleImageUrl: cachedData.titleImageUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching company from CSV:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "회사 정보를 불러올 수 없습니다." } },
      { status: 500 }
    );
  }
}
