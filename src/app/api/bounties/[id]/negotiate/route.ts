import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-mock";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/bounties/[id]/negotiate
 * Fetch all KPI negotiations/proposals for a specific bounty
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id: bountyId } = await params;

    const negotiations = await prisma.bountyNegotiation.findMany({
      where: { bountyId },
      include: {
        solver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            avatarUrl: true,
            trustScore: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, negotiations });
  } catch (error) {
    console.error("[GET /api/bounties/[id]/negotiate] Error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูลข้อเสนอ" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bounties/[id]/negotiate
 * Submit a KPI proposal (Solver View)
 * Auth Check: Allowed for Tier 1 (USER) and Tier 2 (PROFESSIONAL), plus ADMIN
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id: bountyId } = await params;
    const body = await req.json();

    // 1. Resolve User
    const session = await auth();
    let user = session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email } })
      : null;

    if (!user) {
      user = await getCurrentUser();
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "กรุณาเข้าสู่ระบบก่อนรับงาน" },
        { status: 401 }
      );
    }

    // 2. Auth Check: Only Tier 1 (USER) and Tier 2 (PROFESSIONAL), plus ADMIN
    const allowedRoles = ["USER", "PROFESSIONAL", "ADMIN"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "สิทธิ์ไม่เพียงพอ: เฉพาะ Tier 1 (USER) และ Tier 2 (PROFESSIONAL) เท่านั้นที่สามารถรับงานและเสนอ KPI ได้",
        },
        { status: 403 }
      );
    }

    // 3. Find Bounty
    const bounty = await prisma.problemNode.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      return NextResponse.json(
        { success: false, error: "ไม่พบงานนี้ในระบบ" },
        { status: 404 }
      );
    }

    // Note: Requesters are allowed to submit KPI proposals / self-assign on their own bounties

    // 4. Validate Fields
    const { proposedKPI, timeframeDays, priceSatang, priceTHB } = body;

    if (!proposedKPI || typeof proposedKPI !== "string" || !proposedKPI.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุสิ่งที่จะส่งมอบ (KPI / Deliverables)" },
        { status: 400 }
      );
    }

    const safeDays = typeof timeframeDays === "number" && timeframeDays > 0
      ? Math.round(timeframeDays)
      : parseInt(timeframeDays, 10) || 7;

    let safeSatang: number;
    if (typeof priceSatang === "number" && priceSatang >= 0) {
      safeSatang = Math.round(priceSatang);
    } else if (typeof priceTHB === "number" && priceTHB >= 0) {
      safeSatang = Math.round(priceTHB * 100);
    } else {
      safeSatang = bounty.bountyPrizeSatang;
    }

    // 5. Create Negotiation Record
    const negotiation = await prisma.bountyNegotiation.create({
      data: {
        bountyId: bounty.id,
        solverId: user.id,
        proposedKPI: proposedKPI.trim(),
        timeframeDays: Math.max(1, safeDays),
        priceSatang: safeSatang,
        status: "PENDING",
      },
      include: {
        solver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            avatarUrl: true,
            trustScore: true,
          },
        },
      },
    });

    // 6. Update Bounty status to NEGOTIATING if currently OPEN or MATCHING
    if (bounty.status === "OPEN" || bounty.status === "MATCHING") {
      await prisma.problemNode.update({
        where: { id: bounty.id },
        data: { status: "NEGOTIATING" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "ยื่นข้อเสนอรับงานและ KPI สำเร็จ",
      negotiation,
    });
  } catch (error) {
    console.error("[POST /api/bounties/[id]/negotiate] Error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อเสนอ" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bounties/[id]/negotiate
 * Requester action: Accept or Reject a negotiation proposal
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id: bountyId } = await params;
    const body = await req.json();
    const { negotiationId, action } = body;

    if (!negotiationId || !["ACCEPT", "REJECT"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน (ต้องระบุ negotiationId และ action)" },
        { status: 400 }
      );
    }

    // 1. Resolve User (Must be Requester or ADMIN)
    const session = await auth();
    let user = session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email } })
      : null;

    if (!user) {
      user = await getCurrentUser();
    }

    const bounty = await prisma.problemNode.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      return NextResponse.json(
        { success: false, error: "ไม่พบงานนี้ในระบบ" },
        { status: 404 }
      );
    }

    const isRequester = user && (user.id === bounty.requesterId || user.role === "ADMIN");
    if (!isRequester) {
      return NextResponse.json(
        { success: false, error: "เฉพาะเจ้าของปัญหาเท่านั้นที่สามารถอนุมัติหรือปฏิเสธข้อเสนอได้" },
        { status: 403 }
      );
    }

    // 2. Find target negotiation
    const negotiation = await prisma.bountyNegotiation.findUnique({
      where: { id: negotiationId },
    });

    if (!negotiation || negotiation.bountyId !== bountyId) {
      return NextResponse.json(
        { success: false, error: "ไม่พบข้อเสนอที่ระบุในงานนี้" },
        { status: 404 }
      );
    }

    if (action === "ACCEPT") {
      // Mark accepted
      await prisma.bountyNegotiation.update({
        where: { id: negotiationId },
        data: { status: "ACCEPTED" },
      });

      // Reject all other pending proposals on this bounty
      await prisma.bountyNegotiation.updateMany({
        where: {
          bountyId,
          id: { not: negotiationId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      // Update bounty to ACTIVE with this solver and agreed KPI
      await prisma.problemNode.update({
        where: { id: bountyId },
        data: {
          solverId: negotiation.solverId,
          status: "ACTIVE",
          bountyPrizeSatang: negotiation.priceSatang,
          kpiDefinition: negotiation.proposedKPI,
          kpiAgreedAt: new Date(),
          startedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "ตกลงจ้างงานเรียบร้อยแล้ว สถานะเปลี่ยนเป็นกำลังดำเนินการ (ACTIVE)",
        status: "ACCEPTED",
      });
    } else {
      // action === "REJECT"
      await prisma.bountyNegotiation.update({
        where: { id: negotiationId },
        data: { status: "REJECTED" },
      });

      return NextResponse.json({
        success: true,
        message: "ปฏิเสธข้อเสนอเรียบร้อยแล้ว",
        status: "REJECTED",
      });
    }
  } catch (error) {
    console.error("[PATCH /api/bounties/[id]/negotiate] Error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการประมวลผลข้อเสนอ" },
      { status: 500 }
    );
  }
}
