import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifyCustomTag, ClassificationResult } from "@/lib/aiTaxonomyClassifier";

export const dynamic = "force-dynamic";

// In-memory set for dismissed tags in this session (or persistent via metadata)
const dismissedTagsSet = new Set<string>();
// In-memory cache for AI classification to prevent repeat Gemini network calls
const aiClassificationCache = new Map<string, ClassificationResult>();

export async function GET() {
  try {
    // 1. Fetch all problem nodes with deepAttributes
    const problemNodes = await prisma.problemNode.findMany({
      select: {
        id: true,
        rawDescription: true,
        deepAttributes: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch existing official occupations and skills to avoid recommending tags that already exist
    const [existingOccs, existingSkills, industries] = await Promise.all([
      prisma.occupation.findMany({ select: { name: true } }),
      prisma.skillTag.findMany({ select: { name: true } }),
      prisma.industry.findMany({
        where: { order: { gt: 0 } },
        orderBy: { order: "asc" },
        select: { id: true, name: true, order: true },
      }),
    ]);

    const officialSet = new Set([
      ...existingOccs.map((o) => o.name.toLowerCase().trim()),
      ...existingSkills.map((s) => s.name.toLowerCase().trim()),
    ]);

    // 3. Extract all custom tags from deepAttributes
    const tagCountMap: Record<
      string,
      {
        tagName: string;
        count: number;
        sampleContext: string;
        bountyIds: string[];
      }
    > = {};

    for (const node of problemNodes) {
      if (!node.deepAttributes) continue;
      try {
        const parsed = JSON.parse(node.deepAttributes);
        const candidates: string[] = [];

        if (Array.isArray(parsed.customTags)) {
          candidates.push(...parsed.customTags);
        }
        if (Array.isArray(parsed.targetSkills)) {
          parsed.targetSkills.forEach((s: { id?: string; name?: string }) => {
            if (s?.name && (s?.id?.startsWith("custom-") || !s?.id)) {
              candidates.push(s.name);
            }
          });
        }
        if (Array.isArray(parsed.targetOccupations)) {
          parsed.targetOccupations.forEach((o: { id?: string; name?: string }) => {
            if (o?.name && (o?.id?.startsWith("custom-") || !o?.id)) {
              candidates.push(o.name);
            }
          });
        }

        candidates.forEach((raw) => {
          const clean = raw.trim();
          if (!clean || clean.length < 2) return;
          const lower = clean.toLowerCase();

          // Skip if already dismissed or already an official DB tag
          if (dismissedTagsSet.has(lower) || officialSet.has(lower)) return;

          if (!tagCountMap[lower]) {
            tagCountMap[lower] = {
              tagName: clean,
              count: 0,
              sampleContext: node.rawDescription || "",
              bountyIds: [],
            };
          }
          tagCountMap[lower].count += 1;
          if (!tagCountMap[lower].bountyIds.includes(node.id)) {
            tagCountMap[lower].bountyIds.push(node.id);
          }
        });
      } catch {}
    }

    // 4. Run AI Classification on each custom tag (with fast cache)
    const customItems = Object.values(tagCountMap);
    const analyzedTags = await Promise.all(
      customItems.map(async (item) => {
        const cacheKey = item.tagName.toLowerCase().trim();
        let aiResult: ClassificationResult;

        if (aiClassificationCache.has(cacheKey)) {
          aiResult = aiClassificationCache.get(cacheKey)!;
        } else {
          aiResult = await classifyCustomTag(
            item.tagName,
            item.sampleContext
          );
          aiClassificationCache.set(cacheKey, aiResult);
        }

        // Match with real DB industry
        const matchedIndustry = industries.find(
          (ind) => ind.order === aiResult.industryOrder
        ) || industries.find(
          (ind) => ind.name.includes(aiResult.industryName)
        ) || industries[0];

        return {
          tagName: item.tagName,
          frequency: item.count,
          bountyCount: item.bountyIds.length,
          sampleContext: item.sampleContext.slice(0, 100),
          ai: {
            industryId: matchedIndustry?.id,
            industryOrder: matchedIndustry?.order || aiResult.industryOrder,
            industryName: matchedIndustry?.name || aiResult.industryName,
            suggestedOccupation: aiResult.suggestedOccupation,
            tagType: aiResult.tagType,
            confidence: aiResult.confidence,
            reason: aiResult.reason,
          },
        };
      })
    );

    // Sort by highest frequency first
    analyzedTags.sort((a, b) => b.frequency - a.frequency);

    return NextResponse.json({
      success: true,
      pendingCount: analyzedTags.length,
      tags: analyzedTags,
    });
  } catch (error) {
    console.error("[GET /api/admin/taxonomy-learning] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tagName,
      industryId,
      industryOrder,
      suggestedOccupation,
      tagType,
    } = body;

    if (!tagName || typeof tagName !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing tagName" },
        { status: 400 }
      );
    }

    const cleanTagName = tagName.trim();

    // 1. Find the target industry
    let targetIndustry = null;
    if (industryId) {
      targetIndustry = await prisma.industry.findUnique({ where: { id: industryId } });
    }
    if (!targetIndustry && industryOrder) {
      targetIndustry = await prisma.industry.findFirst({ where: { order: Number(industryOrder) } });
    }
    if (!targetIndustry) {
      targetIndustry = await prisma.industry.findFirst({ where: { order: 3 } }); // default Tech
    }

    if (!targetIndustry) {
      return NextResponse.json(
        { success: false, error: "Target industry not found" },
        { status: 404 }
      );
    }

    // 2. Insert into DB based on tagType
    let createdItemName = cleanTagName;
    let createdCategoryType = "OCCUPATION";

    if (tagType === "SKILL") {
      // Find or create parent occupation
      const occName = (suggestedOccupation || "ผู้เชี่ยวชาญเฉพาะทาง").trim();
      let parentOcc = await prisma.occupation.findFirst({
        where: { industryId: targetIndustry.id, name: occName },
      });
      if (!parentOcc) {
        parentOcc = await prisma.occupation.create({
          data: {
            industryId: targetIndustry.id,
            name: occName,
            icon: "fa-solid fa-briefcase",
          },
        });
      }

      // Check if skill exists
      const existingSkill = await prisma.skillTag.findFirst({
        where: { occupationId: parentOcc.id, name: cleanTagName },
      });
      if (!existingSkill) {
        await prisma.skillTag.create({
          data: {
            occupationId: parentOcc.id,
            name: cleanTagName,
          },
        });
      }
      createdCategoryType = "SKILL";
    } else {
      // Create as Occupation
      const existingOcc = await prisma.occupation.findFirst({
        where: { industryId: targetIndustry.id, name: cleanTagName },
      });
      if (!existingOcc) {
        await prisma.occupation.create({
          data: {
            industryId: targetIndustry.id,
            name: cleanTagName,
            icon: "fa-solid fa-briefcase",
          },
        });
      }
      createdCategoryType = "OCCUPATION";
    }

    // 3. Mark as resolved
    dismissedTagsSet.add(cleanTagName.toLowerCase());

    return NextResponse.json({
      success: true,
      message: `อนุมัติและบรรจุแท็ก "${cleanTagName}" เป็น ${createdCategoryType} ในสายงาน [${targetIndustry.order}] ${targetIndustry.name} เรียบร้อยแล้ว`,
    });
  } catch (error) {
    console.error("[POST /api/admin/taxonomy-learning] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tagName = searchParams.get("tag");
    if (tagName) {
      dismissedTagsSet.add(tagName.toLowerCase().trim());
    }
    return NextResponse.json({ success: true, message: `เพิกเฉยแท็ก "${tagName}" เรียบร้อยแล้ว` });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
