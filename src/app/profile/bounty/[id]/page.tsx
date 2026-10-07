import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-mock';
import { prisma } from '@/lib/prisma';
import BountySummaryCard from '@/components/bounty/BountySummaryCard';
import BountyNegotiationInbox from '@/components/bounty/BountyNegotiationInbox';
import SolverActionSection from '@/components/bounty/SolverActionSection';
import StickySolverBar from '@/components/bounty/StickySolverBar';

export default async function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await getCurrentUser();
  
  const bountyInclude = {
    requester: true,
    occupation: true,
    workType: true,
    requiredSkills: {
      include: {
        skillTag: true,
      },
    },
    upgradeProposals: {
      include: { proposer: true },
      orderBy: { createdAt: 'desc' as const },
    },
    negotiations: {
      include: { solver: true },
      orderBy: { createdAt: 'desc' as const },
    },
  };

  // Try to fetch bounty, otherwise fallback to mock
  let bounty = await prisma.problemNode.findUnique({
    where: { id: resolvedParams.id },
    include: bountyInclude,
  });

  
  if (!bounty) {
    // Upsert a test bounty so the UI and API works
    bounty = await prisma.problemNode.upsert({
      where: { id: resolvedParams.id },
      update: {},
      create: {
        id: resolvedParams.id,
        rawDescription: "ต้องการทีมพัฒนา MVP สำหรับจองคิวร้านอาหาร โดยต้องการฟีเจอร์พื้นฐาน...",
        entityType: "ENTERPRISE",
        primaryGap: "SKILL_GAP",
        urgencyState: "HOT_MISSION",
        bountyPrizeSatang: 5000000,
        requesterId: user?.id || "",
      },
      include: bountyInclude,
    });

    // Seed mock proposals if we just created the bounty
    const mockUser1 = await prisma.user.upsert({
      where: { id: 'mock-user-1' },
      update: {},
      create: {
        id: 'mock-user-1',
        name: 'สมชาย ครีเอเตอร์',
        email: 'somchai@mock.com',
        role: 'USER',
        trustScore: 10,
      }
    });
    
    const mockUser4 = await prisma.user.upsert({
      where: { id: 'mock-user-4' },
      update: {},
      create: {
        id: 'mock-user-4',
        name: 'ดร. วิทยา ไดเรกเตอร์',
        email: 'wittaya@mock.com',
        role: 'DIRECTOR',
        trustScore: 99,
      }
    });

    await prisma.upgradeProposal.createMany({
      data: [
        {
          bountyId: bounty.id,
          proposerId: mockUser1.id,
          vision: "ผมเป็นช่างภาพและนักออกแบบ UI ผมเห็นว่าแอพจองคิวควรมีหน้าตาที่สวยงาม ผมขอเอาแรงเข้าแลก (Sweat Equity) เพื่อช่วยออกแบบ UI ให้โปรเจกต์นี้ครับ",
          proposedRole: "SWEAT_SHARE",
          status: "PENDING"
        },
        {
          bountyId: bounty.id,
          proposerId: mockUser4.id,
          vision: "โครงสร้าง MVP นี้น่าสนใจมาก ผมมีทีมพัฒนาที่เชี่ยวชาญด้าน React/Node.js พร้อมลุยทันที ผมเสนอให้เปลี่ยนเป็น Project เพื่อแบ่ง Rev-Share กันระยะยาว",
          proposedRole: "PROJECT_MANAGER",
          status: "PENDING"
        }
      ]
    });

    // Re-fetch to get the new proposals
    bounty = await prisma.problemNode.findUnique({
      where: { id: resolvedParams.id },
      include: bountyInclude,
    });
  }


  // Fallbacks if bounty is still null for some reason
  if (!bounty) return <div>Not Found</div>;

  const isAdmin = user?.role === 'ADMIN';
  const isBountyOwner = Boolean(user && user.id === bounty.requesterId);
  const isRequester = !user || isBountyOwner || isAdmin;
  const prizeTHB = (bounty.bountyPrizeSatang / 100).toLocaleString();

  // Parse Step 5 targets (Occupations & Skills) for Solvers
  const targetOccupations: { id?: string; name: string }[] = [];
  const targetSkills: { id?: string; name: string }[] = [];

  if (bounty.occupation) {
    targetOccupations.push({ id: bounty.occupation.id, name: bounty.occupation.name });
  }
  if (Array.isArray(bounty.requiredSkills)) {
    bounty.requiredSkills.forEach((rs: { skillTag?: { id: string; name: string } }) => {
      if (rs.skillTag?.name) {
        targetSkills.push({ id: rs.skillTag.id, name: rs.skillTag.name });
      }
    });
  }

  if (bounty.deepAttributes) {
    try {
      const parsed = JSON.parse(bounty.deepAttributes);
      if (Array.isArray(parsed.targetOccupations)) {
        parsed.targetOccupations.forEach((occ: { id?: string; name?: string }) => {
          if (occ?.name && !targetOccupations.some((o) => o.name.toLowerCase() === occ.name!.toLowerCase())) {
            targetOccupations.push({ id: occ.id, name: occ.name });
          }
        });
      }
      if (Array.isArray(parsed.targetSkills)) {
        parsed.targetSkills.forEach((sk: { id?: string; name?: string }) => {
          if (sk?.name && !targetSkills.some((s) => s.name.toLowerCase() === sk.name!.toLowerCase())) {
            targetSkills.push({ id: sk.id, name: sk.name });
          }
        });
      }
    } catch {}
  }

  // Resolve Requester Profile (Occupation / Industry / Profile ID)
  let requesterWorkTypeName = bounty.workType?.name || "รับจ้างทั่วไป";
  let requesterIndustryName = "ก่อสร้างและอสังหาริมทรัพย์";

  if (bounty.requesterWorkTypeId) {
    const wt = await prisma.workType.findUnique({
      where: { id: bounty.requesterWorkTypeId },
      select: { name: true },
    });
    if (wt?.name) requesterWorkTypeName = wt.name;
  }

  if (bounty.requesterIndustryId) {
    const ind = await prisma.industry.findUnique({
      where: { id: bounty.requesterIndustryId },
      select: { name: true },
    });
    if (ind?.name) requesterIndustryName = ind.name;
  }

  if (bounty.deepAttributes) {
    try {
      const parsed = JSON.parse(bounty.deepAttributes);
      if (parsed.requesterWorkTypeName) requesterWorkTypeName = parsed.requesterWorkTypeName;
      if (parsed.requesterIndustryName) requesterIndustryName = parsed.requesterIndustryName;
      if (parsed.cascadeValue?.requesterWorkTypeName) requesterWorkTypeName = parsed.cascadeValue.requesterWorkTypeName;
      if (parsed.cascadeValue?.requesterIndustryName) requesterIndustryName = parsed.cascadeValue.requesterIndustryName;
    } catch {}
  }

  const rewardText =
    bounty.bountyType === "CASH"
      ? `฿${prizeTHB}`
      : bounty.bountyDescription || (bounty.bountyPrizeSatang > 0 ? `฿${prizeTHB}` : "ตามตกลง");

  const statusLabel =
    bounty.status === "OPEN"
      ? "พร้อมส่งตัว"
      : bounty.status === "MATCHING"
      ? "กำลังจับคู่"
      : bounty.status === "NEGOTIATING"
      ? "กำลังเจรจา"
      : bounty.status === "ACTIVE"
      ? "กำลังดำเนินการ"
      : bounty.status === "COMPLETED"
      ? "สำเร็จ"
      : "พร้อมส่งตัว";

  const requesterProfileId = bounty.requester?.id || bounty.requesterId || user?.id || bounty.id;

  // Read impactScale directly from the bounty record
  const bountyImpactScale = (bounty as Record<string, unknown>).impactScale as string | undefined;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div 
        id="mobile-phone-frame"
        className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-brand-gray-light relative flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/board" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">รายละเอียดงาน</h1>
              <p className="text-xs text-gray-500 leading-none">Quest Detail</p>
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto hide-scrollbar p-5">
          <div className="mx-auto flex flex-col gap-5">
            {/* ใบสรุปงาน (Summary Card) */}
            <BountySummaryCard
              bountyId={bounty.id}
              statusLabel={statusLabel}
              rawDescription={bounty.rawDescription}
              requesterName={bounty.requester?.name || undefined}
              requesterProfileId={requesterProfileId}
              requesterWorkTypeName={requesterWorkTypeName}
              requesterIndustryName={requesterIndustryName}
              targetOccupations={targetOccupations}
              targetSkills={targetSkills}
              rewardText={rewardText}
              impactScale={bountyImpactScale || "LOCAL"}
              isRequester={isRequester}
            />

            {/* Requester Inbox Section (Dual Tabs: ผู้เสนอตัวรับงาน & ข้อเสนออัปเกรด) */}
            {isRequester && (
              <BountyNegotiationInbox
                bountyId={bounty.id}
                initialNegotiations={(bounty.negotiations as any) || []}
                initialUpgradeProposals={(bounty.upgradeProposals as any) || []}
              />
            )}

            {/* Solver Action Section (ปุ่มรับงานเจรจา + Negotiation Modal) */}
            <SolverActionSection
              bountyId={bounty.id}
              initialPrizeTHB={bounty.bountyPrizeSatang / 100}
              currentUserRole={user?.role || "USER"}
              isRequester={!isAdmin && isBountyOwner}
              bountyStatus={bounty.status}
              myNegotiationStatus={
                bounty.negotiations?.find((n) => n.solverId === user?.id)?.status || null
              }
            />
          </div>
        </main>

        {/* Sticky Bottom Bar for Instant Action (Always visible at bottom) */}
        <StickySolverBar
          bountyId={bounty.id}
          initialPrizeTHB={bounty.bountyPrizeSatang / 100}
          prizeText={rewardText}
          bountyStatus={bounty.status}
          currentUserRole={user?.role || "USER"}
          myNegotiationStatus={
            bounty.negotiations?.find((n) => n.solverId === user?.id)?.status || null
          }
        />
      </div>
    </div>
  );
}