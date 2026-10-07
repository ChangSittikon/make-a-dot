import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    // In SQLite, we can get tables from sqlite_master
    const result = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';
    `;
    
    const tables = [];
    for (const { name } of result) {
      // Get row count safely
      const [{ count }] = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(`SELECT COUNT(*) as count FROM "${name}"`);
      tables.push({
        name,
        rows: Number(count),
        desc: 'Database table'
      });
    }

    // Sort by rows descending
    tables.sort((a, b) => b.rows - a.rows);

    return NextResponse.json({ tables });
  } catch (err) {
    console.error('Failed to get database stats', err);
    return NextResponse.json({ error: 'Failed to get database stats' }, { status: 500 });
  }
}
