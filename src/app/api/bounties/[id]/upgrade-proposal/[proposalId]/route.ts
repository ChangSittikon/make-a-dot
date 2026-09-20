import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mock';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string, proposalId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body; // 'APPROVE' or 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Verify bounty exists and user is the requester
    const bounty = await prisma.problemNode.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!bounty) {
      return NextResponse.json({ error: 'Bounty not found' }, { status: 404 });
    }

    if (bounty.requesterId !== user.id) {
      return NextResponse.json({ error: 'Only the requester can approve or reject proposals' }, { status: 403 });
    }

    // Verify proposal exists
    const proposal = await prisma.upgradeProposal.findUnique({
      where: { id: resolvedParams.proposalId }
    });

    if (!proposal || proposal.bountyId !== bounty.id) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (action === 'REJECT') {
      const updatedProposal = await prisma.upgradeProposal.update({
        where: { id: proposal.id },
        data: { status: 'REJECTED' }
      });
      return NextResponse.json({ success: true, message: 'Proposal rejected', data: updatedProposal });
    }

    // --- APPROVAL & CONVERSION ENGINE LOGIC ---

    // 1. Update this proposal to APPROVED, and others to REJECTED
    await prisma.$transaction(async (tx) => {
      // Approve selected
      await tx.upgradeProposal.update({
        where: { id: proposal.id },
        data: { status: 'APPROVED' }
      });
      // Reject others
      await tx.upgradeProposal.updateMany({
        where: { bountyId: bounty.id, id: { not: proposal.id } },
        data: { status: 'REJECTED' }
      });

      // Ensure mock industry exists
      const mockIndustry = await tx.industry.upsert({
        where: { id: 'mock-industry' },
        update: {},
        create: { id: 'mock-industry', name: 'Technology' }
      });

      // 2. Create new Project Entity
      const newProject = await tx.project.create({
        data: {
          title: `Project: ${bounty.rawDescription.substring(0, 30)}...`,
          description: `Upgraded from Bounty ${bounty.id}. Vision: ${proposal.vision}`,
          industryId: mockIndustry.id,
          ownerId: bounty.requesterId,
          status: 'ACTIVE',
          budgetSatang: bounty.bountyPrizeSatang,
        }
      });

      // Add proposer as a ProjectMember
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: proposal.proposerId,
          role: proposal.proposedRole,
          revSharePercentage: proposal.proposedRole === 'SWEAT_SHARE' ? 10 : 5,
        }
      });

      // 3. ROLLOVER LOGIC: Move Bounty Escrow to Project Contribution
      // In a real scenario, we check if requester has a wallet and reduce lockedBalance.
      // Here we simulate the ledger transaction.
      let wallet = await tx.wallet.findUnique({ where: { userId: bounty.requesterId } });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId: bounty.requesterId, balance: 10000000, lockedBalance: bounty.bountyPrizeSatang }
        });
      }

      await tx.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          amount: bounty.bountyPrizeSatang,
          type: 'TRANSFER',
          status: 'COMPLETED',
          referenceId: newProject.id
        }
      });

      // Reduce locked balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { lockedBalance: { decrement: bounty.bountyPrizeSatang } }
      });

      // 4. Update ProblemNode linkage
      await tx.problemNode.update({
        where: { id: bounty.id },
        data: { upgradedToProjectId: newProject.id }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Project upgraded and funds rolled over successfully!',
    });

  } catch (error) {
    console.error('Proposal action error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
