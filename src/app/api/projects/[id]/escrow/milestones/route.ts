export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMilestoneSchema } from '@/lib/validations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = createMilestoneSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const escrow = await prisma.escrowVault.findUnique({
      where: { projectId: id }
    });

    if (!escrow) {
      return NextResponse.json({ error: 'Escrow vault not found' }, { status: 404 });
    }

    const milestone = await prisma.milestone.create({
      data: {
        ...parsed.data,
        escrowId: escrow.id,
      },
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add milestone' }, { status: 500 });
  }
}
