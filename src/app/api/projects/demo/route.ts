export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const project = await prisma.project.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!project) {
      return NextResponse.json({ error: 'No demo project found' }, { status: 404 });
    }
    
    return NextResponse.json({ id: project.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch demo project' }, { status: 500 });
  }
}
