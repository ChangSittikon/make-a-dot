import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/bounty-flow — fetch all INPUT nodes for the "🔧 แจ้งปัญหา Flow" industry
export async function GET() {
  try {
    const industry = await prisma.industry.findFirst({
      where: { name: '🔧 แจ้งปัญหา Flow' }
    });

    if (!industry) {
      return NextResponse.json({ error: 'Bounty flow not configured' }, { status: 404 });
    }

    const nodes = await prisma.node.findMany({
      where: { industryId: industry.id },
      orderBy: { order: 'asc' },
      include: {
        options: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Transform to the shape BountyFlowApp expects
    const steps = nodes.map(node => ({
      id: node.id,
      type: node.inputType || 'TEXT',
      question: node.question || '',
      field: node.fieldName || '',
      suggestions: node.suggestions ? JSON.parse(node.suggestions) : undefined,
      options: node.inputType === 'OPTIONS' 
        ? node.options.map(opt => ({
            label: opt.label,
            value: opt.vectorWeight ? JSON.parse(opt.vectorWeight).value : opt.label,
            icon: opt.icon || undefined
          }))
        : undefined
    }));

    return NextResponse.json(steps);
  } catch (error) {
    console.error('Failed to fetch bounty flow:', error);
    return NextResponse.json({ error: 'Failed to fetch bounty flow' }, { status: 500 });
  }
}
