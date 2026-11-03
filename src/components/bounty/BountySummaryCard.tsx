"use client";

import React, { useState } from 'react';
import { ImpactScale, IMPACT_SCALE_CONFIG } from '@/config/taxonomy';
import {
  UNIVERSAL_MODULES_CATALOG,
  SPECIALIZED_ROLES_CATALOG,
  UniversalModuleItem,
  SpecializedRoleItem,
} from '@/lib/career-core';

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

export function renderFormattedProblem(text?: string | null) {
  const sections = parseProblemSections(text);

  if (!sections) {
    return (
      <div className="text-xs text-gray-800 leading-snug font-normal whitespace-pre-line break-words">
        {text && text.trim() ? `"${text.trim()}"` : <span className="text-gray-400 italic">ไม่มีรายละเอียด</span>}
      </div>
    );
  }

  return (
    <div className="space-y-1 py-0.5">
      {sections.map((sec, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 text-xs">
          <span className="font-bold text-gray-900 shrink-0 inline-flex items-center gap-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red inline-block shrink-0" />
            {sec.label}:
          </span>
          <span className="text-gray-700 leading-snug break-words flex-1">
            {sec.content ? sec.content : <span className="text-gray-400 italic text-[11px]">-</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * ฟังก์ชันช่วยวิเคราะห์โจทย์และดึงข้อมูลจาก Universal 8 โมดูล + Specialized 7 ตำแหน่ง
 */
function resolveAISolution(
  rawDescription?: string | null,
  targetOccupations: Array<{ id?: string; name: string }> = [],
  targetSkills: Array<{ id?: string; name: string }> = []
) {
  const combinedText = (
    (rawDescription || "") + " " +
    targetOccupations.map(o => o.name).join(" ") + " " +
    targetSkills.map(s => s.name).join(" ")
  ).toLowerCase();

  let matchedRole: SpecializedRoleItem = SPECIALIZED_ROLES_CATALOG[0]; // S01_CONST_PROCUREMENT
  let matchedModule: UniversalModuleItem = UNIVERSAL_MODULES_CATALOG[0]; // U01_PROCUREMENT

  if (combinedText.includes("บัญชี") || combinedText.includes("เงิน") || combinedText.includes("ภาษี") || combinedText.includes("บิล") || combinedText.includes("ค่างวด") || combinedText.includes("หนี้")) {
    matchedRole = SPECIALIZED_ROLES_CATALOG[1] || matchedRole; // S02_REAL_ESTATE_ACCOUNTANT
    matchedModule = UNIVERSAL_MODULES_CATALOG[1] || matchedModule; // U02_ACCOUNTING
  } else if (combinedText.includes("คน") || combinedText.includes("แรงงาน") || combinedText.includes("ช่าง") || combinedText.includes("หาคน") || combinedText.includes("ทิ้งงาน") || combinedText.includes("เซฟตี้") || combinedText.includes("ลูกน้อง")) {
    matchedRole = SPECIALIZED_ROLES_CATALOG[2] || matchedRole; // S03_CONSTRUCTION_HR
    matchedModule = UNIVERSAL_MODULES_CATALOG[2] || matchedModule; // U03_ADMIN_OPS
  } else if (combinedText.includes("สัญญา") || combinedText.includes("ฟ้อง") || combinedText.includes("โกง") || combinedText.includes("อนุญาต") || combinedText.includes("สิทธิ์") || combinedText.includes("เทศบาล") || combinedText.includes("แปลน")) {
    matchedRole = SPECIALIZED_ROLES_CATALOG[3] || matchedRole; // S04_CONST_LEGAL_PERMITS
    matchedModule = UNIVERSAL_MODULES_CATALOG[3] || matchedModule; // U04_LEGAL_RIGHTS
  } else if (combinedText.includes("ขาย") || combinedText.includes("การตลาด") || combinedText.includes("ลูกค้า") || combinedText.includes("เช่า") || combinedText.includes("โปรโมท") || combinedText.includes("เพจ") || combinedText.includes("นายหน้า")) {
    matchedRole = SPECIALIZED_ROLES_CATALOG[4] || matchedRole; // S05_REAL_ESTATE_MARKETER
    matchedModule = UNIVERSAL_MODULES_CATALOG[4] || matchedModule; // U05_BRANDING
  } else if (combinedText.includes("ซ่อม") || combinedText.includes("น้ำรั่ว") || combinedText.includes("ไฟ") || combinedText.includes("อาคาร") || combinedText.includes("นิติ") || combinedText.includes("ท่อ") || combinedText.includes("แอร์") || combinedText.includes("ร้าว")) {
    matchedRole = SPECIALIZED_ROLES_CATALOG[5] || matchedRole; // S06_PROPERTY_FACILITY_MANAGER
    matchedModule = UNIVERSAL_MODULES_CATALOG[6] || matchedModule; // U07_HEALTH_SAFETY
  } else if (combinedText.includes("แอป") || combinedText.includes("ระบบ") || combinedText.includes("โปรแกรม") || combinedText.includes("ไอที") || combinedText.includes("ดิจิทัล") || combinedText.includes("โดรน") || combinedText.includes("bim")) {
    matchedRole = SPECIALIZED_ROLES_CATALOG[6] || matchedRole; // S07_CONSTECH_OPERATOR
    matchedModule = UNIVERSAL_MODULES_CATALOG[7] || matchedModule; // U08_LEARNING_CORE
  }

  // ดึงทักษะกุญแจสำคัญ
  const keySkills = matchedRole.competencyFragments && matchedRole.competencyFragments.length > 0
    ? matchedRole.competencyFragments
    : (matchedModule.coreFragments || [
        "BOQ Reverse Engineering & ถอดรอยราคากลางหาต้นทุนจริง",
        "Supplier Credit Leveraging & เจรจาขยายเครดิตเทอม 45-60 วัน",
        "TCO Assessment & วิเคราะห์ต้นทุนแฝงป้องกันงบบานปลาย",
      ]);

  return {
    matchedRole,
    matchedModule,
    keySkills,
  };
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
}: BountySummaryCardProps) {
  const [activeAISubTab, setActiveAISubTab] = useState<'all' | 'diagnostic' | 'sop' | 'kpi'>('all');
  const [copiedShare, setCopiedShare] = useState(false);

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
  const isMoonshot = resolvedScale === "MOONSHOT";

  // ดึงข้อมูลการประมวลผลสมองกล AI Solution & Quick-Fix SOP
  const aiSolution = resolveAISolution(rawDescription, targetOccupations, targetSkills);

  // ฟังก์ชันกดแชร์ไปยังโซเชียล / จำลองลิงก์
  const handleShareCard = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://makeadot.app';
    const targetUrl = `${origin}/profile/bounty/${bountyId || 'preview'}`;
    const viralHeadline = `🎯 [ภารกิจ Make-a-dot: หาผู้เชี่ยวชาญช่วยแก้ปัญหาด่วน]\n📋 รหัสงาน: ${displayBountyId}\n⚡ AI วินิจฉัย: ต้องการ ${aiSolution.matchedRole.roleName}\n🛠️ ทักษะแกนหลัก: ${aiSolution.matchedModule.shortName}\n⏱️ มี SOP 24 ชม. & สัญญาแบ่งจ่าย Escrow คุ้มครองผู้ว่าจ้างและคนทำงาน\n👉 เปิดดูใบสรุปงานและรับงานได้ที่: ${targetUrl}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(viralHeadline).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3500);
      }).catch(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3500);
      });
    } else {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3500);
    }
  };

  const getFacebookShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://makeadot.app';
    const targetUrl = `${origin}/profile/bounty/${bountyId || 'preview'}`;
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`;
  };

  const getLineShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://makeadot.app';
    const targetUrl = `${origin}/profile/bounty/${bountyId || 'preview'}`;
    const text = `🎯 [Make-a-dot Quest ${displayBountyId}] ต้องการผู้ช่วย: ${aiSolution.matchedRole.roleName}`;
    return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`w-full text-left font-prompt ${className}`}>
      <div className="bg-gradient-to-br from-white via-[#FAFBFD] to-[#F3F4F8] border border-gray-200/90 rounded-[22px] p-4 sm:p-5 shadow-xl relative overflow-hidden group">
        {/* Subtle Visa-style background watermark curves */}
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full border border-gray-200/40 pointer-events-none" />
        <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full border border-gray-200/30 pointer-events-none" />
        <div className="absolute right-6 top-6 w-2 h-2 rounded-full bg-brand-red/30 pointer-events-none" />

        {/* Card Header: Clean & Compact */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/70 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">ใบสรุปงาน</h3>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 bg-white border border-gray-200 text-gray-500 rounded shadow-2xs">
                {displayBountyId}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">Power by Make-a-dot</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {statusLabel}
          </span>
        </div>

        {/* Impact Scale Badge */}
        <div className="flex items-center gap-2 pt-2 relative z-10">
          {isMoonshot ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border border-amber-500/40 bg-gray-900 shadow-sm">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent font-black tracking-widest">MOONSHOT</span>
            </span>
          ) : (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scaleConfig.color}`}>
              {scaleConfig.label}
            </span>
          )}
        </div>

        <div className="space-y-2.5 pt-2.5 relative z-10">
          {/* Section: รายละเอียดปัญหาและเป้าหมาย */}
          <div className="bg-white/90 rounded-xl p-3 border border-gray-200/60 shadow-2xs">
            {renderFormattedProblem(rawDescription)}
          </div>

          {/* Section: ข้อมูลผู้ส่ง (คุณ) */}
          <div className="bg-white/90 rounded-xl p-3 border border-gray-200/60 shadow-2xs">
            {/* Header: ผู้ส่ง + ID Profile */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-1.5 min-w-0">
                <i className="fa-regular fa-user text-[11px] text-gray-400 shrink-0" />
                <span className="text-xs font-bold text-gray-900 truncate">
                  {isRequester ? "ผู้ส่ง (คุณ)" : requesterName ? `ผู้ส่ง: ${requesterName}` : "ผู้ส่ง (คุณ)"}
                </span>
              </div>
              <span className="font-mono text-[9px] font-semibold text-gray-500 bg-gray-100/90 px-2 py-0.5 rounded border border-gray-200/70 shrink-0 whitespace-nowrap">
                ID: #{displayProfileId}
              </span>
            </div>

            {/* รายละเอียด: อาชีพ และ สายงาน */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-medium text-gray-400 shrink-0 w-12 select-none">อาชีพ:</span>
                <span className="font-bold text-gray-900 leading-snug break-words">
                  {requesterWorkTypeName || "รับจ้างทั่วไป"}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-medium text-gray-400 shrink-0 w-12 select-none">สายงาน:</span>
                <span className="font-bold text-gray-900 leading-snug break-words">
                  {requesterIndustryName || "ก่อสร้างและอสังหาริมทรัพย์"}
                </span>
              </div>
            </div>
          </div>

          {/* Section: ผู้เชี่ยวชาญที่ต้องการ */}
          <div className="bg-white/90 rounded-xl p-3 border border-red-100/80 shadow-2xs">
            <div className="text-[10px] font-bold text-brand-red uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-bullseye text-[10px] text-brand-red" />
              ผู้เชี่ยวชาญที่ต้องการ
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {targetOccupations.map((occ, idx) => (
                <span
                  key={`occ-${occ.id || idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-brand-red border border-brand-red/20 rounded-lg text-xs font-bold shadow-2xs"
                >
                  <i className="fa-solid fa-briefcase text-[9px] shrink-0" />
                  <span className="leading-tight">{occ.name}</span>
                </span>
              ))}
              {targetSkills.map((sk, idx) => (
                <span
                  key={`sk-${sk.id || idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium shadow-2xs"
                >
                  <i className="fa-solid fa-bolt text-[8px] text-amber-500 shrink-0" />
                  <span className="leading-tight">{sk.name}</span>
                </span>
              ))}
              {targetOccupations.length === 0 && targetSkills.length === 0 && (
                <span className="text-xs text-gray-400 italic">เปิดรับผู้เชี่ยวชาญทุกด้านในสายงาน</span>
              )}
            </div>
          </div>

          {/* Section: ค่าตอบแทน */}
          <div className="bg-white/90 rounded-xl px-3 py-2 border border-gray-200/60 shadow-2xs flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              ค่าตอบแทน
            </span>
            <span className="text-sm sm:text-base font-black text-brand-red tracking-tight">
              {rewardText}
            </span>
          </div>

          {/* ========================================================================= */}
          {/* SPECIAL BOX: AI Solution & Quick-Fix SOP (ฉบับอัปเกรดสมองกล v7.5)          */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-3.5 sm:p-4 border border-indigo-500/30 shadow-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header: AI Solution & Quick-Fix SOP */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-indigo-700/40 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <i className="fa-solid fa-wand-magic-sparkles text-xs" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    AI Solution & Quick-Fix SOP
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Smart AI Card
                    </span>
                  </h4>
                  <p className="text-[10px] text-indigo-200/80">
                    ดึงข้อมูลจาก Universal 8 โมดูล & Specialized 7 ตำแหน่ง
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                ⚡ ระบบวินิจฉัยสด 24 ชม.
              </span>
            </div>

            {/* Sub-tab Pill Selectors */}
            <div className="flex items-center gap-1 pt-2.5 pb-2 overflow-x-auto no-scrollbar relative z-10 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveAISubTab('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  activeAISubTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40 border border-indigo-400/50'
                    : 'bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                ดูทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => setActiveAISubTab('diagnostic')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activeAISubTab === 'diagnostic'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40 border border-indigo-400/50'
                    : 'bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <span>(ก)</span> AI วินิจฉัย
              </button>
              <button
                type="button"
                onClick={() => setActiveAISubTab('sop')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activeAISubTab === 'sop'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40 border border-indigo-400/50'
                    : 'bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <span>(ข)</span> SOP 24 ชม.
              </button>
              <button
                type="button"
                onClick={() => setActiveAISubTab('kpi')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activeAISubTab === 'kpi'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40 border border-indigo-400/50'
                    : 'bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <span>(ค)</span> เกณฑ์ KPI
              </button>
            </div>

            {/* TAB CONTENTS CONTAINER */}
            <div className="space-y-3 pt-1 relative z-10 text-xs">
              {/* (ก) AI วินิจฉัย: แปลงแท็กปัญหาให้เป็นอาชีพ/ทักษะที่ต้องใช้จริง */}
              {(activeAISubTab === 'all' || activeAISubTab === 'diagnostic') && (
                <div className="bg-white/5 rounded-xl p-3 border border-indigo-400/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <i className="fa-solid fa-microchip text-[10px]" />
                      (ก) AI วินิจฉัย: แมปปิ้งอาชีพและทักษะที่แท้จริง
                    </span>
                    <span className="text-[9px] font-mono text-indigo-300 bg-indigo-900/60 px-1.5 py-0.5 rounded border border-indigo-500/30">
                      {aiSolution.matchedRole.coordinateId}
                    </span>
                  </div>

                  {/* อาชีพที่ต้องใช้จริง */}
                  <div className="bg-indigo-900/40 rounded-lg p-2.5 border border-indigo-500/20">
                    <div className="text-[10px] text-indigo-200/70 font-medium">
                      อาชีพเฉพาะทางที่ต้องใช้ (Specialized Role):
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                      <i className="fa-solid fa-user-gear text-amber-400 text-xs shrink-0" />
                      <span>{aiSolution.matchedRole.roleName}</span>
                    </div>
                    <div className="text-[10px] text-indigo-300/90 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      โมดูลกองกลางรองรับ: <strong className="text-white">{aiSolution.matchedModule.shortName}</strong> ({aiSolution.matchedModule.coordinateId})
                    </div>
                  </div>

                  {/* ปรัชญาแก้เกม */}
                  <div className="bg-slate-900/60 rounded-lg px-2.5 py-2 border border-white/5 text-[11px] text-gray-300 italic">
                    <span className="font-bold text-amber-400 not-italic mr-1">💡 ปรัชญาแก้เกม:</span>
                    &ldquo;{aiSolution.matchedRole.philosophy || aiSolution.matchedModule.philosophy}&rdquo;
                  </div>

                  {/* ทักษะสำคัญที่ต้องใช้จริง */}
                  <div>
                    <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <i className="fa-solid fa-key text-[9px] text-amber-400" />
                      ทักษะกุญแจสำคัญที่ต้องใช้หน้างาน (Key Competencies):
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-200">
                      {aiSolution.keySkills.slice(0, 3).map((skill, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span className="leading-tight">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* (ข) SOP 24 ชม.: แสดงขั้นตอน 3 ข้อที่เจ้าของปัญหาทำเองได้ทันที */}
              {(activeAISubTab === 'all' || activeAISubTab === 'sop') && (
                <div className="bg-white/5 rounded-xl p-3 border border-emerald-400/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <i className="fa-solid fa-stopwatch text-[10px]" />
                      (ข) SOP 24 ชม.: 3 ขั้นตอนที่เจ้าของปัญหาทำได้ทันที
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Action Checklist
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* ขั้นตอนที่ 1 */}
                    <div className="bg-slate-900/70 rounded-lg p-2.5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-emerald-400 tracking-wider">
                          1. ชม. 1-4 : Freeze & Audit
                        </span>
                        <span className="text-[9px] bg-red-950/80 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded font-bold">
                          🛡️ สกัดเงินรั่วไหล
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-200 leading-snug">
                        สำรวจจุดบกพร่อง ถ่ายภาพมุมกว้างและโคลสอัป ทำ Defect Log และลิสต์รายการของที่ขาดลงสมุด <strong>ห้ามจ่ายเงินมัดจำก้อนโตเด็ดขาด</strong>
                      </p>
                    </div>

                    {/* ขั้นตอนที่ 2 */}
                    <div className="bg-slate-900/70 rounded-lg p-2.5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-emerald-400 tracking-wider">
                          2. ชม. 5-12 : Match & Procure
                        </span>
                        <span className="text-[9px] bg-sky-950/80 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded font-bold">
                          ⚖️ เทียบราคากลาง 3 เจ้า
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-200 leading-snug">
                        ใช้เรดาร์จับคู่ช่าง/ผู้เชี่ยวชาญในระบบ หรือโทรเช็กร้านค้า 3 แหล่ง เพื่อขอใบเสนอราคาเทียบ TCO (Total Cost of Ownership) ให้มีทางเลือกสำรอง (BATNA)
                      </p>
                    </div>

                    {/* ขั้นตอนที่ 3 */}
                    <div className="bg-slate-900/70 rounded-lg p-2.5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-emerald-400 tracking-wider">
                          3. ชม. 13-24 : Deploy & Escrow
                        </span>
                        <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                          🤝 ล็อคความเสี่ยง
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-200 leading-snug">
                        ทำสัญญาจ้างย่อย แบ่งชำระเป็น 3 งวด ล็อคเงินผ่านระบบ Escrow หักเงินประกันผลงาน 5-10% พร้อมเงื่อนไขรับประกันงานซ่อมขั้นต่ำ 30-90 วัน
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* (ค) เกณฑ์ KPI แนะนำ: ประเมินรูปแบบการแลกเปลี่ยนและงวดงานเบื้องต้น */}
              {(activeAISubTab === 'all' || activeAISubTab === 'kpi') && (
                <div className="bg-white/5 rounded-xl p-3 border border-amber-400/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-yellow-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <i className="fa-solid fa-scale-balanced text-[10px]" />
                      (ค) เกณฑ์ KPI แนะนำ: งวดงาน & การแลกเปลี่ยน
                    </span>
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/30">
                      Smart Escrow
                    </span>
                  </div>

                  {/* งวดงาน 3 เฟส */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-slate-900/70 p-2 rounded-lg border border-white/10">
                      <div className="text-[9px] font-bold text-gray-400">งวดที่ 1</div>
                      <div className="text-xs font-black text-amber-300">20% มัดจำ</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">เริ่มจัดหาของ</div>
                    </div>
                    <div className="bg-slate-900/70 p-2 rounded-lg border border-white/10">
                      <div className="text-[9px] font-bold text-gray-400">งวดที่ 2</div>
                      <div className="text-xs font-black text-amber-300">40% กลางงาน</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">ตรวจรับ 60-70%</div>
                    </div>
                    <div className="bg-slate-900/70 p-2 rounded-lg border border-white/10">
                      <div className="text-[9px] font-bold text-gray-400">งวดที่ 3</div>
                      <div className="text-xs font-black text-emerald-400">40% ตรวจรับ</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">Test Run 48 ชม.</div>
                    </div>
                  </div>

                  {/* ทางเลือกแลกเปลี่ยนด้วยทรัพยากร (Resource Swap) */}
                  <div className="bg-slate-900/70 rounded-lg p-2.5 border border-indigo-500/20 text-[11px] text-gray-200">
                    <div className="font-bold text-indigo-300 mb-0.5 flex items-center gap-1">
                      <i className="fa-solid fa-recycle text-[10px] text-emerald-400" />
                      ทางเลือกประหยัดทุน (Resource / Sweat Swap):
                    </div>
                    <p className="text-gray-300 text-[10px] leading-snug">
                      สามารถนำ <strong>&ldquo;ทุนชีวิตที่มองไม่เห็น&rdquo;</strong> เช่น เศษวัสดุเหลือใช้, ให้พื้นที่จอดพักของ, หรือส่วนแบ่งรายได้ (Profit-Share) มาหักลบยอดเงินสดได้ 30-50%
                    </p>
                  </div>

                  {/* เกณฑ์ KPI ตรวจรับ */}
                  <div className="space-y-1 text-[11px] text-gray-300">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      เกณฑ์การตรวจรับผลงาน (Acceptance Criteria):
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>ส่งมอบงานตามสเปกและกรอบเวลาที่ตกลง 100% ไม่ทิ้งงาน</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>ผ่านการทดสอบ Defect Test Run ต่อเนื่อง 48 ชม. โดยไม่มีข้อผิดพลาด</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>มีการรับประกันผลงานและบริการแก้ไขปัญหาขั้นต่ำ 30 วัน</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIRAL SHARE BUTTON & POSTER CTA (ข้อ 3 ตามโจทย์)                           */}
          {/* ========================================================================= */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={handleShareCard}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm border border-emerald-400/30 group/share cursor-pointer"
            >
              <span className="text-base sm:text-lg animate-bounce">📲</span>
              <span>แชร์การ์ดภารกิจนี้ไปหาคนช่วยใน Facebook / LINE</span>
            </button>

            {/* Quick Share Sub-Actions */}
            <div className="flex items-center justify-center gap-2 text-[11px]">
              <a
                href={getFacebookShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold flex items-center gap-1 transition-colors"
              >
                <i className="fa-brands fa-facebook text-blue-600" />
                แชร์ Facebook
              </a>
              <a
                href={getLineShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold flex items-center gap-1 transition-colors"
              >
                <i className="fa-brands fa-line text-emerald-500" />
                ส่งต่อใน LINE
              </a>
              <button
                type="button"
                onClick={handleShareCard}
                className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <i className="fa-regular fa-copy text-gray-500" />
                คัดลอกข้อความ
              </button>
            </div>

            {/* Toast Feedback Notification when copied */}
            {copiedShare && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl text-center shadow-md animate-fade-in flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 text-sm" />
                <span>✓ คัดลอกลิงก์การ์ดภารกิจเรียบร้อย! พร้อมนำไปโพสต์หาคนช่วยใน Facebook หรือ LINE ได้ทันที</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional action buttons slot */}
      {actions && <div className="mt-3.5 w-full">{actions}</div>}
    </div>
  );
}

export default BountySummaryCard;