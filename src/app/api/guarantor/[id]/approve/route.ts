export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In a real system, you'd check if the user is the guarantorUser before approving
    const guarantor = await prisma.guarantorNode.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date()
      }
    });

    return NextResponse.json(guarantor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve guarantor' }, { status: 500 });
  }
}
