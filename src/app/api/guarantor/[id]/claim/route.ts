export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const guarantor = await prisma.guarantorNode.update({
      where: { id },
      data: {
        status: 'CLAIMED',
        claimedAt: new Date()
      }
    });

    return NextResponse.json(guarantor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to claim guarantor' }, { status: 500 });
  }
}
