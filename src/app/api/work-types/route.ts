import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/work-types — returns all WorkType records from DB (no hardcoding)
export async function GET() {
  try {
    const workTypes = await prisma.workType.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ workTypes });
  } catch (error) {
    console.error("[/api/work-types] Failed:", error);
    return NextResponse.json({ error: "Failed to fetch work types" }, { status: 500 });
  }
}
