import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mock';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { vision, proposedRole } = body;

    if (!vision || !proposedRole) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify bounty exists
    const bounty = await prisma.problemNode.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!bounty) {
      return NextResponse.json({ error: 'Bounty not found' }, { status: 404 });
    }

    // Create the proposal in the DB
    const proposal = await prisma.upgradeProposal.create({
      data: {
        bountyId: resolvedParams.id,
        proposerId: user.id,
        vision,
        proposedRole,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade proposal created successfully',
      data: proposal
    });

  } catch (error) {
    console.error('Upgrade proposal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
