import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    const logs = await prisma.agentLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    
    return NextResponse.json({ logs });
  } catch (err) {
    console.error('Failed to fetch logs', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
