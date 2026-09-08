export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createEndorsementSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createEndorsementSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    if (!parsed.data.directorId) {
      return NextResponse.json({ error: 'directorId is required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const endorsement = await tx.endorsement.create({
        data: parsed.data,
      });

      if (parsed.data.isFeatured) {
        await tx.project.update({
          where: { id: parsed.data.projectId },
          data: { isEndorsed: true }
        });
      }

      return endorsement;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create endorsement' }, { status: 500 });
  }
}
