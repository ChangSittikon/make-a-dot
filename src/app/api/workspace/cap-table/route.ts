import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    const [
      splitsCount,
      membersCount,
      projectsCount,
      simulationsCount
    ] = await Promise.all([
      prisma.revShareSplit.count(),
      prisma.revShareSplitMember.count(),
      prisma.revShareAndSplit.count(),
      prisma.projectSimulation.count()
    ]);

    return NextResponse.json({
      stats: {
        splits: splitsCount,
        members: membersCount,
        projects: projectsCount,
        simulations: simulationsCount
      }
    });
  } catch (err) {
    console.error('Failed to fetch cap table stats', err);
    return NextResponse.json({ error: 'Failed to fetch cap table stats' }, { status: 500 });
  }
}
