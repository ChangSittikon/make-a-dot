import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        trustScore: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const activeUsers = await prisma.user.count(); // Simple metric
    
    return NextResponse.json({ users, activeUsers });
  } catch (err) {
    console.error('Failed to fetch users', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
