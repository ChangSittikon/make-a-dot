import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-mock';
import UpgradeBountyButton from './UpgradeBountyButton';
import ProposalActionButtons from './ProposalActionButtons';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await getCurrentUser();
  
  // Try to fetch bounty, otherwise fallback to mock
  let bounty = await prisma.problemNode.findUnique({
    where: { id: resolvedParams.id },
    include: {
      upgradeProposals: {
        include: { proposer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
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
      include: {
        upgradeProposals: {
          include: { proposer: true },
          orderBy: { createdAt: 'desc' }
        }
      }
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
      include: {
        upgradeProposals: {
          include: { proposer: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }


  // Fallbacks if bounty is still null for some reason
  if (!bounty) return <div>Not Found</div>;

  const isRequester = user?.id === bounty.requesterId;
  const prizeTHB = (bounty.bountyPrizeSatang / 100).toLocaleString();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-brand-gray-light relative flex flex-col overflow-hidden shadow-2xl">
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
            {/* Title & Price Section */}
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <span className="inline-block bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 tracking-wider">
                  {bounty.urgencyState}
                </span>
                <h1 className="text-2xl font-bold mb-3 text-brand-black leading-tight line-clamp-3">
                  {bounty.rawDescription}
                </h1>
                <div className="flex gap-4 text-[13px] text-gray-500 font-medium">
                  <span className="flex items-center"><i className="fas fa-building mr-1.5 opacity-70"></i> {bounty.entityType}</span>
                  <span className="flex items-center"><i className="fas fa-clock mr-1.5 opacity-70"></i> โพสต์เมื่อ 2 วันที่แล้ว</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[28px] font-extrabold text-brand-black leading-none mb-1 tracking-tight">฿{prizeTHB}</p>
                <p className="text-[11px] text-gray-400 font-medium tracking-wide">ค่าตอบแทน</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-3 text-brand-black">รายละเอียดงาน <span className="text-gray-400 font-normal text-sm ml-1">(Description)</span></h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {bounty.rawDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Fallback tags */}
                <span className="bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">React</span>
                <span className="bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Node.js</span>
              </div>
            </div>

            {/* Requester Inbox Section */}
            {isRequester && (
              <div className="mt-2">
                <h2 className="text-lg font-bold mb-3 text-brand-black px-1 flex items-center justify-between">
                  <span>ข้อเสนออัปเกรด <span className="bg-brand-black text-white text-xs px-2 py-0.5 rounded-full ml-2">{bounty.upgradeProposals?.length || 0}</span></span>
                </h2>
                <div className="space-y-4">
                  {(!bounty.upgradeProposals || bounty.upgradeProposals.length === 0) ? (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center py-8">
                      <p className="text-gray-400 text-sm font-medium">ยังไม่มีข้อเสนออัปเกรดในขณะนี้</p>
                      <p className="text-xs text-gray-300 mt-1">รอผู้เชี่ยวชาญยื่นข้อเสนอโครงการ</p>
                    </div>
                  ) : (
                    bounty.upgradeProposals.map(proposal => (
                      <div key={proposal.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 border border-gray-200 shrink-0"></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{proposal.proposer.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md tracking-wider">
                                TIER {proposal.proposer.role === 'USER' ? '1' : proposal.proposer.role === 'PROFESSIONAL' ? '2' : proposal.proposer.role === 'GUARANTOR' ? '3' : proposal.proposer.role === 'DIRECTOR' ? '4' : '5'} ({proposal.proposer.role})
                              </span>
                              <span className="text-xs text-gray-400 font-medium">ขอเป็น {proposal.proposedRole.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-3.5 mb-4 border border-gray-100">
                          <p className="text-xs text-gray-600 leading-relaxed italic">"{proposal.vision}"</p>
                        </div>
                        
                        {proposal.status === 'PENDING' ? (
                          <ProposalActionButtons bountyId={bounty.id} proposalId={proposal.id} />
                        ) : (
                          <div className="text-center py-2 text-xs font-bold text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                            {proposal.status}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Escrow Section (Visible for prototyping) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-2">
              <h2 className="text-lg font-bold mb-4 text-brand-black">ระบบค้ำประกัน <span className="text-gray-400 font-normal text-sm ml-1">(Escrow)</span></h2>
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 mb-5">
                <div className="flex items-center text-brand-red font-bold text-sm mb-2">
                  <i className="fas fa-lock mr-2"></i> CASH ESCROW
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  ค่าตอบแทน ฿{prizeTHB} ถูกค้ำประกันไว้ในระบบเรียบร้อยแล้ว หากส่งมอบงานผ่าน จะได้รับเงินทันที
                </p>
              </div>
              
              <Link 
                href={`/profile/bounty/${resolvedParams.id}/negotiate`} 
                className="block w-full bg-brand-red text-white text-center px-4 py-3.5 rounded-xl hover:bg-red-700 transition shadow-sm shadow-red-200 font-bold text-sm mb-3"
              >
                รับงาน (เจรจา)
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}