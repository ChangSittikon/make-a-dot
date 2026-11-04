"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { QuickFixCardModal } from './QuickFixCardModal';
import { BountyProposalsModal } from './BountyProposalsModal';

export interface RecentActivityItem {
  id: string;
  originDotCode?: string | null;
  rawDescription?: string | null;
  status: string;
  bountyType?: string | null;
  bountyPrizeSatang?: number;
  bountyDescription?: string | null;
  problemCategory?: string | null;
  occupation?: { name: string } | null;
  targetOccupations?: Array<{ name: string }>;
  targetSkills?: Array<{ name: string }>;
  createdAt?: string | Date;
  negotiations?: any[];
  upgradeProposals?: any[];
}

export interface RecentActivitySectionProps {
  initialBounties?: RecentActivityItem[];
}

export function RecentActivitySection({ initialBounties = [] }: RecentActivitySectionProps) {
  const [selectedBounty, setSelectedBounty] = useState<RecentActivityItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposalBounty, setSelectedProposalBounty] = useState<RecentActivityItem | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const handleOpenQuickFix = (bounty: RecentActivityItem) => {
    setSelectedBounty(bounty);
    setIsModalOpen(true);
  };

  const handleCloseQuickFix = () => {
    setIsModalOpen(false);
    setSelectedBounty(null);
  };

  const handleOpenProposals = (bounty: RecentActivityItem) => {
    setSelectedProposalBounty(bounty);
    setIsProposalModalOpen(true);
  };

  const handleCloseProposals = () => {
    setIsProposalModalOpen(false);
    setSelectedProposalBounty(null);
  };

  // ถ้าไม่มีข้อมูลในฐานข้อมูล จำลองตัวอย่างงานที่เพิ่งยืนยันเข้ามา เพื่อให้สามารถกดทดสอบได้ทันที
  const displayBounties: RecentActivityItem[] = initialBounties.length > 0
    ? initialBounties
    : [
        {
          id: 'cmw-demo-01',
          originDotCode: '#DOT-99281',
          rawDescription: 'ปัญหา: ต้องการคนช่วยประสานงานจัดซื้อวัสดุและอุปกรณ์ปรับปรุงพื้นที่หน้างาน และตรวจสอบราคากลาง สิ่งที่คาดหวัง: ได้ราคากลางที่เป็นธรรมและไม่โดนโก่งราคา',
          status: 'NEGOTIATING',
          bountyType: 'CASH',
          bountyPrizeSatang: 500000,
          problemCategory: 'ก่อสร้างและอสังหาริมทรัพย์',
          occupation: { name: 'นักจัดซื้อและประสานงานไซต์งาน' },
          targetOccupations: [{ name: 'นักจัดซื้อและประสานงาน' }],
          targetSkills: [{ name: 'ตรวจสอบราคากลาง' }, { name: 'เจรจาต่อรอง' }],
          negotiations: [
            {
              id: 'neg-demo-1',
              bountyId: 'cmw-demo-01',
              solverId: 'mock-solver-1',
              proposedKPI: 'จัดหาราคากลางและต่อรองราคาวัสดุเทียบ 3 เจ้า พร้อมสรุปตารางเปรียบเทียบภายใน 3 วัน',
              timeframeDays: 3,
              priceSatang: 450000,
              status: 'PENDING',
              createdAt: new Date().toISOString(),
              solver: {
                id: 'mock-solver-1',
                name: 'สมชาย นักจัดซื้อชำนาญการ',
                email: 'somchai@mock.com',
                role: 'PROFESSIONAL',
                image: null,
                avatarUrl: null,
                trustScore: 95,
              },
            },
          ],
          upgradeProposals: [],
        },
      ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'MATCHING':
        return { text: 'พร้อมส่งตัว / รอคนช่วย', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'NEGOTIATING':
        return { text: 'กำลังเจรจา', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'ACTIVE':
        return { text: 'กำลังดำเนินการ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'COMPLETED':
        return { text: 'สำเร็จ', color: 'bg-green-50 text-green-700 border-green-200' };
      default:
        return { text: 'ยืนยันข้อมูลแล้ว', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  return (
    <div className="mt-8 font-prompt space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>กิจกรรมล่าสุด</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-brand-red border border-red-200">
            {displayBounties.length} ปัญหา
          </span>
        </h3>
        <Link
          href="/profile/bounty/manage"
          className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
        >
          <span>จัดการปัญหาทั้งหมด</span>
          <i className="fa-solid fa-chevron-right text-[10px]" />
        </Link>
      </div>

      <div className="space-y-3">
        {displayBounties.map((bounty) => {
          const statusInfo = getStatusLabel(bounty.status);
          const rewardText = bounty.bountyType === 'CASH' && bounty.bountyPrizeSatang
            ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}`
            : bounty.bountyDescription || 'ตามตกลง';

          return (
            <div
              key={bounty.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              {/* Header การ์ด: รหัส + สถานะ */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-800 rounded">
                  {bounty.originDotCode || `#DOT-${bounty.id.slice(-6).toUpperCase()}`}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>

              {/* ปัญหา */}
              <div>
                <p className="text-xs text-gray-800 line-clamp-2 leading-snug font-medium">
                  &ldquo;{bounty.rawDescription || 'ไม่มีรายละเอียดปัญหา'}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-briefcase text-gray-400 text-[10px]" />
                    <span>{bounty.occupation?.name || 'ช่าง/ผู้เชี่ยวชาญ'}</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-brand-red">
                    ค่าตอบแทน: {rewardText}
                  </span>
                </div>
              </div>

              {/* แถบแจ้งเตือนเมื่อมีผู้สนใจเสนอตัวรับงานหรือเสนอเงื่อนไข KPI */}
              {(() => {
                const pendingNegotiations = (bounty.negotiations || []).filter((n: any) => n.status === 'PENDING');
                const pendingUpgrades = (bounty.upgradeProposals || []).filter((p: any) => p.status === 'PENDING');
                const pendingOffers = pendingNegotiations.length + pendingUpgrades.length;

                if (pendingOffers === 0) return null;

                return (
                  <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 flex items-center justify-between gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-base shrink-0 animate-pulse">🔔</span>
                      <div>
                        <div className="text-xs font-bold text-amber-900">
                          มีผู้สนใจเสนอตัว {pendingOffers} รายการ!
                        </div>
                        <div className="text-[10px] text-amber-700 font-medium">
                          {pendingNegotiations.length > 0 && `${pendingNegotiations.length} ผู้เสนอตัวรับงาน`}
                          {pendingNegotiations.length > 0 && pendingUpgrades.length > 0 && " • "}
                          {pendingUpgrades.length > 0 && `${pendingUpgrades.length} ข้อเสนออัปเกรด`}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenProposals(bounty)}
                      className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      ดูข้อเสนอ
                    </button>
                  </div>
                );
              })()}

              {/* ปุ่มการกระทำ: [💡 เปิดดูการ์ดแก้ไขเบื้องต้น] + [ดูการ์ดสรุปปัญหา] */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenQuickFix(bounty)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-brand-red border border-red-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="text-sm">💡</span>
                  <span>เปิดดูการ์ดแก้ไขเบื้องต้น</span>
                </button>

                <Link
                  href={`/profile/bounty/${bounty.id}`}
                  className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shrink-0"
                >
                  <span>ดูรายละเอียด</span>
                  <i className="fa-solid fa-arrow-right text-[10px] ml-1.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 'การ์ดแก้ไขเบื้องต้น' */}
      <QuickFixCardModal
        isOpen={isModalOpen}
        onClose={handleCloseQuickFix}
        bounty={selectedBounty}
      />

      {/* Modal 'ข้อเสนอผู้เชี่ยวชาญ' */}
      <BountyProposalsModal
        isOpen={isProposalModalOpen}
        onClose={handleCloseProposals}
        bounty={selectedProposalBounty}
      />
    </div>
  );
}

export default RecentActivitySection;