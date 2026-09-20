import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth-mock";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "ALL";

    // Build the status filter according to the precise schema constraints
    let statusFilter: any = undefined;
    
    switch (filter) {
      case "OPEN":
        statusFilter = { in: ["OPEN", "MATCHING"] };
        break;
      case "NEGOTIATING":
        statusFilter = "NEGOTIATING";
        break;
      case "ACTIVE":
        statusFilter = { in: ["ACTIVE", "PENDING_REVIEW"] };
        break;
      case "COMPLETED":
        statusFilter = { in: ["COMPLETED", "CANCELLED", "DISPUTED"] };
        break;
      default:
        // ALL gets everything
        statusFilter = undefined;
    }

    // Fetch ProblemNode records owned by the user
    const bounties = await prisma.problemNode.findMany({
      where: {
        requesterId: user.id,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        occupation: true,
        resources: true,
        requiredSkills: {
          include: {
            skillTag: true,
          },
        },
        requester: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, bounties });
  } catch (error) {
    console.error("[GET /api/bounties/manage] Failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
