"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { QuickFixCardModal } from './QuickFixCardModal';
import { BountyProposalsModal } from './BountyProposalsModal';
import {
  Bell,
  FileText,
  ArrowRight,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

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

/**
 * แยกส่วนข้อความโจทย์ปัญหา:
 * - ดึงหัวข้อปัญหาเด่นๆ มาเป็นบรรทัดแรก (ตัด prefix ปัญหา: และเครื่องหมายคำพูด)
 * - ดึงสิ่งที่คาดหวังมาเป็นตัวเทาขนาดเล็กบรรทัดถัดไป
 */
function parseProblemParts(rawText?: string | null): { problem: string; expectation: string | null } {
  if (!rawText) return { problem: 'ไม่มีรายละเอียดปัญหา', expectation: null };

  let clean = rawText.replace(/^["'“]|["'”]$/g, '').trim();

  // ตรวจจับรูปแบบ ปัญหา: ... สิ่งที่คาดหวัง: ... ข้อจำกัด: ...
  const probMatch = clean.match(/ปัญหา\s*:\s*([^สิ่งที่คาดหวัง|ข้อจำกัด]+)/i);
  const expMatch = clean.match(/สิ่งที่คาดหวัง\s*:\s*([^ข้อจำกัด]+)/i);

  if (probMatch || expMatch) {
    const p = probMatch ? probMatch[1].trim() : clean;
    const e = expMatch ? expMatch[1].trim() : null;
    return {
      problem: p.replace(/^(ปัญหา\s*:\s*)/i, '').replace(/["'“”]/g, '').trim(),
      expectation: e ? e.replace(/^(สิ่งที่คาดหวัง\s*:\s*)/i, '').replace(/["'“”]/g, '').trim() : null,
    };
  }

  // กรณีไม่มีคีย์เวิร์ด
  return {
    problem: clean.replace(/["'“”]/g, '').trim(),
    expectation: null,
  };
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

  // Fallback ตัวอย่างงานกรณีไม่มีใน DB เพื่อให้กดทดสอบได้ทันที
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

  // คุมโทนสถานะ Swiss Style (ขาว-ดำ-แดง เท่านั้น)
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'MATCHING':
        return { text: 'พร้อมส่งตัว / รอคนช่วย', color: 'bg-red-50 text-brand-red border-red-200' };
      case 'NEGOTIATING':
        return { text: 'กำลังเจรจา', color: 'bg-gray-100 text-gray-900 border-gray-300' };
      case 'ACTIVE':
        return { text: 'กำลังดำเนินการ', color: 'bg-gray-900 text-white border-gray-900' };
      case 'COMPLETED':
        return { text: 'สำเร็จ', color: 'bg-gray-100 text-gray-700 border-gray-300' };
      default:
        return { text: 'ยืนยันข้อมูลแล้ว', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="mt-8 font-prompt space-y-3">
      {/* Header กิจกรรมล่าสุด */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
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
          <ChevronRight className="w-3.5 h-3.5 text-brand-red" />
        </Link>
      </div>

      <div className="space-y-3">
        {displayBounties.map((bounty) => {
          const statusInfo = getStatusLabel(bounty.status);
          const rewardText = bounty.bountyType === 'CASH' && bounty.bountyPrizeSatang
            ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}`
            : bounty.bountyDescription || 'ตามตกลง';

          const { problem, expectation } = parseProblemParts(bounty.rawDescription);

          return (
            <div
              key={bounty.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs hover:border-gray-900 transition-all space-y-3"
            >
              {/* Header การ์ด: รหัส + ป้ายสถานะ Swiss Style */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-900 rounded">
                  {bounty.originDotCode || `#DOT-${bounty.id.slice(-6).toUpperCase()}`}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>

              {/* ข้อความโจทย์: หัวข้อปัญหาตัวหนาบรรทัดเดียว + สิ่งที่คาดหวังตัวเทาบรรทัดถัดไป (ไม่มีเครื่องหมายคำพูด ") */}
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                  {problem}
                </h4>
                {expectation && (
                  <p className="text-[11px] text-gray-500 line-clamp-1 font-normal">
                    เป้าหมาย: {expectation}
                  </p>
                )}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Briefcase className="w-3 h-3 text-gray-400" />
                    <span>{bounty.occupation?.name || 'ช่าง/ผู้เชี่ยวชาญ'}</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-brand-red">
                    ค่าตอบแทน: {rewardText}
                  </span>
                </div>
              </div>

              {/* กล่องแจ้งเตือนข้อเสนอ: พื้นขาว ขอบแดง ปุ่มสีแดงสด ไอคอน Lucide Bell */}
              {(() => {
                const pendingNegotiations = (bounty.negotiations || []).filter((n: any) => n.status === 'PENDING');
                const pendingUpgrades = (bounty.upgradeProposals || []).filter((p: any) => p.status === 'PENDING');
                const pendingOffers = pendingNegotiations.length + pendingUpgrades.length;

                if (pendingOffers === 0) return null;

                return (
                  <div className="bg-white border-2 border-brand-red rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs animate-fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4 text-brand-red" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-gray-900">
                          มีผู้สนใจเสนอตัว {pendingOffers} รายการ!
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {pendingNegotiations.length > 0 && `${pendingNegotiations.length} ผู้เสนอตัวรับงาน`}
                          {pendingNegotiations.length > 0 && pendingUpgrades.length > 0 && " • "}
                          {pendingUpgrades.length > 0 && `${pendingUpgrades.length} ข้อเสนออัปเกรด`}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenProposals(bounty)}
                      className="text-xs font-bold bg-brand-red hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      ดูข้อเสนอ
                    </button>
                  </div>
                );
              })()}

              {/* ปุ่มการกระทำ: [เปิดดูการ์ดแก้ไขเบื้องต้น] (ขาว ขอบดำ ตัวหนังสือดำ) + [ดูรายละเอียด] (แดงสด) */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenQuickFix(bounty)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-red" />
                  <span>เปิดดูการ์ดแก้ไขเบื้องต้น</span>
                </button>

                <Link
                  href={`/profile/bounty/${bounty.id}`}
                  className="inline-flex items-center justify-center bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shrink-0 gap-1.5 shadow-2xs"
                >
                  <span>ดูรายละเอียด</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 'การ์ดแก้ไขเบื้องต้น' (Z-Index ทับแถบเมนูด้านล่างเสมอ) */}
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
