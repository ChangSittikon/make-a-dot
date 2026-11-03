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

/**
 * ฟังก์ชันช่วยตัดข้อความภาษาไทยลง Canvas โดยไม่ล้นขอบ
 */
function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const characters = Array.from(text);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < characters.length; i++) {
    const testLine = currentLine + characters[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = characters[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
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
  // สถานะการยืนยันข้อมูล
  const [confirmedState, setConfirmedState] = useState<boolean>(isConfirmed);
  // สถานะ Accordion สำหรับดูรายละเอียดเพิ่มเติม (พับเก็บไว้เป็นค่าเริ่มต้น)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  // ข้อความแจ้งเตือน Toast/Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // สถานะกำลังเซฟรูปภาพ
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);

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
    const origin = typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost:3000';
    return `${origin}/profile/bounty/${bountyId || 'preview'}`;
  };

  const getShareMessage = () => {
    const targetUrl = getShareUrl();

    // ดึงข้อความปัญหา (แก้ไขบั๊กคำซ้ำ: ตัดคำว่า 'ปัญหา:' ที่อาจซ้ำซ้อนออก)
    const problemSec = allSections?.find((s) => s.key === "problem");
    const expectationSec = allSections?.find((s) => s.key === "expectation");

    let extractedProblem = problemSec?.content?.trim();
    let extractedExpectation = expectationSec?.content?.trim();

    if (!extractedProblem) {
      const text = rawDescription || "ตามระบุในระบบ";
      if (text.includes("สิ่งที่คาดหวัง:")) {
        const parts = text.split(/สิ่งที่คาดหวัง\s*:/i);
        extractedProblem = parts[0].replace(/^ปัญหา\s*:\s*/i, "").trim();
        if (!extractedExpectation && parts[1]) {
          extractedExpectation = parts[1].split(/ข้อจำกัด\s*:/i)[0].trim();
        }
      } else {
        extractedProblem = text.replace(/^ปัญหา\s*:\s*/i, "").trim();
      }
    }

    if (!extractedExpectation) {
      extractedExpectation = "ช่วยแก้ปัญหาให้สำเร็จตามตกลง";
    }

    const prizeText = rewardText || "ตามตกลง";

    // โครงสร้างข้อความ Copywriting สำหรับแชร์โซเชียลตามรูปแบบที่กำหนด
    return `🚨 ภารกิจด่วนจาก MAKE A DOT [${displayBountyId}]
ใครแก้ปัญหานี้ได้ รับรางวัลไปเลย!
🎯 ปัญหาคือ: ${extractedProblem}
✨ สิ่งที่ต้องการ: ${extractedExpectation}
💰 ค่าตอบแทน/สิ่งแลกเปลี่ยน: ${prizeText}
👉 ใครทำได้หรือมีไอเดียดีๆ กดลิงก์เข้ามารับงานหรือเสนอตัวช่วยกันเลยที่:
${targetUrl}`;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 5000);
  };

  // 1. กดคัดลอกข้อความ
  const handleCopyShare = () => {
    const shareMessage = getShareMessage();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
    }
    showToast('✓ คัดลอกข้อความการ์ดภารกิจแล้ว! กดวาง (Ctrl+V) ในช่องโพสต์ได้เลย');
  };

  // 2. กดปุ่มแชร์ Facebook (คัดลอกลง Clipboard อัตโนมัติ + แจ้งเตือน + เปิดหน้าต่างแชร์)
  const handleShareFacebook = () => {
    const targetUrl = getShareUrl();
    const shareMessage = getShareMessage();

    // คัดลอกข้อความสรุปภารกิจลง Clipboard อัตโนมัติ
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
    }

    // แสดงข้อความแจ้งเตือน
    showToast('คัดลอกข้อความการ์ดภารกิจแล้ว! กดวาง (Ctrl+V) ในช่องโพสต์ได้เลย');

    // เปิดหน้าต่างแชร์ Facebook
    setTimeout(() => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`,
        '_blank'
      );
    }, 350);
  };

  // 3. กดปุ่มแชร์ LINE (คัดลอกลง Clipboard อัตโนมัติ + แจ้งเตือน + เปิดหน้าต่างแชร์)
  const handleShareLine = () => {
    const targetUrl = getShareUrl();
    const shareMessage = getShareMessage();

    // คัดลอกข้อความสรุปภารกิจลง Clipboard อัตโนมัติ
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
    }

    // แสดงข้อความแจ้งเตือน
    showToast('คัดลอกข้อความการ์ดภารกิจแล้ว! กดวาง (Ctrl+V) ในช่องโพสต์ได้เลย');

    // เปิดหน้าต่างแชร์ LINE
    setTimeout(() => {
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(shareMessage)}`,
        '_blank'
      );
    }, 350);
  };

  // 4. บันทึกเฉพาะส่วนกรอบ 'การ์ดสรุปปัญหา' เป็นไฟล์รูปภาพ PNG คุณภาพสูง
  const handleSaveCardImage = () => {
    try {
      setIsSavingImage(true);

      const canvas = document.createElement('canvas');
      const width = 640;
      const height = 760;
      const scale = 2; // Retina 2x คมชัดสูง

      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsSavingImage(false);
        return;
      }

      ctx.scale(scale, scale);

      // พื้นหลังการ์ดสีขาว
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // กรอบการ์ดสีดำคมชัด
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, width - 36, height - 36);

      // หัวการ์ด: น้องดอทสีแดง
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(52, 54, 16, 0, Math.PI * 2);
      ctx.fill();

      // แสงสะท้อนสีขาวบนตัวน้องดอท
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(47, 49, 4, 0, Math.PI * 2);
      ctx.fill();

      // ชื่อการ์ด: การ์ดสรุปปัญหา
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 20px "Prompt", sans-serif';
      ctx.fillText('การ์ดสรุปปัญหา', 80, 52);

      // สัญลักษณ์ MAKE A DOT
      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 11px "Prompt", sans-serif';
      ctx.fillText('MAKE A DOT', 80, 68);

      // ป้ายรหัสการ์ด
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(width - 200, 38, 94, 28);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.strokeRect(width - 200, 38, 94, 28);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(displayBountyId, width - 188, 56);

      // ป้ายระดับปัญหา
      ctx.fillStyle = '#FEF2F2';
      ctx.fillRect(width - 98, 38, 64, 28);
      ctx.strokeStyle = '#E11D48';
      ctx.lineWidth = 1;
      ctx.strokeRect(width - 98, 38, 64, 28);
      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 11px "Prompt", sans-serif';
      ctx.fillText(scaleConfig.label, width - 88, 56);

      // เส้นแบ่งหัวการ์ด
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(34, 86);
      ctx.lineTo(width - 34, 86);
      ctx.stroke();

      let curY = 106;

      // ส่วนที่ (1): ปัญหาและสิ่งที่คาดหวัง
      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(34, curY, width - 68, 200);
      ctx.strokeStyle = '#E5E7EB';
      ctx.strokeRect(34, curY, width - 68, 200);

      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 13px "Prompt", sans-serif';
      ctx.fillText('• ปัญหา & สิ่งที่คาดหวัง:', 50, curY + 28);

      ctx.fillStyle = '#1F2937';
      ctx.font = 'normal 13px "Prompt", sans-serif';

      const rawText = rawDescription?.trim() || 'ไม่มีรายละเอียดปัญหา';
      const lines = wrapTextLines(ctx, rawText, width - 110);
      lines.slice(0, 7).forEach((line, idx) => {
        ctx.fillText(line, 50, curY + 54 + (idx * 20));
      });

      curY += 218;

      // ส่วนที่ (2): ผู้เชี่ยวชาญที่ต้องการ
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(34, curY, width - 68, 120);
      ctx.strokeStyle = '#E5E7EB';
      ctx.strokeRect(34, curY, width - 68, 120);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 13px "Prompt", sans-serif';
      ctx.fillText('🎯 ผู้เชี่ยวชาญที่ต้องการ:', 50, curY + 30);

      let tagX = 50;
      const tagY = curY + 48;
      const occs = targetOccupations.length > 0 ? targetOccupations : [{ name: 'เปิดรับผู้เชี่ยวชาญทุกด้าน' }];
      occs.slice(0, 3).forEach((occ) => {
        const textWidth = ctx.measureText(occ.name).width;
        ctx.fillStyle = '#FEF2F2';
        ctx.fillRect(tagX, tagY, textWidth + 24, 28);
        ctx.strokeStyle = '#FECDD3';
        ctx.strokeRect(tagX, tagY, textWidth + 24, 28);
        ctx.fillStyle = '#E11D48';
        ctx.font = 'bold 12px "Prompt", sans-serif';
        ctx.fillText(occ.name, tagX + 12, tagY + 19);
        tagX += textWidth + 34;
      });

      curY += 138;

      // ส่วนที่ (3): ค่าตอบแทน / สิ่งแลกเปลี่ยน
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(34, curY, width - 68, 64);
      ctx.strokeStyle = '#E5E7EB';
      ctx.strokeRect(34, curY, width - 68, 64);

      ctx.fillStyle = '#4B5563';
      ctx.font = 'bold 13px "Prompt", sans-serif';
      ctx.fillText('ค่าตอบแทน / สิ่งแลกเปลี่ยน:', 50, curY + 38);

      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 19px "Prompt", sans-serif';
      const prizeStr = rewardText || 'ตามตกลง';
      const rewardWidth = ctx.measureText(prizeStr).width;
      ctx.fillText(prizeStr, width - 50 - rewardWidth, curY + 40);

      curY += 86;

      // ท้ายการ์ด: โลโก้และคำกำกับ
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px "Prompt", sans-serif';
      ctx.fillText('MAKE A DOT • ชุมชนจับคู่คนแก้ปัญหาและโอกาสสร้างรายได้', 50, curY + 20);

      // ดาวน์โหลดไฟล์รูปภาพ PNG
      const imageUri = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `make-a-dot-card-${displayBountyId.replace('#', '')}.png`;
      downloadLink.href = imageUri;
      downloadLink.click();

      showToast('✓ บันทึกรูปการ์ดสรุปปัญหาเรียบร้อย! พร้อมนำไปโพสต์ได้ทันที');
    } catch (err) {
      console.error('Failed to export card image:', err);
      showToast('ไม่สามารถเซฟรูปภาพได้ในขณะนี้');
    } finally {
      setIsSavingImage(false);
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
      {/* 2. กล่อง ACCORDION นอกการ์ด: ดูรายละเอียดเพิ่มเติม (ข้อ 1 ตามคำสั่ง)        */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-800 bg-gray-50/70 hover:bg-gray-100 transition-colors cursor-pointer select-none"
        >
          {/* ข้อความและไอคอนสะอาดตา ไม่มีวงเล็บ [ ] และไม่มีไอคอนกระดาษซ้ำ */}
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-file-lines text-brand-red text-xs" />
            <span>ดูรายละเอียดเพิ่มเติมของงานนี้</span>
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
      {/* 3. ส่วนปุ่มดำเนินการ: จัดการปุ่มตามสถานะการยืนยัน & แถบแชร์โซเชียล         */}
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
          /* ---------------- สถานะยืนยันสำเร็จแล้ว: แถบแชร์ Facebook/LINE + บันทึกรูป ---------------- */
          <div className="space-y-2.5 animate-fade-in">
            {/* แถบปุ่มแชร์โซเชียล โทนสี ขาว-แดง-ดำ สะอาดตา */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2.5">
              <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between">
                <span>แชร์การ์ดนี้เพื่อหาคนช่วย:</span>
                <span className="text-[10px] font-mono text-brand-red font-bold">MAKE A DOT SHARE</span>
              </div>

              {/* 4 ปุ่มหลัก: Facebook | LINE | คัดลอก | บันทึกรูป */}
              <div className="grid grid-cols-4 gap-2">
                {/* 1. ปุ่ม Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-brands fa-facebook text-blue-600 text-sm" />
                  <span>Facebook</span>
                </button>

                {/* 2. ปุ่ม LINE */}
                <button
                  type="button"
                  onClick={handleShareLine}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-brands fa-line text-emerald-500 text-sm" />
                  <span>LINE</span>
                </button>

                {/* 3. ปุ่มคัดลอกข้อความ */}
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-regular fa-copy text-gray-700 text-xs" />
                  <span>คัดลอก</span>
                </button>

                {/* 4. ปุ่มบันทึกรูปการ์ด */}
                <button
                  type="button"
                  onClick={handleSaveCardImage}
                  disabled={isSavingImage}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-regular fa-image text-brand-red text-xs" />
                  <span>{isSavingImage ? "กำลังเซฟ..." : "บันทึกรูป"}</span>
                </button>
              </div>

              {/* ปุ่มบันทึกรูปการ์ดแบบเต็มแถว เพื่อให้แตะง่ายบนมือถือ */}
              <button
                type="button"
                onClick={handleSaveCardImage}
                disabled={isSavingImage}
                className="w-full bg-white hover:bg-red-50 text-brand-red border border-red-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <i className="fa-regular fa-image text-xs" />
                <span>บันทึกรูปการ์ดสรุปปัญหา (นำไปโพสต์ได้ทันที)</span>
              </button>

              {/* ข้อความแจ้งเตือน Toast / Alert ตามโจทย์ */}
              {toastMessage && (
                <div className="text-center text-xs font-bold text-brand-red bg-red-50 border border-red-200 py-2.5 px-3 rounded-xl animate-fade-in flex items-center justify-center gap-2 shadow-sm">
                  <i className="fa-solid fa-circle-check text-brand-red text-sm shrink-0" />
                  <span>{toastMessage}</span>
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