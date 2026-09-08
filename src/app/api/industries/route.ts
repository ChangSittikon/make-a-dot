import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { nodes: true }
        },
        domainDirector: true
      }
    });
    // map _count to nodeCount for frontend compatibility
    const formatted = industries.map(ind => ({
      ...ind,
      nodeCount: ind._count.nodes
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const industry = await prisma.industry.create({
      data: {
        name: json.name,
        icon: json.icon,
        order: json.order || 0
      }
    });
    return NextResponse.json({ ...industry, nodeCount: 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create industry' }, { status: 500 });
  }
}
