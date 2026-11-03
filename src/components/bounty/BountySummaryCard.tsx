"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { NongDot } from '@/components/flow/NongDot';
import { ImpactScale, IMPACT_SCALE_CONFIG } from '@/config/taxonomy';

export type { ImpactScale };

export interface BountySummaryCardProps {
  bountyId?: string | null;
  statusLabel?: string;
  rawDescription?: string | null;
  requesterName?: string | null;
  requesterProfileId?: string | null;
  requesterWorkTypeName?: string | null;
  requesterIndustryName?: string | null;
  targetOccupations?: Array<{ id?: string; name: string }>;
  targetSkills?: Array<{ id?: string; name: string }>;
  rewardText?: string | null;
  isRequester?: boolean;
  actions?: React.ReactNode;
  className?: string;
  impactScale?: ImpactScale | string | null;
  isConfirmed?: boolean;
  onEdit?: () => void;
  onConfirm?: () => void;
  profileUrl?: string;
}

export function parseProblemSections(text?: string | null) {
  if (!text || !text.trim()) return null;

  const keywordPattern = /(ปัญหา\s*:|สิ่งที่คาดหวัง\s*:|ข้อจำกัด\s*:)/i;
  if (!keywordPattern.test(text)) {
    return null;
  }

  const tokens = text.split(/(ปัญหา\s*:|สิ่งที่คาดหวัง\s*:|ข้อจำกัด\s*:)/i).filter(Boolean);
  const sections: { key: string; label: string; content: string }[] = [];
  let currentKey = "";
  let currentLabel = "";

  for (const token of tokens) {
    const trimmed = token.trim();
    if (/^ปัญหา\s*:$/i.test(trimmed)) {
      if (currentKey) {
        sections.push({ key: currentKey, label: currentLabel, content: "" });
      }
      currentKey = "problem";
      currentLabel = "ปัญหา";
    } else if (/^สิ่งที่คาดหวัง\s*:$/i.test(trimmed)) {
      if (currentKey) {
        sections.push({ key: currentKey, label: currentLabel, content: "" });
      }
      currentKey = "expectation";
      currentLabel = "สิ่งที่คาดหวัง";
    } else if (/^ข้อจำกัด\s*:$/i.test(trimmed)) {
      if (currentKey) {
        sections.push({ key: currentKey, label: currentLabel, content: "" });
      }
      currentKey = "constraint";
      currentLabel = "ข้อจำกัด";
    } else if (currentKey) {
      sections.push({ key: currentKey, label: currentLabel, content: trimmed });
      currentKey = "";
      currentLabel = "";
    } else if (trimmed) {
      sections.push({ key: "other", label: "รายละเอียด", content: trimmed });
    }
  }

  if (currentKey) {
    sections.push({ key: currentKey, label: currentLabel, content: "" });
  }

  return sections.length > 0 ? sections : null;
}

export function BountySummaryCard({
  bountyId,
  statusLabel = "พร้อมส่งตัว",
  rawDescription,
  requesterName,
  requesterProfileId,
  requesterWorkTypeName,
  requesterIndustryName,
  targetOccupations = [],
  targetSkills = [],
  rewardText = "ตามตกลง",
  isRequester = false,
  actions,
  className = "",
  impactScale,
  isConfirmed = false,
  onEdit,
  onConfirm,
  profileUrl,
}: BountySummaryCardProps) {
  // สถานะการยืนยันข้อมูล (ถ้าส่ง isConfirmed=true มาจากหน้า Quest Detail จะแสดงสถานะยืนยันแล้วทันที)
  const [confirmedState, setConfirmedState] = useState<boolean>(isConfirmed);
  // สถานะ Accordion สำหรับดูรายละเอียดเพิ่มเติม (พับเก็บไว้เป็นค่าเริ่มต้น)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  // สถานะการคัดลอกลิงก์
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const displayBountyId = bountyId
    ? `#${bountyId.slice(-6).toUpperCase()}`
    : `#DOT-${Math.floor(100000 + Math.random() * 900000)}`;

  const displayProfileId = requesterProfileId
    ? requesterProfileId.slice(-6).toUpperCase()
    : bountyId
    ? bountyId.slice(-6).toUpperCase()
    : "USER-01";

  const resolvedScale = (typeof impactScale === "string" && impactScale in IMPACT_SCALE_CONFIG)
    ? impactScale as ImpactScale
    : "LOCAL";
  const scaleConfig = IMPACT_SCALE_CONFIG[resolvedScale];

  // แยกส่วนข้อมูลปัญหาและข้อจำกัด
  const allSections = parseProblemSections(rawDescription);
  // ส่วนที่แสดงในการ์ดหลัก: ปัญหา และ สิ่งที่คาดหวัง
  const mainCardSections = allSections
    ? allSections.filter((s) => s.key === "problem" || s.key === "expectation")
    : null;
  // ส่วนที่แยกไปแสดงใน Accordion: ข้อจำกัด
  const constraintSection = allSections?.find((s) => s.key === "constraint");

  // จัดการเมื่อกดยืนยันข้อมูลเข้าระบบ
  const handleConfirmAction = () => {
    setConfirmedState(true);
    if (onConfirm) {
      onConfirm();
    }
  };

  // ลิงก์ปลายทางโปรไฟล์
  const resolvedProfileUrl = profileUrl || (bountyId ? `/profile/bounty/${bountyId}` : "/profile");

  // จัดการแชร์การ์ด
  const getShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://makeadot.app';
    return `${origin}/profile/bounty/${bountyId || 'preview'}`;
  };

  const handleCopyShare = () => {
    const targetUrl = getShareUrl();
    const shareMessage = `🎯 [MAKE A DOT: การ์ดสรุปปัญหา ${displayBountyId}]\n💡 ปัญหา: ${(rawDescription || 'ตามระบุในการ์ด').slice(0, 90)}...\n💰 ค่าตอบแทน: ${rewardText}\n🔗 ดูรายละเอียดและรับงาน: ${targetUrl}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }).catch(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      });
    } else {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div className={`w-full text-left font-prompt space-y-3.5 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. กรอบการ์ดสรุปปัญหา (THEME: ขาว-แดง-ดำ + กิมมิคน้องดอท)                   */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-gray-900 rounded-[22px] p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* ลายน้ำบางๆ มุมการ์ด */}
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full border border-gray-100 pointer-events-none" />

        {/* ---------------- หัวการ์ด: กิมมิคน้องดอท + การ์ดสรุปปัญหา + รหัสและป้ายระดับปัญหา ---------------- */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          {/* ซ้าย: น้องดอท + ชื่อการ์ดสรุปปัญหา */}
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 flex items-center justify-center">
              <NongDot mood="greeting" size={28} color="red" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                  การ์ดสรุปปัญหา
                </h3>
              </div>
              <p className="text-[10px] text-brand-red font-bold tracking-wider uppercase">
                MAKE A DOT
              </p>
            </div>
          </div>

          {/* ขวา: (4) รหัสการ์ดและป้ายระดับปัญหา */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-900 rounded">
              {displayBountyId}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-red bg-red-50 text-brand-red">
              {scaleConfig.label}
            </span>
          </div>
        </div>

        {/* ---------------- ข้อมูลสั้นๆ 4 ส่วนในกรอบการ์ดสีขาว (อ่านจบในแป๊บเดียว) ---------------- */}
        <div className="space-y-3 pt-3">
          {/* (1) ปัญหาและสิ่งที่คาดหวัง */}
          <div className="bg-gray-50/90 rounded-xl p-3 border border-gray-200/90">
            {mainCardSections && mainCardSections.length > 0 ? (
              <div className="space-y-1.5">
                {mainCardSections.map((sec, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 text-xs">
                    <span className="font-bold text-gray-900 shrink-0 inline-flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red inline-block shrink-0" />
                      {sec.label}:
                    </span>
                    <span className="text-gray-800 leading-snug break-words flex-1 font-normal">
                      {sec.content || "-"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-800 leading-snug font-normal whitespace-pre-line break-words">
                {rawDescription && rawDescription.trim() ? (
                  rawDescription.trim()
                ) : (
                  <span className="text-gray-400 italic">ไม่มีรายละเอียดปัญหา</span>
                )}
              </div>
            )}
          </div>

          {/* (2) ผู้เชี่ยวชาญที่ต้องการ */}
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-bullseye text-[10px] text-brand-red" />
              <span>ผู้เชี่ยวชาญที่ต้องการ</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {targetOccupations.map((occ, idx) => (
                <span
                  key={`occ-${occ.id || idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-brand-red border border-red-200 rounded-lg text-xs font-bold"
                >
                  <i className="fa-solid fa-briefcase text-[9px] shrink-0" />
                  <span className="leading-tight">{occ.name}</span>
                </span>
              ))}
              {targetSkills.map((sk, idx) => (
                <span
                  key={`sk-${sk.id || idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-xs font-medium"
                >
                  <i className="fa-solid fa-bolt text-[8px] text-gray-700 shrink-0" />
                  <span className="leading-tight">{sk.name}</span>
                </span>
              ))}
              {targetOccupations.length === 0 && targetSkills.length === 0 && (
                <span className="text-xs text-gray-400 italic">เปิดรับผู้เชี่ยวชาญทุกด้านในสายงาน</span>
              )}
            </div>
          </div>

          {/* (3) ค่าตอบแทน / สิ่งแลกเปลี่ยน */}
          <div className="bg-white rounded-xl px-3.5 py-2.5 border border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">
              ค่าตอบแทน / สิ่งแลกเปลี่ยน
            </span>
            <span className="text-sm sm:text-base font-black text-brand-red tracking-tight">
              {rewardText}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. กล่อง ACCORDION นอกการ์ด: ดูรายละเอียดเพิ่มเติม (พับเก็บไว้เป็นค่าเริ่มต้น) */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-800 bg-gray-50/70 hover:bg-gray-100 transition-colors cursor-pointer select-none"
        >
          <span className="flex items-center gap-1.5">
            <i className="fa-regular fa-file-lines text-brand-red text-xs" />
            <span>[📄 ดูรายละเอียดเพิ่มเติมของงานนี้ (แตะเพื่อเปิด)]</span>
          </span>
          <i
            className={`fa-solid fa-chevron-down text-gray-400 text-[11px] transition-transform duration-200 ${
              isDetailOpen ? "rotate-180 text-gray-700" : ""
            }`}
          />
        </button>

        {isDetailOpen && (
          <div className="p-3.5 space-y-3 border-t border-gray-200 text-xs bg-white animate-fade-in">
            {/* ข้อมูลผู้ส่ง (อาชีพ / สายงาน / ID) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                ข้อมูลผู้ส่งภารกิจ
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200/80 space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500 font-medium">ผู้ส่ง:</span>
                  <span className="font-bold text-gray-900">
                    {isRequester ? "คุณ" : requesterName || "คุณ"} (#{displayProfileId})
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500 font-medium">อาชีพ:</span>
                  <span className="font-bold text-gray-900">
                    {requesterWorkTypeName || "รับจ้างทั่วไป"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500 font-medium">สายงาน:</span>
                  <span className="font-bold text-gray-900">
                    {requesterIndustryName || "ก่อสร้างและอสังหาริมทรัพย์"}
                  </span>
                </div>
              </div>
            </div>

            {/* ข้อจำกัดของงาน (ถ้ามี) */}
            {constraintSection && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  ข้อจำกัดของงาน
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200/80 text-gray-800">
                  {constraintSection.content || "-"}
                </div>
              </div>
            )}

            {/* เกณฑ์การแบ่งงวดงานเบื้องต้น */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                เกณฑ์การแบ่งงวดงานเบื้องต้น (Smart Escrow)
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500">งวด 1</div>
                  <div className="text-xs font-black text-gray-900">20%</div>
                  <div className="text-[9px] text-gray-500">มัดจำ/เตรียมของ</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500">งวด 2</div>
                  <div className="text-xs font-black text-gray-900">40%</div>
                  <div className="text-[9px] text-gray-500">ตรวจรับงานหลัก</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500">งวด 3</div>
                  <div className="text-xs font-black text-brand-red">40%</div>
                  <div className="text-[9px] text-gray-500">ตรวจรับสมบูรณ์</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. ส่วนปุ่มดำเนินการ: จัดการปุ่มตามสถานะการยืนยัน (Requirement 4)           */}
      {/* ========================================================================= */}
      <div className="pt-1">
        {!confirmedState ? (
          /* ---------------- สถานะก่อนกดยืนยัน: ซ่อนปุ่มแชร์ทั้งหมด ---------------- */
          <div className="flex items-center gap-2">
            {actions ? (
              actions
            ) : (
              <>
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 border border-gray-200"
                  >
                    <i className="fa-solid fa-pen-to-square text-xs text-gray-600" />
                    <span>แก้ไข</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="inline-flex items-center justify-center gap-1.5 bg-brand-red hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all flex-1 shadow-md shadow-red-500/20 active:scale-95 cursor-pointer text-center"
                >
                  <span>ยืนยันข้อมูลเข้าระบบ</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </button>
              </>
            )}
          </div>
        ) : (
          /* ---------------- สถานะยืนยันสำเร็จแล้ว: แสดงแถบปุ่มแชร์โทน ขาว-แดง-ดำ ---------------- */
          <div className="space-y-2.5 animate-fade-in">
            {/* แถบปุ่มแชร์โซเชียล โทนสี ขาว-แดง-ดำ สะอาดตา */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between">
                <span>แชร์การ์ดนี้เพื่อหาคนช่วย:</span>
                <span className="text-[10px] font-mono text-brand-red font-bold">MAKE A DOT SHARE</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <i className="fa-brands fa-facebook text-gray-900 text-xs" />
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <i className="fa-brands fa-line text-gray-900 text-xs" />
                  <span>LINE</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-regular fa-copy text-gray-900 text-xs" />
                  <span>คัดลอก</span>
                </button>
              </div>

              {copiedShare && (
                <div className="text-center text-[11px] font-bold text-brand-red bg-red-50 border border-red-200 py-1.5 rounded-lg animate-fade-in">
                  ✓ คัดลอกข้อความและลิงก์เรียบร้อย พร้อมแชร์หาคนช่วยได้ทันที
                </div>
              )}
            </div>

            {/* ปุ่มนำทางไปดู 'การ์ดแก้ไขเบื้องต้น' ในหน้าโปรไฟล์ */}
            <Link
              href={resolvedProfileUrl}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] text-center"
            >
              <span>📋 ไปดู &apos;การ์ดแก้ไขเบื้องต้น&apos; ในหน้าโปรไฟล์ของคุณ</span>
              <i className="fa-solid fa-arrow-right text-xs text-brand-red" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default BountySummaryCard;