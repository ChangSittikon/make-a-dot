export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Get the first user and industry to act as dummy data
    const user = await prisma.user.findFirst();
    const industry = await prisma.industry.findFirst();

    if (!user || !industry) {
      return NextResponse.json({ error: 'Database not seeded properly' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Project
      const project = await tx.project.create({
        data: {
          title: "โปรเจกต์ใหม่ (จาก Flow)",
          description: "โปรเจกต์ที่สร้างใหม่สดๆ ร้อนๆ",
          industryId: industry.id,
          ownerId: user.id,
          status: "DRAFT"
        },
      });

      // 2. Create ProjectMember
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: 'OWNER',
          revSharePercentage: 10000, 
          status: 'ACCEPTED',
          joinedAt: new Date()
        }
      });

      // 3. Create Draft Canvas
      await tx.collaborationCanvas.create({
        data: {
          projectId: project.id,
          proposerId: user.id,
          splitType: 'REVENUE_SHARE',
          status: 'DRAFT',
          smartSummary: 'This is a draft agreement. Please add resources to calculate revShare automatically.'
        }
      });

      return project;
    });

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create demo project' }, { status: 500 });
  }
}
