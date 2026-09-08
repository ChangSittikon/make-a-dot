export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCanvasSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const canvas = await prisma.collaborationCanvas.findUnique({
      where: { projectId: id },
      include: { resources: true }
    });

    if (!canvas) {
      return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
    }

    return NextResponse.json(canvas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch canvas' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = createCanvasSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const canvas = await prisma.collaborationCanvas.create({
      data: {
        ...parsed.data,
        projectId: id,
      },
    });

    return NextResponse.json(canvas, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create canvas' }, { status: 500 });
  }
}

const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PROPOSED', 'COUNTERED', 'SIGNED']),
  splitType: z.enum(['REVENUE_SHARE', 'FLAT_FEE', 'HYBRID']).optional(),
  hasBreakeven: z.boolean().optional(),
  breakevenAmountSatang: z.number().int().min(0).optional()
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { status, splitType, hasBreakeven, breakevenAmountSatang } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const data: any = { status };
      if (status === 'SIGNED') {
        data.signedAt = new Date();
      }
      if (splitType) data.splitType = splitType;
      if (hasBreakeven !== undefined) data.hasBreakeven = hasBreakeven;
      if (breakevenAmountSatang !== undefined) data.breakevenAmountSatang = breakevenAmountSatang;

      const canvas = await tx.collaborationCanvas.update({
        where: { projectId: id },
        data,
      });

      // Auto-create Escrow if Signed
      if (status === 'SIGNED') {
        const existingEscrow = await tx.escrowVault.findUnique({ where: { projectId: id } });
        if (!existingEscrow) {
           const project = await tx.project.findUnique({
             where: { id },
             include: { industry: { include: { domainDirector: true } } }
           });
           
           if (project && project.industry && project.industry.domainDirector) {
              const platformFeeSatang = Math.floor((project.budgetSatang * project.industry.macroFeePercentage) / 10000);
              const directorFeeSatang = Math.floor((platformFeeSatang * project.industry.domainDirector.profitSharePercentage) / 10000);
              
              await tx.escrowVault.create({
                data: {
                  projectId: id,
                  totalAmountSatang: project.budgetSatang,
                  platformFeeSatang,
                  directorFeeSatang,
                  status: 'PENDING'
                }
              });
           }
        }
      }

      return canvas;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update canvas' }, { status: 500 });
  }
}
