export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGuarantorSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = createGuarantorSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const guarantor = await prisma.guarantorNode.create({
      data: {
        ...parsed.data,
        projectId: id,
      },
    });

    return NextResponse.json(guarantor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create guarantor request' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const guarantor = await prisma.guarantorNode.update({
      where: { projectId: id },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date()
      }
    });

    return NextResponse.json(guarantor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve guarantor' }, { status: 500 });
  }
}
