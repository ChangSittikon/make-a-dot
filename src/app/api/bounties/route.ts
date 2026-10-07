import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-mock";
import { auth } from "@/auth";
import { VALID_IMPACT_SCALES } from "@/config/taxonomy";

export const dynamic = "force-dynamic";

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
      requesterWorkTypeName,   // String? (CASCADING_OPTIONS layer 1 name)
      requesterIndustryName,   // String? (CASCADING_OPTIONS layer 2 name)
      occupationId,            // String? (MAGIC_SEARCH — selected occupation)
      skillTags,               // string[] (MAGIC_SEARCH — SkillTag IDs)
      selectedOccupations,     // Array of { id: string, name: string }
      selectedSkills,          // Array of { id: string, name: string }
      entityType,              // String? (optional)
      primaryGap,              // String? (optional)
      urgencyState,            // String? (optional)
      deepAttributes,          // String? or Object
      impactScale,
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

    const safeImpactScale: string =
      typeof impactScale === "string" && VALID_IMPACT_SCALES.includes(impactScale.toUpperCase() as any)
        ? impactScale.toUpperCase()
        : "LOCAL";

    // ===== GET AUTH / CENTRALIZED MOCK USER =====
    const session = await auth();
    let user = session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email } })
      : null;

    if (!user) {
      user = await getCurrentUser();
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ===== SANITIZE OCCUPATION ID (PREVENT P2003 FOREIGN KEY ERROR) =====
    let targetOccId = typeof occupationId === "string" ? occupationId.trim() : undefined;
    if (!targetOccId && Array.isArray(selectedOccupations) && selectedOccupations.length > 0) {
      targetOccId = selectedOccupations[0]?.id;
    }

    let safeOccupationId: string | undefined = undefined;
    if (targetOccId && !targetOccId.startsWith("custom-")) {
      const occExists = await prisma.occupation.findUnique({
        where: { id: targetOccId },
        select: { id: true },
      });
      if (occExists) {
        safeOccupationId = occExists.id;
      }
    }

    // ===== SANITIZE SKILL TAGS (M:N) =====
    const candidateSkillIds: string[] = [];
    if (Array.isArray(skillTags)) {
      candidateSkillIds.push(...skillTags);
    }
    if (Array.isArray(selectedSkills)) {
      candidateSkillIds.push(...selectedSkills.map((s: { id: string }) => s.id));
    }

    let validSkillTags: { skillTag: { connect: { id: string } } }[] = [];
    const cleanIds = Array.from(new Set(candidateSkillIds)).filter(
      (id): id is string => typeof id === "string" && id.trim() !== "" && !id.startsWith("custom-")
    );
    if (cleanIds.length > 0) {
      const existingSkills = await prisma.skillTag.findMany({
        where: { id: { in: cleanIds } },
        select: { id: true },
      });
      validSkillTags = existingSkills.map((s) => ({
        skillTag: { connect: { id: s.id } },
      }));
    }

    const problemSkillTags =
      validSkillTags.length > 0 ? { create: validSkillTags } : undefined;

    // ===== ASSEMBLE DEEP ATTRIBUTES (PRESERVE ALL STEP 5 SELECTIONS FOR MATCHMAKING) =====
    const deepData: Record<string, unknown> = {};
    if (typeof deepAttributes === "string" && deepAttributes.trim()) {
      try {
        Object.assign(deepData, JSON.parse(deepAttributes));
      } catch {
        deepData.rawAttributes = deepAttributes;
      }
    } else if (typeof deepAttributes === "object" && deepAttributes !== null) {
      Object.assign(deepData, deepAttributes);
    }

    if (Array.isArray(selectedOccupations) && selectedOccupations.length > 0) {
      deepData.targetOccupations = selectedOccupations;
    }
    if (Array.isArray(selectedSkills) && selectedSkills.length > 0) {
      deepData.targetSkills = selectedSkills;

      // Automatically capture custom tags for AI taxonomy learning
      const extractedCustomTags = selectedSkills
        .filter((s: { id?: string; name?: string }) => s?.id?.startsWith("custom-") || (s?.name && !s?.id))
        .map((s: { name: string }) => s.name.trim())
        .filter(Boolean);

      if (extractedCustomTags.length > 0) {
        const existingCustom = Array.isArray(deepData.customTags) ? deepData.customTags : [];
        deepData.customTags = Array.from(new Set([...existingCustom, ...extractedCustomTags]));
      }
    }

    if (typeof requesterWorkTypeName === "string" && requesterWorkTypeName.trim()) {
      deepData.requesterWorkTypeName = requesterWorkTypeName.trim();
    }
    if (typeof requesterIndustryName === "string" && requesterIndustryName.trim()) {
      deepData.requesterIndustryName = requesterIndustryName.trim();
    }

    // ===== CREATE ProblemNode =====
    const problemNode = await prisma.problemNode.create({
      data: {
        // Core required fields
        rawDescription: safeRawDescription,
        entityType: safeEntityType,
        primaryGap: safePrimaryGap,
        status: "OPEN",
        impactScale: safeImpactScale,
        urgencyState:
          typeof urgencyState === "string" && urgencyState.trim()
            ? urgencyState
            : "NORMAL",

        // Deep Attributes (all Step 5 roles & skills preserved)
        deepAttributes: Object.keys(deepData).length > 0 ? JSON.stringify(deepData) : null,

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
        occupationId: safeOccupationId,
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

    return NextResponse.json({ success: true, problemNodeId: problemNode.id, userProfileId: user.id });
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
      where: {
        status: {
          in: ["OPEN", "MATCHING", "NEGOTIATING"],
        },
      },
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
