export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ vaultId: string, milestoneId: string }> }
) {
  try {
    const { vaultId, milestoneId } = await params;
    
    const result = await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date()
        }
      });

      const escrow = await tx.escrowVault.findUnique({
        where: { id: vaultId },
        include: { 
          milestones: true,
          project: {
            include: { industry: { include: { domainDirector: true } } }
          }
        }
      });

      if (!escrow) throw new Error('Escrow not found');

      const allApproved = escrow.milestones.every(m => m.status === 'APPROVED');
      const newReleasedSatang = escrow.releasedSatang + milestone.amountSatang;

      await tx.escrowVault.update({
        where: { id: vaultId },
        data: {
          releasedSatang: newReleasedSatang,
          status: allApproved ? 'FULLY_RELEASED' : escrow.status
        }
      });

      // Calculate proportional director fee for this milestone
      const proportion = milestone.amountSatang / escrow.totalAmountSatang;
      const proportionalDirectorFee = Math.floor(escrow.directorFeeSatang * proportion);

      const directorId = escrow.project?.industry?.domainDirector?.id;
      if (directorId && proportionalDirectorFee > 0) {
        await tx.domainDirector.update({
          where: { id: directorId },
          data: {
            totalEarnedSatang: { increment: proportionalDirectorFee }
          }
        });
      }

      return milestone;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve milestone' }, { status: 500 });
  }
}
