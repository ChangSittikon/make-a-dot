export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createEscrowSchema } from '@/lib/validations';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const escrow = await prisma.escrowVault.findUnique({
      where: { projectId: id },
      include: { milestones: true }
    });

    if (!escrow) {
      return NextResponse.json({ error: 'Escrow vault not found' }, { status: 404 });
    }

    return NextResponse.json(escrow);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch escrow' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = createEscrowSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { industry: { include: { domainDirector: true } } }
    });

    if (!project || !project.industry || !project.industry.domainDirector) {
      return NextResponse.json({ error: 'Project, industry or director not found' }, { status: 404 });
    }

    const { totalAmountSatang } = parsed.data;
    const { macroFeePercentage } = project.industry;
    const { profitSharePercentage } = project.industry.domainDirector;

    const platformFeeSatang = Math.floor((totalAmountSatang * macroFeePercentage) / 10000);
    const directorFeeSatang = Math.floor((platformFeeSatang * profitSharePercentage) / 10000);

    const escrow = await prisma.$transaction(async (tx) => {
      return await tx.escrowVault.create({
        data: {
          ...parsed.data,
          projectId: id,
          platformFeeSatang,
          directorFeeSatang,
        },
      });
    });

    return NextResponse.json(escrow, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create escrow' }, { status: 500 });
  }
}
