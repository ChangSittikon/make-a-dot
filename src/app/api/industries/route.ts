import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/industries — returns ALL top-level Industry records dynamically
export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      where: { parentId: null },
      select: { id: true, name: true, icon: true, domainDirector: true },
      orderBy: { order: "asc" },
    });
    // Return array directly to match existing FlowApp.tsx expectation
    return NextResponse.json(industries);
  } catch (error) {
    console.error("[/api/industries] Failed:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}
