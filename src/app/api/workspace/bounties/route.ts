import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    const [
      questsCount,
      negotiationsCount,
      disputesCount,
    ] = await Promise.all([
      prisma.problemNode.count(),
      prisma.bountyNegotiation.count(),
      prisma.dispute.count(),
    ]);

    const recentQuests = await prisma.problemNode.findMany({
      take: 5,
      select: { id: true, rawDescription: true, status: true }
    });

    return NextResponse.json({
      stats: {
        quests: questsCount,
        negotiations: negotiationsCount,
        disputes: disputesCount,
      },
      recentQuests
    });
  } catch (err) {
    console.error('Failed to fetch bounties stats', err);
    return NextResponse.json({ error: 'Failed to fetch bounties stats' }, { status: 500 });
  }
}
