export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().optional(),
  icon: z.string().optional(),
  macroFeePercentage: z.number().int().min(0).max(10000).optional(),
  aiPromptDirective: z.string().nullable().optional(),
  aiNodeCount: z.number().int().min(3).max(10).optional(),
  aiToneLevel: z.number().int().min(0).max(7).optional(),
  aiSmartChoices: z.string().nullable().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const updated = await prisma.industry.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update industry' }, { status: 500 });
  }
}
