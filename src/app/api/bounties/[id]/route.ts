import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getCurrentUser } from '@/lib/auth-mock';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    let currentUserId: string | undefined = session?.user?.id;
    if (!currentUserId) {
      const mockUser = await getCurrentUser();
      currentUserId = mockUser?.id;
    }
    if (!currentUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const resolvedParams = await params;
    const problemNodeId = resolvedParams.id;

    // 1. จัดการอัปเดต 'ค่าชี้เป้า' (Scout Reward) ใน deepAttributes
    if (body.scoutReward !== undefined) {
      const existing = await prisma.problemNode.findUnique({
        where: { id: problemNodeId },
        select: { deepAttributes: true }
      });

      let deep: Record<string, unknown> = {};
      if (existing?.deepAttributes) {
        try {
          deep = JSON.parse(existing.deepAttributes);
        } catch {
          deep = {};
        }
      }

      if (typeof body.scoutReward === 'string' && body.scoutReward.trim()) {
        deep.scoutReward = body.scoutReward.trim();
      } else {
        delete deep.scoutReward;
      }

      const updatedNode = await prisma.problemNode.update({
        where: { id: problemNodeId },
        data: {
          deepAttributes: JSON.stringify(deep)
        }
      });

      return NextResponse.json({ success: true, problemNode: updatedNode });
    }

    // 2. จัดการเจรจางานและบันทึก KPI
    const { kpiDefinition, contractBindingType } = body;

    // Start a transaction: Update ProblemNode to NEGOTIATING, Create/Update ContractBinding
    const [updatedNode] = await prisma.$transaction([
      prisma.problemNode.update({
        where: { id: problemNodeId },
        data: {
          status: 'NEGOTIATING',
          kpiDefinition: JSON.stringify(kpiDefinition),
          solverId: currentUserId // The solver accepts the negotiation
        }
      }),
      prisma.contractBinding.upsert({
        where: { problemNodeId: problemNodeId },
        update: {
          bindingType: contractBindingType,
          status: 'PROPOSED'
        },
        create: {
          problemNodeId: problemNodeId,
          bindingType: contractBindingType,
          status: 'PROPOSED'
        }
      })
    ]);

    return NextResponse.json({ success: true, problemNode: updatedNode });
  } catch (error) {
    console.error('Failed to negotiate bounty:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const problemNodeId = resolvedParams.id;
    const bounty = await prisma.problemNode.findUnique({
      where: { id: problemNodeId },
      include: {
        occupation: true,
        resources: true,
        requester: { select: { name: true } }
      }
    });

    if (!bounty) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, bounty });
  } catch (error) {
    console.error('Failed to fetch bounty:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
