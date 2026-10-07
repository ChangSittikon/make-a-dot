import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bountyId = searchParams.get("bountyId");
    const occupationIdParam = searchParams.get("occupationId");
    const categoryParam = searchParams.get("category");

    let occupationId = occupationIdParam;
    let problemCategory = categoryParam;
    let basePriceTHB = 0;
    let urgencyState = "NORMAL";
    let targetBountyNegotiations: { priceSatang: number }[] = [];

    // 1. Fetch reference bounty details if bountyId provided
    if (bountyId) {
      const bounty = await prisma.problemNode.findUnique({
        where: { id: bountyId },
        select: {
          occupationId: true,
          problemCategory: true,
          bountyPrizeSatang: true,
          urgencyState: true,
          negotiations: {
            select: { priceSatang: true },
          },
        },
      });

      if (bounty) {
        if (!occupationId) occupationId = bounty.occupationId;
        if (!problemCategory) problemCategory = bounty.problemCategory;
        if (bounty.bountyPrizeSatang > 0) {
          basePriceTHB = bounty.bountyPrizeSatang / 100;
        }
        if (bounty.urgencyState) urgencyState = bounty.urgencyState;
        if (bounty.negotiations) targetBountyNegotiations = bounty.negotiations;
      }
    }

    // 2. Compute Sector Demand (Quests in same occupation or category or price range)
    const demandWhere: Record<string, unknown> = {
      status: {
        in: ["OPEN", "MATCHING", "NEGOTIATING", "ACTIVE"],
      },
    };

    if (occupationId) {
      demandWhere.occupationId = occupationId;
    } else if (problemCategory) {
      demandWhere.problemCategory = problemCategory;
    } else if (basePriceTHB > 0) {
      const minSatang = Math.round(basePriceTHB * 0.5 * 100);
      const maxSatang = Math.round(basePriceTHB * 2.0 * 100);
      demandWhere.bountyPrizeSatang = { gte: minSatang, lte: maxSatang };
    }

    let sectorDemandCount = await prisma.problemNode.count({ where: demandWhere });
    if (sectorDemandCount === 0) {
      sectorDemandCount = await prisma.problemNode.count({
        where: { status: { in: ["OPEN", "MATCHING", "NEGOTIATING", "ACTIVE"] } },
      });
    }

    // 3. Compute Sector Supply (Available Solvers)
    let supplyWhere: Record<string, unknown> = {
      role: { in: ["USER", "PROFESSIONAL", "ADMIN"] },
    };

    const sectorSupplyCount = await prisma.user.count({ where: supplyWhere });

    // 4. Compute Dynamic Suggested Price per Bounty Case
    let minPriceTHB = 0;
    let maxPriceTHB = 0;
    let avgPriceTHB = 0;

    if (targetBountyNegotiations.length > 0) {
      // Case A: This specific bounty already has proposals submitted
      const prices = targetBountyNegotiations.map((n) => n.priceSatang / 100);
      const sum = prices.reduce((acc, curr) => acc + curr, 0);
      avgPriceTHB = Math.round(sum / prices.length);
      minPriceTHB = Math.min(...prices);
      maxPriceTHB = Math.max(...prices);

      // If all proposals have the same price, expand range around average
      if (minPriceTHB === maxPriceTHB) {
        minPriceTHB = Math.round(avgPriceTHB * 0.9);
        maxPriceTHB = Math.round(avgPriceTHB * 1.15);
      }
    } else if (occupationId || problemCategory) {
      // Case B: Check proposals in the same sector
      const sectorNegotiations = await prisma.bountyNegotiation.findMany({
        where: {
          bounty: {
            OR: [
              ...(occupationId ? [{ occupationId }] : []),
              ...(problemCategory ? [{ problemCategory }] : []),
            ],
          },
        },
        take: 20,
        select: { priceSatang: true },
      });

      if (sectorNegotiations.length > 0) {
        const prices = sectorNegotiations.map((n) => n.priceSatang / 100);
        const sum = prices.reduce((acc, curr) => acc + curr, 0);
        const calcAvg = Math.round(sum / prices.length);
        avgPriceTHB = basePriceTHB > 0 ? Math.round((basePriceTHB + calcAvg) / 2) : calcAvg;
        minPriceTHB = Math.min(...prices);
        maxPriceTHB = Math.max(...prices);
      } else if (basePriceTHB > 0) {
        avgPriceTHB = basePriceTHB;
        minPriceTHB = Math.round(basePriceTHB * 0.85);
        maxPriceTHB = Math.round(basePriceTHB * 1.2);
      } else {
        avgPriceTHB = 50000;
        minPriceTHB = 35000;
        maxPriceTHB = 65000;
      }
    } else if (basePriceTHB > 0) {
      // Case C: No proposals yet, use target bounty's own prize satang
      avgPriceTHB = basePriceTHB;
      minPriceTHB = Math.round(basePriceTHB * 0.85);
      maxPriceTHB = Math.round(basePriceTHB * 1.2);
    } else {
      // General fallback
      avgPriceTHB = 50000;
      minPriceTHB = 35000;
      maxPriceTHB = 65000;
    }

    if (minPriceTHB <= 0) minPriceTHB = Math.round(avgPriceTHB * 0.85);
    if (maxPriceTHB <= minPriceTHB) maxPriceTHB = Math.round(avgPriceTHB * 1.2);

    // 5. Compute Dynamic Ratio & Market State based on competition and sector demand
    const competitionCount = targetBountyNegotiations.length;
    let ratio = 0.5;

    if (competitionCount >= 2) {
      // Multiple solvers already competing on this quest -> Buyer's Market (demand fulfilled)
      ratio = 0.30 - (competitionCount * 0.05);
    } else if (competitionCount === 1) {
      ratio = 0.48;
    } else {
      // 0 proposals submitted so far
      if (urgencyState === "HOT_MISSION" || urgencyState === "CRITICAL" || urgencyState === "URGENT") {
        ratio = 0.72; // High Seller Market (urgent quest needing solver)
      } else {
        ratio = 0.60; // Moderate Seller Market
      }
    }

    // Clamp ratio between 0.12 and 0.88
    ratio = Math.max(0.12, Math.min(0.88, Number(ratio.toFixed(2))));

    let marketState: "SELLER" | "BUYER" | "BALANCED" = "BALANCED";
    let message = "";

    if (ratio > 0.55) {
      marketState = "SELLER";
      message = competitionCount === 0
        ? "เควสต์นี้ยังไม่มีผู้ยื่นข้อเสนอ (ตลาดผู้ให้บริการ) ผู้รับงานมีอำนาจต่อรอง สามารถเสนอราคาในช่วงพรีเมียมได้"
        : "ดีมานด์สูงกว่าซัพพลายในหมวดหมู่นี้ ผู้รับงานมีอำนาจต่อรอง สามารถเสนอราคาในกรอบบนได้";
    } else if (ratio < 0.45) {
      marketState = "BUYER";
      message = competitionCount >= 2
        ? "มีผู้เสนอตัวรับงานแล้วหลายราย (ตลาดผู้ว่าจ้าง) แนะนำเสนอราคาแข่งขันเพื่อเพิ่มโอกาสรับเลือก"
        : "ซัพพลายมากกว่าดีมานด์ในหมวดหมู่นี้ แนะนำเสนอราคาแข่งขันในกรอบที่เหมาะสม";
    } else {
      marketState = "BALANCED";
      message = "ตลาดอยู่ในภาวะสมดุล ดีมานด์และซัพพลายใกล้เคียงกัน ราคาเสนอสะท้อนมูลค่ามาตรฐาน";
    }

    return NextResponse.json({
      success: true,
      bountyId: bountyId || null,
      marketState,
      ratio,
      suggestedPrice: {
        min: minPriceTHB,
        max: maxPriceTHB,
        avg: avgPriceTHB,
      },
      message,
      demandCount: sectorDemandCount,
      supplyCount: sectorSupplyCount,
      competitionCount,
    });
  } catch (error) {
    console.error("[GET /api/bounties/market-pulse] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูล Market Pulse",
        marketState: "BALANCED",
        ratio: 0.5,
        suggestedPrice: { min: 30000, max: 70000, avg: 50000 },
        message: "ตลาดอยู่ในภาวะสมดุล ราคาเสนอสะท้อนมูลค่ามาตรฐาน",
      },
      { status: 500 }
    );
  }
}
