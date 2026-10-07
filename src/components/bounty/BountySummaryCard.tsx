import React from 'react';

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
            <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">Power by Make-a-dot </p>
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
        </div>
      </div>

      {/* Optional action buttons slot */}
      {actions && <div className="mt-3.5 w-full">{actions}</div>}
    </div>
  );
}

export default BountySummaryCard;
