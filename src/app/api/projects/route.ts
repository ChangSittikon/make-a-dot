export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProjectSchema } from '@/lib/validations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industryId = searchParams.get('industryId');

  try {
    const projects = await prisma.project.findMany({
      where: industryId ? { industryId } : undefined,
      include: {
        industry: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Project
      const project = await tx.project.create({
        data,
      });

      // 2. Create ProjectMember for Owner (100% equity initially)
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: data.ownerId,
          role: 'OWNER',
          equityPercentage: 10000, // 100%
          status: 'ACCEPTED',
          joinedAt: new Date()
        }
      });

      // 3. Create Draft Canvas
      await tx.collaborationCanvas.create({
        data: {
          projectId: project.id,
          proposerId: data.ownerId,
          splitType: 'REVENUE_SHARE',
          status: 'DRAFT',
          smartSummary: 'This is a draft agreement. Please add resources to calculate equity automatically.'
        }
      });

      // Fetch the full project to return
      return await tx.project.findUnique({
        where: { id: project.id },
        include: {
          members: true,
          canvas: true
        }
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
