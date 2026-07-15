import { NextResponse } from "next/server";

import { findJobById } from "@/data/dummyData";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = findJobById(id);
  if (!job) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "존재하지 않는 공고입니다." } }, { status: 404 });
  }
  return NextResponse.json(job);
}
