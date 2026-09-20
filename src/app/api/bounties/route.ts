import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth-mock";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ===== DESTRUCTURE ALL FIELDS (verified against schema.prisma) =====
    const {
      rawDescription,          // String! (TEXTAREA step) — non-nullable
      problemCategory,         // String? (OPTIONS step 1)
      bountyType,              // String  (DYNAMIC_REWARD — CASH/RESOURCE_SWAP/REV_SHARE/HYBRID)
      bountyPrizeSatang,       // Int     (DYNAMIC_REWARD — already in satang from frontend)
      bountyDescription,       // String? (DYNAMIC_REWARD — text description for non-cash)
      requesterWorkTypeId,     // String? (CASCADING_OPTIONS layer 1 — WorkType.id)
      requesterIndustryId,     // String? (CASCADING_OPTIONS layer 2 — Industry.id)
      occupationId,            // String? (MAGIC_SEARCH — selected occupation)
      skillTags,               // string[] (MAGIC_SEARCH — SkillTag IDs)
      entityType,              // String? (optional)
      primaryGap,              // String? (optional)
      urgencyState,            // String? (optional)
    } = body;

    // ===== GUARD NON-NULLABLE FIELDS (RULE 2: DYNAMIC & TYPE-SAFE FIRST) =====
    const safeRawDescription: string =
      typeof rawDescription === "string" && rawDescription.trim()
        ? rawDescription.trim()
        : "ไม่ระบุรายละเอียด";

    const safeEntityType: string =
      typeof entityType === "string" && entityType.trim() ? entityType.trim() : "INDIVIDUAL";

    const safePrimaryGap: string =
      typeof primaryGap === "string" && primaryGap.trim() ? primaryGap.trim() : "SKILL_GAP";

    const safeBountyType: string =
      ["CASH", "RESOURCE_SWAP", "REV_SHARE", "HYBRID"].includes(bountyType) ? bountyType : "CASH";

    const safeBountyPrizeSatang: number =
      typeof bountyPrizeSatang === "number" && bountyPrizeSatang >= 0
        ? Math.round(bountyPrizeSatang)
        : 0;

    // ===== GET CENTRALIZED MOCK USER =====
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ===== PREPARE SKILL TAGS M:N =====
    const problemSkillTags =
      Array.isArray(skillTags) && skillTags.length > 0
        ? {
            create: skillTags.map((tagId: string) => ({
              skillTag: { connect: { id: tagId } },
            })),
          }
        : undefined;

    // ===== CREATE ProblemNode =====
    const problemNode = await prisma.problemNode.create({
      data: {
        // Core required fields
        rawDescription: safeRawDescription,
        entityType: safeEntityType,
        primaryGap: safePrimaryGap,
        status: "OPEN",
        urgencyState:
          typeof urgencyState === "string" && urgencyState.trim()
            ? urgencyState
            : "NORMAL",

        // Step 1 — Category
        problemCategory:
          typeof problemCategory === "string" && problemCategory.trim()
            ? problemCategory.trim()
            : null,

        // Step 2 — Reward
        bountyType: safeBountyType,
        bountyPrizeSatang: safeBountyPrizeSatang,
        bountyDescription:
          typeof bountyDescription === "string" && bountyDescription.trim()
            ? bountyDescription.trim()
            : null,

        // Step 3 — Requester Profile
        requesterWorkTypeId:
          typeof requesterWorkTypeId === "string" && requesterWorkTypeId.trim()
            ? requesterWorkTypeId.trim()
            : null,
        requesterIndustryId:
          typeof requesterIndustryId === "string" && requesterIndustryId.trim()
            ? requesterIndustryId.trim()
            : null,

        // Step 5 — Skills (MAGIC_SEARCH)
        occupationId:
          typeof occupationId === "string" && occupationId.trim()
            ? occupationId.trim()
            : undefined,
        requiredSkills: problemSkillTags,

        // Requester FK
        requesterId: user.id,
      },
    });

    // ===== CREATE ProjectResource if cash bounty > 0 =====
    if (safeBountyType === "CASH" && safeBountyPrizeSatang > 0) {
      await prisma.projectResource.create({
        data: {
          problemNodeId: problemNode.id,
          providerUserId: user.id,
          resourceType: "CASH",
          description: bountyDescription || `เงินรางวัล ฿${Math.round(safeBountyPrizeSatang / 100).toLocaleString()}`,
          amountValue: safeBountyPrizeSatang / 100,
          unit: "THB",
          status: "PLEDGED",
        },
      });
    }

    return NextResponse.json({ success: true, problemNodeId: problemNode.id });
  } catch (error) {
    console.error("[POST /api/bounties] Failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bounties = await prisma.problemNode.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        occupation: true,
        resources: true,
        requiredSkills: { include: { skillTag: true } },
        requester: { select: { name: true, image: true } },
      },
    });
    return NextResponse.json({ success: true, bounties });
  } catch (error) {
    console.error("[GET /api/bounties] Failed:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
