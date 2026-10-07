import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const standardWorkTypesOrder = [
      'รับจ้างทั่วไป',
      'พนักงานประจำ',
      'ข้าราชการ/นักการเมือง',
      'วิชาชีพเฉพาะ(ใบประกอบวิชาชีพ)',
      'ผู้ประกอบการ/ร้านค้า',
      'ฟรีแลนซ์/อาชีพอิสระ',
      'นักเรียน/นักศึกษา',
      'นักลงทุน'
    ];

    const rawWorkTypes = await prisma.workType.findMany();
    const workTypes = rawWorkTypes.sort((a, b) => {
      const idxA = standardWorkTypesOrder.indexOf(a.name);
      const idxB = standardWorkTypesOrder.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    const industries = await prisma.industry.findMany({
      where: {
        order: { gt: 0 } // exclude system flows like '⭐️ หน้าหลัก' (-2) and '🔧 แจ้งปัญหา Flow' (-1)
      },
      orderBy: [ { order: 'asc' }, { name: 'asc' } ],
      include: {
        occupations: {
          orderBy: [ { order: 'asc' }, { name: 'asc' } ],
          include: {
            skillTags: {
              orderBy: { name: 'asc' }
            }
          }
        }
      }
    });

    // Count Bounties (ProblemNode) and Projects (Project) grouped by impactScale
    const [bountyGroupCounts, projectGroupCounts] = await Promise.all([
      prisma.problemNode.groupBy({
        by: ['impactScale'],
        _count: { id: true }
      }),
      prisma.project.groupBy({
        by: ['impactScale'],
        _count: { id: true }
      })
    ]);

    const scaleStats: Record<string, { bounties: number; projects: number }> = {
      MICRO: { bounties: 0, projects: 0 },
      LOCAL: { bounties: 0, projects: 0 },
      MACRO: { bounties: 0, projects: 0 },
      STRUCTURAL: { bounties: 0, projects: 0 },
      GLOBAL: { bounties: 0, projects: 0 },
      MOONSHOT: { bounties: 0, projects: 0 }
    };

    let totalBounties = 0;
    let totalProjects = 0;

    for (const item of bountyGroupCounts) {
      if (item.impactScale && scaleStats[item.impactScale]) {
        scaleStats[item.impactScale].bounties = item._count.id;
        totalBounties += item._count.id;
      }
    }

    for (const item of projectGroupCounts) {
      if (item.impactScale && scaleStats[item.impactScale]) {
        scaleStats[item.impactScale].projects = item._count.id;
        totalProjects += item._count.id;
      }
    }

    return NextResponse.json({
      success: true,
      workTypes,
      industries,
      scaleStats,
      totalBounties,
      totalProjects
    });
  } catch (error) {
    console.error('Failed to fetch taxonomy:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}
