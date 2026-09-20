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

    // Update status
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    
    const updatedProposal = await prisma.upgradeProposal.update({
      where: { id: proposal.id },
      data: { status: newStatus }
    });

    // TODO: If APPROVE, execute Rollover logic and create Project
    
    return NextResponse.json({ 
      success: true, 
      message: `Proposal ${newStatus.toLowerCase()} successfully`,
      data: updatedProposal
    });

  } catch (error) {
    console.error('Proposal action error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
