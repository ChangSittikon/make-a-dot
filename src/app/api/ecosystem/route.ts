export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industryId = searchParams.get('industryId');

    // 1. Fetch Industries with Occupations and SkillTags
    const industriesQuery: any = {
      include: {
        occupations: {
          include: {
            skillTags: true
          }
        }
      },
      orderBy: { order: 'asc' }
    };
    
    if (industryId) {
      industriesQuery.where = { id: industryId };
    }
    
    const rawIndustries = await prisma.industry.findMany(industriesQuery);

    // 2. Fetch User Tier Distribution from Database
    const userRoleCounts = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    const roleCountMap: Record<string, number> = {
      USER: 0,
      PROFESSIONAL: 0,
      GUARANTOR: 0,
      DIRECTOR: 0,
      ADMIN: 0,
    };
    userRoleCounts.forEach(item => {
      if (item.role in roleCountMap) {
        roleCountMap[item.role] = item._count.id;
      }
    });

    // 3. Fetch ProblemNodes (Bounties) to build relationships
    const problemQuery: any = {
      include: {
        requester: true,
        solver: true
      }
    };
    
    if (industryId) {
      problemQuery.where = { requesterIndustryId: industryId };
    }
    
    const problems = await prisma.problemNode.findMany(problemQuery);

    // Fetch Negotiations to show active partnerships
    const negotiationsQuery: any = {
      include: {
        solver: true,
        bounty: {
          include: {
            requester: true
          }
        }
      },
      where: {
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    };

    if (industryId) {
      negotiationsQuery.where.bounty = {
        requesterIndustryId: industryId
      };
    }

    const negotiations = await prisma.bountyNegotiation.findMany(negotiationsQuery);

    // 4. Process Data
    const totalUsers = new Set<string>();
    let totalBountiesValue = 0;
    
    const industryMap = new Map();
    rawIndustries.forEach(ind => {
      industryMap.set(ind.id, {
        ...ind,
        stats: { totalBounties: 0, activeBounties: 0, totalSolvers: 0, totalRequesters: 0 },
        requesterCounts: new Map(),
        solverCounts: new Map()
      });
    });

    const connectionsMap = new Map();
    
    // Keep track of user roles across industries to detect cross-industry
    const userRoles = new Map<string, { requesterIn: Set<string>, solverIn: Set<string> }>();

    problems.forEach((prob: any) => {
      totalBountiesValue += prob.bountyPrizeSatang || 0;
      totalUsers.add(prob.requesterId);
      if (prob.solverId) totalUsers.add(prob.solverId);

      const indId = prob.requesterIndustryId;
      
      // Track user roles for cross-industry detection
      if (indId) {
        if (!userRoles.has(prob.requesterId)) {
          userRoles.set(prob.requesterId, { requesterIn: new Set(), solverIn: new Set() });
        }
        userRoles.get(prob.requesterId)!.requesterIn.add(indId);
        
        if (prob.solverId) {
          if (!userRoles.has(prob.solverId)) {
            userRoles.set(prob.solverId, { requesterIn: new Set(), solverIn: new Set() });
          }
          userRoles.get(prob.solverId)!.solverIn.add(indId);
        }
      }

      if (indId && industryMap.has(indId)) {
        const indData = industryMap.get(indId);
        indData.stats.totalBounties += 1;
        if (prob.status !== 'COMPLETED' && prob.status !== 'CANCELLED') {
          indData.stats.activeBounties += 1;
        }

        // Requester stats
        const rCount = indData.requesterCounts.get(prob.requesterId) || { user: prob.requester, count: 0 };
        rCount.count += 1;
        indData.requesterCounts.set(prob.requesterId, rCount);

        // Solver stats
        if (prob.solverId && prob.solver) {
          const sCount = indData.solverCounts.get(prob.solverId) || { user: prob.solver, count: 0 };
          sCount.count += 1;
          indData.solverCounts.set(prob.solverId, sCount);

          // Build connection
          const connKey = `${prob.requesterId}-${prob.solverId}-${indId}`;
          if (connectionsMap.has(connKey)) {
             const conn = connectionsMap.get(connKey);
             conn.bountyCount += 1;
             conn.totalValueSatang += prob.bountyPrizeSatang || 0;
          } else {
             connectionsMap.set(connKey, {
               fromUserId: prob.requester.id,
               fromUserName: prob.requester.name || 'Unknown',
               fromUserImage: prob.requester.image || prob.requester.avatarUrl || null,
               toUserId: prob.solver.id,
               toUserName: prob.solver.name || 'Unknown',
               toUserImage: prob.solver.image || prob.solver.avatarUrl || null,
               industryId: indId,
               industryName: indData.name,
               connectionType: 'REQUESTER_SOLVER',
               bountyCount: 1,
               totalValueSatang: prob.bountyPrizeSatang || 0
             });
          }
        }
      }
    });

    // Add negotiations as 'PARTNER' connections if not already added
    negotiations.forEach((neg: any) => {
      const prob = neg.bounty;
      const indId = prob?.requesterIndustryId;
      
      totalUsers.add(neg.solverId);
      if (prob?.requesterId) totalUsers.add(prob.requesterId);

      if (indId && industryMap.has(indId) && prob?.requester) {
        const connKey = `${prob.requesterId}-${neg.solverId}-${indId}`;
        if (!connectionsMap.has(connKey)) {
          const indData = industryMap.get(indId);
          connectionsMap.set(connKey, {
            fromUserId: prob.requester.id,
            fromUserName: prob.requester.name || 'Unknown',
            fromUserImage: prob.requester.image || prob.requester.avatarUrl || null,
            toUserId: neg.solver.id,
            toUserName: neg.solver.name || 'Unknown',
            toUserImage: neg.solver.image || neg.solver.avatarUrl || null,
            industryId: indId,
            industryName: indData.name,
            connectionType: 'PARTNER',
            bountyCount: 1,
            totalValueSatang: prob.bountyPrizeSatang || 0
          });
        }
      }
    });
    
    // Determine Cross-Industry Connections
    const connections = Array.from(connectionsMap.values()).map(conn => {
      const solverRoles = userRoles.get(conn.toUserId);
      if (solverRoles && solverRoles.requesterIn.size > 0) {
        for (const reqInd of Array.from(solverRoles.requesterIn)) {
          if (reqInd !== conn.industryId) {
            conn.connectionType = 'CROSS_INDUSTRY';
            break;
          }
        }
      }
      return conn;
    });

    // 5. Format Industries
    const formattedIndustries = Array.from(industryMap.values()).map(ind => {
      const topRequesters = Array.from(ind.requesterCounts.values())
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5)
        .map((r: any) => ({
          id: r.user.id,
          name: r.user.name || 'Unknown',
          image: r.user.image || r.user.avatarUrl || null,
          bountyCount: r.count
        }));

      const topSolvers = Array.from(ind.solverCounts.values())
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5)
        .map((s: any) => ({
          id: s.user.id,
          name: s.user.name || 'Unknown',
          image: s.user.image || s.user.avatarUrl || null,
          solvedCount: s.count
        }));

      ind.stats.totalRequesters = ind.requesterCounts.size;
      ind.stats.totalSolvers = ind.solverCounts.size;

      return {
        id: ind.id,
        name: ind.name,
        icon: ind.icon,
        order: ind.order,
        occupations: ind.occupations,
        stats: ind.stats,
        topRequesters,
        topSolvers
      };
    });

    // Canonical Tier Architecture definitions matching MAKE A DOT system
    const systemTiers = [
      {
        tier: 1,
        code: 'USER',
        name: 'Idea Creator',
        thName: 'ผู้เสนอปัญหา / เจ้าของโจทย์',
        description: 'ผู้ริเริ่มความต้องการ จุดประกาย Demand เป็นจุดเริ่มต้นของโครงการและเควสต์ทั้งหมด',
        userCount: roleCountMap.USER,
        primaryColor: 'slate',
      },
      {
        tier: 2,
        code: 'PROFESSIONAL',
        name: 'Professional & Solver',
        thName: 'ผู้เชี่ยวชาญวิชาชีพ & Back Office',
        description: 'มืออาชีพผู้ลงมือแก้ปัญหา ทั้งทีมปฏิบัติการหน้างาน และทีม Total Back Office สนับสนุนข้ามสายงาน',
        userCount: roleCountMap.PROFESSIONAL,
        primaryColor: 'blue',
      },
      {
        tier: 3,
        code: 'GUARANTOR',
        name: 'Guarantor',
        thName: 'ผู้ค้ำประกัน & ตรวจสอบคุณภาพ',
        description: 'นิติบุคคลหรือผู้มี Trust Score สูง คอยค้ำประกันสัญญา ตรวจรับมอบงานเพื่อปลดล็อก Escrow',
        userCount: roleCountMap.GUARANTOR,
        primaryColor: 'purple',
      },
      {
        tier: 4,
        code: 'DIRECTOR',
        name: 'Domain Director',
        thName: 'ผู้อำนวยการวงการ',
        description: 'สมาคมวิชาชีพและผู้นำระดับประเทศ ประทับตรา Endorsement รับรองมาตรฐาน และวินิจฉัยข้อพิพาท',
        userCount: roleCountMap.DIRECTOR,
        primaryColor: 'amber',
      },
      {
        tier: 5,
        code: 'ADMIN',
        name: 'System Admin',
        thName: 'ผู้ดูแลระบบกลาง & แพลตฟอร์ม',
        description: 'กำกับดูแลระบบ Escrow Vault อัตโนมัติ ศาลอนุญาโตตุลาการกลาง และธรรมาภิบาลระบบนิเวศ',
        userCount: roleCountMap.ADMIN,
        primaryColor: 'red',
      },
    ];

    return NextResponse.json({
      success: true,
      ecosystem: {
        industries: formattedIndustries,
        connections,
        systemTiers,
        summary: {
          totalUsers: totalUsers.size,
          totalConnections: connections.length,
          totalIndustries: rawIndustries.length,
          totalBountiesValue
        }
      }
    });

  } catch (error) {
    console.error('Error in ecosystem API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
