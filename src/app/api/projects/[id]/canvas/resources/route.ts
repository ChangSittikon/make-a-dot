export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addResourceSchema } from '@/lib/validations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = addResourceSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const canvas = await prisma.collaborationCanvas.findUnique({
      where: { projectId: id }
    });

    if (!canvas) {
      return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Add the new resource
      const resource = await tx.resource.create({
        data: {
          ...parsed.data,
          canvasId: canvas.id,
        },
      });

      // Get all resources for this canvas
      const allResources = await tx.resource.findMany({
        where: { canvasId: canvas.id }
      });

      const totalValueSatang = allResources.reduce((sum, r) => sum + r.equivalentValueSatang, 0);

      // Group by contributorId
      const contributorTotals = allResources.reduce((acc, r) => {
        acc[r.contributorId] = (acc[r.contributorId] || 0) + r.equivalentValueSatang;
        return acc;
      }, {} as Record<string, number>);

      // Update equity percentages in ProjectMember (basis points: 10000 = 100%)
      if (totalValueSatang > 0) {
        for (const contributorId of Object.keys(contributorTotals)) {
          const equityBasisPoints = Math.floor((contributorTotals[contributorId] / totalValueSatang) * 10000);
          
          await tx.projectMember.updateMany({
            where: {
              projectId: id,
              userId: contributorId
            },
            data: {
              equityPercentage: equityBasisPoints
            }
          });
        }
      }

      return resource;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}
