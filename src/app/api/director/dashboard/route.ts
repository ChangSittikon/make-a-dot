export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const directorUserId = searchParams.get('directorUserId');

  if (!directorUserId) {
    return NextResponse.json({ error: 'directorUserId is required' }, { status: 400 });
  }

  try {
    const director = await prisma.domainDirector.findUnique({
      where: { userId: directorUserId },
      include: {
        industry: {
          include: {
            projects: {
              include: {
                escrow: true
              }
            }
          }
        }
      }
    });

    if (!director) {
      return NextResponse.json({ error: 'Director not found' }, { status: 404 });
    }

    const projects = director.industry?.projects || [];
    const projectCount = projects.length;
    
    const totalVolumeSatang = projects.reduce((sum, p) => {
      return sum + (p.escrow?.totalAmountSatang || 0);
    }, 0);

    const activeDeals = projects.filter(p => p.status === 'ACTIVE').length;

    const recentEndorsements = await prisma.endorsement.findMany({
      where: { directorId: director.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { project: true }
    });

    const pendingDisputes = await prisma.escrowVault.findMany({
      where: {
        status: 'DISPUTED',
        project: { industryId: director.industryId }
      },
      include: { project: true }
    });

    return NextResponse.json({
      director,
      stats: {
        projectCount,
        totalVolumeSatang,
        activeDeals
      },
      recentEndorsements,
      pendingDisputes
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
