import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ industryId: string }> }
) {
  const { industryId } = await params;
  try {
    const nodes = await prisma.node.findMany({
      where: { industryId },
      include: {
        options: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(nodes);
  } catch (error) {
    console.error('GET flow error:', error);
    return NextResponse.json({ error: 'Failed to fetch flow' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ industryId: string }> }
) {
  const { industryId } = await params;
  try {
    const json = await request.json();
    const { nodes } = json;

    await prisma.$transaction(async (tx) => {
      // Step 1: Delete options first (avoid orphan FK issues)
      await tx.option.deleteMany({
        where: { node: { industryId } }
      });

      // Step 2: Delete all nodes
      await tx.node.deleteMany({
        where: { industryId }
      });

      // Step 3: Create all nodes (without options)
      for (const node of nodes) {
        await tx.node.create({
          data: {
            id: node.id,
            industryId,
            type: node.type,
            question: node.question,
            order: node.order,
            inputType: node.inputType || null,
            fieldName: node.fieldName || null,
            suggestions: node.suggestions || null,
          }
        });
      }

      // Step 4: Create all options (all node IDs now exist)
      for (const node of nodes) {
        if (node.options && node.options.length > 0) {
          for (const opt of node.options) {
            await tx.option.create({
              data: {
                id: opt.id,
                nodeId: node.id,
                label: opt.label,
                icon: opt.icon || null,
                order: opt.order ?? 0,
                targetNodeId: opt.targetNodeId || null
              }
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT flow error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
