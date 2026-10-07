import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    const [
      industriesCount,
      nodesCount,
      optionsCount,
      occupationsCount,
      workTypesCount,
      skillTagsCount
    ] = await Promise.all([
      prisma.industry.count(),
      prisma.node.count(),
      prisma.option.count(),
      prisma.occupation.count(),
      prisma.workType.count(),
      prisma.skillTag.count()
    ]);

    const recentIndustries = await prisma.industry.findMany({
      take: 5,
      select: { id: true, name: true, order: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      stats: {
        industries: industriesCount,
        nodes: nodesCount,
        options: optionsCount,
        occupations: occupationsCount,
        workTypes: workTypesCount,
        skillTags: skillTagsCount
      },
      recentIndustries
    });
  } catch (err) {
    console.error('Failed to fetch taxonomy stats', err);
    return NextResponse.json({ error: 'Failed to fetch taxonomy stats' }, { status: 500 });
  }
}
