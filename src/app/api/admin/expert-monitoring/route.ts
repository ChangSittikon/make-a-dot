import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/auth-mock";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    let user = session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email } })
      : null;

    if (!user) {
      user = await getCurrentUser();
    }

    // Fetch all problem nodes with full relations
    const [problemNodes, industries, workTypes] = await Promise.all([
      prisma.problemNode.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              trustScore: true,
              role: true,
            },
          },
          occupation: {
            include: {
              industry: { select: { id: true, name: true } },
            },
          },
          requiredSkills: {
            include: {
              skillTag: true,
            },
          },
          solver: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          upgradeProposals: {
            select: {
              id: true,
              status: true,
              proposedRole: true,
              proposer: {
                select: { name: true },
              },
            },
          },
          resources: true,
          matchLogs: {
            select: {
              id: true,
              matchScore: true,
              matchReason: true,
              status: true,
              solver: { select: { name: true } },
            },
          },
        },
      }),
      prisma.industry.findMany({ select: { id: true, name: true } }),
      prisma.workType.findMany({ select: { id: true, name: true } }),
    ]);

    const industryMap = new Map(industries.map((i) => [i.id, i.name]));
    const workTypeMap = new Map(workTypes.map((w) => [w.id, w.name]));

    // Aggregations
    let totalPrizeSatang = 0;
    let taggedCount = 0;
    const occupationCountMap: Record<string, { name: string; count: number; industryName?: string }> = {};
    const skillCountMap: Record<string, { name: string; count: number }> = {};
    const statusMap: Record<string, number> = {};
    const urgencyMap: Record<string, number> = {};
    const rewardTypeMap: Record<string, number> = {};
    const requesterIndustryMap: Record<string, number> = {};

    const formattedBounties = problemNodes.map((node) => {
      totalPrizeSatang += node.bountyPrizeSatang || 0;

      // Status count
      statusMap[node.status] = (statusMap[node.status] || 0) + 1;

      // Urgency count
      urgencyMap[node.urgencyState] = (urgencyMap[node.urgencyState] || 0) + 1;

      // Reward type count
      rewardTypeMap[node.bountyType] = (rewardTypeMap[node.bountyType] || 0) + 1;

      // Parse deepAttributes for rich Step 5 target occupations/skills
      let targetOccupations: { id?: string; name: string }[] = [];
      let targetSkills: { id?: string; name: string }[] = [];
      let customTags: string[] = [];

      if (node.occupation) {
        targetOccupations.push({
          id: node.occupation.id,
          name: node.occupation.name,
        });
      }

      if (Array.isArray(node.requiredSkills)) {
        node.requiredSkills.forEach((rs) => {
          if (rs.skillTag?.name) {
            targetSkills.push({
              id: rs.skillTag.id,
              name: rs.skillTag.name,
            });
          }
        });
      }

      if (node.deepAttributes) {
        try {
          const parsed = JSON.parse(node.deepAttributes);
          if (Array.isArray(parsed.targetOccupations)) {
            parsed.targetOccupations.forEach((occ: { id?: string; name?: string }) => {
              if (occ?.name && !targetOccupations.some((o) => o.name.toLowerCase() === occ.name!.toLowerCase())) {
                targetOccupations.push({ id: occ.id, name: occ.name });
              }
            });
          }
          if (Array.isArray(parsed.targetSkills)) {
            parsed.targetSkills.forEach((sk: { id?: string; name?: string }) => {
              if (sk?.name && !targetSkills.some((s) => s.name.toLowerCase() === sk.name!.toLowerCase())) {
                targetSkills.push({ id: sk.id, name: sk.name });
              }
            });
          }
          if (Array.isArray(parsed.customTags)) {
            customTags = parsed.customTags;
          }
        } catch {}
      }

      // Check if tagged
      const isTagged = targetOccupations.length > 0 || targetSkills.length > 0;
      if (isTagged) taggedCount++;

      // Count occupations
      targetOccupations.forEach((occ) => {
        const key = occ.name.trim();
        if (!occupationCountMap[key]) {
          occupationCountMap[key] = {
            name: key,
            count: 0,
            industryName: node.occupation?.industry?.name,
          };
        }
        occupationCountMap[key].count += 1;
      });

      // Count skills
      targetSkills.forEach((sk) => {
        const key = sk.name.trim();
        if (!skillCountMap[key]) {
          skillCountMap[key] = { name: key, count: 0 };
        }
        skillCountMap[key].count += 1;
      });

      // Requester Industry mapping
      const reqIndustryName = node.requesterIndustryId
        ? industryMap.get(node.requesterIndustryId) || "ไม่ระบุวงการ"
        : "ไม่ระบุวงการ";
      requesterIndustryMap[reqIndustryName] = (requesterIndustryMap[reqIndustryName] || 0) + 1;

      const reqWorkTypeName = node.requesterWorkTypeId
        ? workTypeMap.get(node.requesterWorkTypeId) || "ไม่ระบุประเภทงาน"
        : "ไม่ระบุประเภทงาน";

      return {
        id: node.id,
        rawDescription: node.rawDescription,
        problemCategory: node.problemCategory,
        status: node.status,
        urgencyState: node.urgencyState,
        bountyType: node.bountyType,
        bountyPrizeSatang: node.bountyPrizeSatang,
        bountyDescription: node.bountyDescription,
        requester: node.requester,
        requesterIndustryName: reqIndustryName,
        requesterWorkTypeName: reqWorkTypeName,
        targetOccupations,
        targetSkills,
        customTags,
        isTagged,
        solver: node.solver,
        upgradeProposalsCount: node.upgradeProposals.length,
        upgradeProposals: node.upgradeProposals,
        resourcesCount: node.resources.length,
        matchLogs: node.matchLogs,
        createdAt: node.createdAt,
      };
    });

    const topOccupations = Object.values(occupationCountMap)
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        ...item,
        percentage: problemNodes.length > 0 ? Math.round((item.count / problemNodes.length) * 100) : 0,
      }));

    const topSkills = Object.values(skillCountMap)
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        ...item,
        percentage: problemNodes.length > 0 ? Math.round((item.count / problemNodes.length) * 100) : 0,
      }));

    const summary = {
      totalBounties: problemNodes.length,
      taggedCount,
      taggedPercentage: problemNodes.length > 0 ? Math.round((taggedCount / problemNodes.length) * 100) : 0,
      totalPrizeSatang,
      totalPrizeTHB: totalPrizeSatang / 100,
      statusCounts: statusMap,
      urgencyCounts: urgencyMap,
      rewardTypeCounts: rewardTypeMap,
      requesterIndustryCounts: requesterIndustryMap,
    };

    return NextResponse.json({
      success: true,
      summary,
      topOccupations,
      topSkills,
      bounties: formattedBounties,
    });
  } catch (error) {
    console.error("[GET /api/admin/expert-monitoring] Failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
