import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { scenarioType } = body; // BEST_CASE, EXPECTED, WORST_CASE

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        escrow: true,
        guarantor: true,
        members: true
      }
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Calculate outcomes based on scenario
    let projectedRevenue = 0;
    let escrowStatus = 'PENDING';
    let guarantorClaimed = false;
    let impactSummary = '';

    const budget = project.budgetSatang || 0;

    if (scenarioType === 'BEST_CASE') {
      projectedRevenue = Math.floor(budget * 1.5); // 150% return
      escrowStatus = 'FULLY_RELEASED';
      impactSummary = 'โครงการบรรลุเป้าหมายสูงสุด สมาชิกทุกคนได้รับส่วนแบ่ง 150% ตามสัดส่วน Equity, ไม่มีการฟ้องร้อง, ไม่ต้องดึงเงินค้ำประกัน';
    } else if (scenarioType === 'EXPECTED') {
      projectedRevenue = budget; // 100% return
      escrowStatus = 'FULLY_RELEASED';
      impactSummary = 'โครงการเป็นไปตามแผน สมาชิกได้รับส่วนแบ่งตามปกติ, Escrow ปล่อยเงินครบถ้วน';
    } else if (scenarioType === 'WORST_CASE') {
      projectedRevenue = Math.floor(budget * 0.2); // 20% return
      escrowStatus = 'DISPUTED';
      guarantorClaimed = true;
      impactSummary = 'งานมีปัญหาขัดแย้งรุนแรง! เงิน Escrow ถูกอายัด, ต้องยึดเงิน/ทรัพย์สินค้ำประกันจาก Guarantor เพื่อชดเชยความเสียหายให้ผู้ที่เกี่ยวข้อง';
    } else {
      return NextResponse.json({ error: 'Invalid scenario type' }, { status: 400 });
    }

    // Save simulation
    const simulation = await prisma.projectSimulation.create({
      data: {
        projectId: id,
        scenarioType,
        projectedRevenueSatang: projectedRevenue,
        escrowStatus,
        guarantorClaimed,
        impactSummary
      }
    });

    return NextResponse.json(simulation);
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: 'Failed to run simulation' }, { status: 500 });
  }
}
