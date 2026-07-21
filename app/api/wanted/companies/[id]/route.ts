import { NextResponse } from "next/server";

import { findCompanyById } from "@/data/dummyData";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = findCompanyById(id);
  if (!company) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "존재하지 않는 회사입니다." } }, { status: 404 });
  }
  return NextResponse.json(company);
}
