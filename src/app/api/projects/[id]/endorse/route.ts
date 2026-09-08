export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const endorseSchema = z.object({
  directorId: z.string(),
  message: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = endorseSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { directorId, message } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      // Create the endorsement
      const endorsement = await tx.endorsement.create({
        data: {
          projectId: id,
          directorId,
          message: message || 'Endorsed this project.'
        }
      });

      // Update project to isEndorsed
      await tx.project.update({
        where: { id },
        data: { isEndorsed: true }
      });

      return endorsement;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Endorsement error:", error);
    return NextResponse.json({ error: 'Failed to endorse project' }, { status: 500 });
  }
}
