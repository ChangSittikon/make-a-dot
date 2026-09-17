import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { kpiDefinition, contractBindingType } = await request.json();
    const resolvedParams = await params;
    const problemNodeId = resolvedParams.id;

    // Start a transaction: Update ProblemNode to NEGOTIATING, Create/Update ContractBinding
    const [updatedNode] = await prisma.$transaction([
      prisma.problemNode.update({
        where: { id: problemNodeId },
        data: {
          status: 'NEGOTIATING',
          kpiDefinition: JSON.stringify(kpiDefinition),
          solverId: session.user.id // The solver accepts the negotiation
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
