export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const resolveSchema = z.object({
  resolvedById: z.string(),
  action: z.enum(['RELEASE', 'REFUND'])
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ vaultId: string }> }
) {
  try {
    const { vaultId } = await params;
    const body = await request.json();
    const parsed = resolveSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { resolvedById, action } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const status = action === 'RELEASE' ? 'FULLY_RELEASED' : 'REFUNDED';
      
      const updatedEscrow = await tx.escrowVault.update({
        where: { id: vaultId },
        data: {
          status,
          resolvedById,
          resolvedAt: new Date(),
          frozenSatang: 0
        }
      });

      if (action === 'RELEASE') {
        const milestones = await tx.milestone.findMany({
          where: { escrowId: vaultId, status: 'DISPUTED' }
        });

        const releaseAmount = milestones.reduce((sum, m) => sum + m.amountSatang, 0);

        await tx.milestone.updateMany({
          where: { escrowId: vaultId, status: 'DISPUTED' },
          data: { status: 'APPROVED', approvedAt: new Date() }
        });

        await tx.escrowVault.update({
          where: { id: vaultId },
          data: { releasedSatang: updatedEscrow.releasedSatang + releaseAmount }
        });
      }

      return updatedEscrow;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve dispute' }, { status: 500 });
  }
}
