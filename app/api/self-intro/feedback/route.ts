import { NextRequest, NextResponse } from "next/server";
import { generateFeedback } from "@/lib/geminilLm";
import type { JobDetail } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, job } = body as { resumeText: string; job: JobDetail };

    if (!resumeText || !job) {
      return NextResponse.json(
        { error: "resumeText and job are required" },
        { status: 400 }
      );
    }

    // GEMINI API로부터 피드백만 생성
    const feedback = await generateFeedback(resumeText, job);

    console.log("✅ GEMINI feedback generated:", feedback);

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("❌ Feedback generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
