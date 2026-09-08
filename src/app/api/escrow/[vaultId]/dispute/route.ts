export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { disputeSchema } from '@/lib/validations';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ vaultId: string }> }
) {
  try {
    const { vaultId } = await params;
    const body = await request.json();
    const parsed = disputeSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrowVault.findUnique({ where: { id: vaultId } });
      if (!escrow) throw new Error('Escrow not found');

      const frozenSatang = escrow.totalAmountSatang - escrow.releasedSatang;

      const updatedEscrow = await tx.escrowVault.update({
        where: { id: vaultId },
        data: {
          status: 'DISPUTED',
          disputeReason: parsed.data.reason,
          disputedAt: new Date(),
          frozenSatang
        }
      });

      await tx.milestone.updateMany({
        where: { escrowId: vaultId, status: { in: ['LOCKED', 'PENDING_REVIEW'] } },
        data: { status: 'DISPUTED' }
      });

      return updatedEscrow;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dispute escrow' }, { status: 500 });
  }
}
