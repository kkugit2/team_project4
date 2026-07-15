import { NextResponse } from "next/server";
import { SKILL_TAGS, CATEGORY_TAGS, ATTRACTION_TAGS } from "@/data/dummyData";
import type { TagType } from "@/types";

const TAG_MAP: Record<TagType, typeof SKILL_TAGS> = {
  skill: SKILL_TAGS,
  category: CATEGORY_TAGS,
  attraction: ATTRACTION_TAGS,
};

export async function GET(_request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const tags = TAG_MAP[type as TagType];
  if (!tags) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "알 수 없는 태그 타입입니다." } }, { status: 404 });
  }
  return NextResponse.json(tags);
}
